const dateFormat = require('dateformat');
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from "@material-ui/core/Typography";

import SwitchClassType from "./switchClassType";
import { Error, DESCRIPTION_403 } from "../error";
import StyledIcon from "../../components/styled/icon";
import Loading from "../../components/loading";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { Schedule, setSchedule, setSelectedPlan } from "../../store/reducers/data";
import { setInFlight, setErrCode } from "../../store/reducers/communication";

import SchedulePopcorn from "../../assets/img/schedule_popcorn.svg";
import StudyHouse from "../../assets/img/study_house.svg";

// NOTE: China API server(Go lang) accept 10 digits timestamp
const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const nextMonthTimeStamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1 // to make seconds
let tomorrow = new Date(todayTimeStamp * 1000); tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimeStamp = tomorrow.getTime() / 1000
let endOfTomorrow = new Date(tomorrowTimeStamp * 1000); endOfTomorrow.setHours(23, 59, 59);
const endOfTomorrowTimeStamp = endOfTomorrow.getTime() / 1000;
const todayStr = dateFormat(now, "fullDate", false, false);
const tomorrowStr = dateFormat(tomorrow, "fullDate", false, false);

// console.log("today: ", new Date(now.getFullYear(), now.getMonth(), now.getDate()))
// console.log("todayTimeStamp: ", todayTimeStamp)
// console.log("nextMonthTimeStamp: ", new Date(now.getFullYear(), now.getMonth() + 1, 1))
// console.log("timeZoneOffset: ", timeZoneOffset)
// console.log("tomorrow: ", tomorrow)
// console.log("tomorrowTimeStamp: ", tomorrowTimeStamp)
// console.log("endOfTomorrow: ", endOfTomorrow)
// console.log("endOfTomorrowTimeStamp: ", endOfTomorrowTimeStamp)
// console.log("todayStr: ", todayStr)
// console.log("tomorrowStr: ", tomorrowStr)

const useStyles = makeStyles((theme: Theme) => ({
    listRoot: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    listSubheaderText: {
        fontWeight: 900
    },
    listItemAvatar: {
        backgroundColor: "#C5E9FB"
    },
    listItemTextPrimary: {
        color: "#0C3680",
        fontWeight: 900
    }
}));

const CMS_ENDPOINT = process.env.ENDPOINT_KL2 !== undefined ? process.env.ENDPOINT_KL2 : "";

export function Schedule() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const inFlight = useSelector((state: State) => state.communication.inFlight);
    const { total, live, study } = useSelector((state: State) => state.data.schedule);

    async function getScheduleTimeViews(timeAt: number, timeZoneOffset: number) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules_time_view?view_type=month&time_at=${timeAt}&time_zone_offset=${timeZoneOffset}&org_id=${selectedOrg.organization_id}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return [];
        }
    }

    useEffect(() => {
        if (!selectedOrg) {
            dispatch(setErrCode(403));
        } else {
            async function fetchEverything() {
                async function fetchScheduleTimeViews() {
                    const thisMonthSchedules = await getScheduleTimeViews(todayTimeStamp, timeZoneOffset);
                    const nextMonthSchedules = await getScheduleTimeViews(nextMonthTimeStamp, timeZoneOffset);
                    const totalSchedules = thisMonthSchedules.concat(nextMonthSchedules);
                    // console.log("totalSchedules: ", totalSchedules)
                    const liveSchedules = totalSchedules.filter((s: any) => s.class_type === "OnlineClass")
                    const studySchedules = totalSchedules.filter((s: any) => s.class_type === "Homework")
                    dispatch(setSchedule({ total: totalSchedules, live: liveSchedules, study: studySchedules }))
                }

                try {
                    await Promise.all([fetchScheduleTimeViews()])
                    // console.log("total, live, study: ", total, live, study)
                } catch (err) {
                    dispatch(setSchedule({ total: [], live: [], study: [] }))
                    console.error(`Fail to fetchScheduleTimeViews: ${err}`)
                    // dispatch(setFailure(true));
                } finally {
                    dispatch(setInFlight(false));
                }
            }
            if (selectedOrg && selectedOrg.organization_id) {
                dispatch(setInFlight(true));
                fetchEverything();
            }
        }
    }, [selectedOrg])

    if (!selectedOrg) { return <Error errCode={403} description={DESCRIPTION_403} />; }
    return (<>
        {inFlight ? <Loading /> :
            <Grid
                wrap="nowrap"
                container
                direction="column"
                justify="flex-start"
                item
                style={{ maxHeight: `calc(100% - ${theme.spacing(10)})`, flexGrow: 1, overflowX: "hidden", overflowY: "auto" }}
            >
                <ScheduleList total={total} live={live} study={study} />
            </Grid>
        }
        <Grid
            container
            direction="row"
            justify="space-between"
            item
            style={{ position: "fixed", bottom: 0, flexGrow: 0, height: theme.spacing(10) }}
        >
            <SwitchClassType />
        </Grid>
    </>)
}

function ScheduleList({ total, live, study }: {
    total: Schedule[],
    live: Schedule[],
    study: Schedule[]
}) {
    const { listRoot, listSubheaderText } = useStyles();

    const classType = useSelector((state: State) => state.session.classType);
    const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
    const [tomorrowSchedules, setTomorrowSchedules] = useState<Schedule[]>([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (classType === ClassType.LIVE) {
            if (live.length === 0) { return; }
            const todaySchedules = live.filter(s => s.start_at >= todayTimeStamp && s.end_at < tomorrowTimeStamp);
            const tomorrowSchedules = live.filter(s => s.start_at >= tomorrowTimeStamp && s.end_at <= endOfTomorrowTimeStamp);
            const upcomingSchedules = live.filter(s => s.start_at > endOfTomorrowTimeStamp);
            setTodaySchedules(todaySchedules);
            setTomorrowSchedules(tomorrowSchedules);
            setUpcomingSchedules(upcomingSchedules);
        } else if (classType === ClassType.STUDY) {
            const todaySchedules = study.filter(s => s.start_at >= todayTimeStamp && s.end_at < tomorrowTimeStamp);
            const tomorrowSchedules = study.filter(s => s.start_at >= tomorrowTimeStamp && s.end_at <= endOfTomorrowTimeStamp);
            const upcomingSchedules = study.filter(s => s.start_at > endOfTomorrowTimeStamp);
            setTodaySchedules(todaySchedules);
            setTomorrowSchedules(tomorrowSchedules);
            setUpcomingSchedules(upcomingSchedules);
        } else {
            return
        }
    }, [])

    return (<>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-today"
                subheader={
                    <ListSubheader component="div" id="list-subheader-today">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>TODAY</Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {todaySchedules.length === 0 ? <ListItem><Typography variant="body2" color="textSecondary">Nothing scheduled</Typography></ListItem> :
                    todaySchedules.map((schedule: Schedule, i) =>
                        <ScheduleItem key={`${schedule.id}-${i}`} classType={classType} schedule={schedule} primaryText={todayStr} />
                    )
                }
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-tomorrow"
                subheader={
                    <ListSubheader component="div" id="list-subheader-today">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>TOMORROW</Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {tomorrowSchedules.length === 0 ? <ListItem><Typography variant="body2" color="textSecondary">Nothing scheduled</Typography></ListItem> :
                    tomorrowSchedules.map((schedule: any, i, a) =>
                        <ScheduleItem key={schedule.id} classType={classType} schedule={schedule} primaryText={tomorrowStr} />
                    )
                }
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-scheduled-classes"
                subheader={
                    <ListSubheader component="div" id="list-subheader-today">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>SCHEDULED CLASSES</Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {upcomingSchedules.length === 0 ? <ListItem><Typography variant="body2" color="textSecondary">Nothing scheduled</Typography></ListItem> :
                    upcomingSchedules.map((schedule: any, i, a) =>
                        <ScheduleItem key={schedule.id} classType={classType} schedule={schedule} primaryText={tomorrowStr} />
                    )
                }
            </List>
        </Grid>
    </>)
}

function ScheduleItem({ classType, schedule, primaryText }: {
    classType: ClassType,
    schedule: any,
    primaryText: string,
}) {
    const { listItemAvatar, listItemTextPrimary } = useStyles();
    const dispatch = useDispatch();

    // const re = /(,\s).*$/g; // Fix regex
    const mmmmdyyyy = primaryText.substr(primaryText.indexOf(",") + 2);
    const dddd = primaryText.split(" ")[0];
    const startAt = dateFormat(schedule.start_at, "shortTime");
    const endAt = dateFormat(schedule.end_at, "shortTime");

    const [info, setInfo] = useState<Schedule>();
    const [teachers, setTeachers] = useState<string>("");
    const [liveToken, setLiveToken] = useState<string>("");

    async function getScheduleInfo() {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        // console.log(schedule.id)
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules/${schedule.id}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleInfo() {
                const schedule = await getScheduleInfo();
                // console.log("schedule: ", schedule)
                setInfo(schedule);
                dispatch(setSelectedPlan(schedule.lesson_plan.id));
                const teachers = schedule.teachers
                if (teachers.length > 0) {
                    let teacherList = []
                    for (const teacher of teachers) {
                        teacherList.push(teacher.name);
                    }
                    setTeachers(teacherList.join(", "))
                }
            }
            try {
                await Promise.all([fetchScheduleInfo()])
            } catch (err) {
                console.error(`Fail to fetchScheduleInfo: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [])

    async function getScheduleLiveToken(lessonPlanId: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules/${lessonPlanId}/live/token`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        async function fetchEverything(lessonPlanId: string) {
            async function fetchScheduleLiveToken() {
                const { token } = await getScheduleLiveToken(lessonPlanId);
                setLiveToken(token);
            }
            try {
                await Promise.all([fetchScheduleLiveToken()])
            } catch (err) {
                console.error(`Fail to fetchScheduleInfo: ${err}`)
            } finally { }
        }
        if (info && info.lesson_plan_id) {
            fetchEverything(info.lesson_plan_id);
        }
    }, [liveToken])

    const goJoin = () => {
        const search = classType === ClassType.LIVE ? `/?token=${liveToken}` : ""
        location.href = `${search}#/join`
    }

    return (classType === ClassType.LIVE ?
        <ListItem button onClick={goJoin}>
            <ListItemAvatar>
                <Avatar className={listItemAvatar}>
                    <img src={SchedulePopcorn} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{mmmmdyyyy}</Typography>}
                secondary={<Typography variant="caption" color="textSecondary">{`${dddd} ${startAt} - ${endAt}`}</Typography>}
            />
        </ListItem> :
        <ListItem button onClick={goJoin}>
            <ListItemAvatar>
                <Avatar className={listItemAvatar}>
                    <img src={StudyHouse} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{schedule.title}</Typography>}
                secondary={info && info.detail ? <>
                    <Typography variant="caption" color="textSecondary">{teachers === "" ? "" : `Assigned by: ${info.detail.teachers[0].name}`}</Typography>
                    {/* <Typography variant="caption" color="textSecondary">{"Isu Ahn, Potential Destructor, Bug Creator"}</Typography> */}
                    <Typography variant="caption" color="textSecondary" style={{ fontStyle: "italic" }}>{` - ${info.detail.program.name}`}</Typography>
                </> : undefined}
            />
        </ListItem>
    )
}