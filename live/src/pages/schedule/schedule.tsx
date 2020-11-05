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
import StyledIcon from "../../components/styled/icon";
import Loading from "../../components/loading";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { Schedule, setSchedule, setSchedulePage, setSelectedPlan } from "../../store/reducers/data";
import { setInFlight, setFailure } from "../../store/reducers/communication";

import SchedulePopcorn from "../../assets/img/schedule_popcorn.svg";
import StudyHouse from "../../assets/img/study_house.svg";

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

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
    const inFlight = useSelector((state: State) => state.communication.inFlight);
    const { total } = useSelector((state: State) => state.data.schedule);

    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const timeZoneOffset = now.getTimezoneOffset() * 60 * -1 // to make seconds
    async function getScheduleTimeViews(timeAt: number, timeZoneOffset: number) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules_time_view?view_type=month&time_at=${timeAt}&time_zone_offset=${timeZoneOffset}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleTimeViews() {
                const thisMonthSchedules = await getScheduleTimeViews(today / 1000, timeZoneOffset);
                const nextMonthSchedules = await getScheduleTimeViews(nextMonth / 1000, timeZoneOffset);
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
                console.error(`Fail to fetchScheduleTimeViews: ${err}`)
                // dispatch(setFailure(true));
            } finally {
                dispatch(setInFlight(false));
            }
        }
        dispatch(setInFlight(true));
        fetchEverything();
    }, [])

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", overflow: "hidden" }}
        >
            {inFlight ? <Loading /> : (
                <Grid
                    wrap="nowrap"
                    container
                    direction="column"
                    justify="flex-start"
                    item
                    style={{ maxHeight: `calc(100% - ${theme.spacing(10)})`, flexGrow: 1, overflowX: "hidden", overflowY: "auto" }}
                >
                    <ScheduleList />
                </Grid>
            )}
            <Grid
                container
                direction="row"
                justify="space-between"
                item
                style={{ position: "fixed", bottom: 0, flexGrow: 0, height: theme.spacing(10) }}
            >
                <SwitchClassType />
            </Grid>
        </Grid>
    )
}

function ScheduleList() {
    const { listRoot, listSubheaderText } = useStyles();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfToday = today / 1000;
    let tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = (new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()).getTime()) / 1000;
    const endOfTomorrow = (new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1).getTime()) / 1000;

    const todayStr = dateFormat(now, "fullDate", false, false);
    const tomorrowStr = dateFormat(tomorrow, "fullDate", false, false);

    const classType = useSelector((state: State) => state.session.classType);
    const { live, study } = useSelector((state: State) => state.data.schedule);

    const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
    const [tomorrowSchedules, setTomorrowSchedules] = useState<Schedule[]>([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (classType === ClassType.LIVE) {
            if (live.length === 0) { return; }
            const todaySchedules = live.filter(s => s.start_at >= startOfToday && s.end_at < startOfTomorrow);
            const tomorrowSchedules = live.filter(s => s.start_at >= startOfTomorrow && s.end_at < endOfTomorrow);
            const upcomingSchedules = live.filter(s => s.start_at >= endOfTomorrow);
            setTodaySchedules(todaySchedules);
            setTomorrowSchedules(tomorrowSchedules);
            setUpcomingSchedules(upcomingSchedules);
        } else if (classType === ClassType.STUDY) {
            const todaySchedules = study.filter(s => s.start_at >= startOfToday && s.end_at < startOfTomorrow);
            const tomorrowSchedules = study.filter(s => s.start_at >= startOfTomorrow && s.end_at < endOfTomorrow);
            const upcomingSchedules = study.filter(s => s.start_at >= endOfTomorrow);
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
    const history = useHistory();

    // const re = /(,\s).*$/g; // Fix regex
    const mmmmdyyyy = primaryText.substr(primaryText.indexOf(",") + 2);
    const dddd = primaryText.split(" ")[0];
    const startAt = dateFormat(schedule.start_at, "shortTime");
    const endAt = dateFormat(schedule.end_at, "shortTime");

    const [info, setInfo] = useState<Schedule>();
    const [teachers, setTeachers] = useState<string>("");

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

    const goJoin = () => {
        history.push("join")
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