const dateFormat = require("dateformat");
const qs = require("qs");
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import SwitchClassType from "./switchClassType";
import { Header } from "../../components/header";
import Loading from "../../components/loading";
import { State } from "../../store/store";
import { ClassType, OrientationType } from "../../store/actions";
import { Schedule, ScheduleDetail, setSchedule, setSelectedPlan } from "../../store/reducers/data";
import { setInFlight, setErrCode } from "../../store/reducers/communication";
import { lockOrientation } from "../../utils/screenUtils";

import LiveSchedulePopcorn from "../../assets/img/schedule_popcorn.svg";
import StudyScheduleHouse from "../../assets/img/study_house.svg";
import { useUserContext } from "../../context-provider/user-context";

// NOTE: China API server(Go lang) accept 10 digits timestamp
const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const nextMonthTimeStamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1 // to make seconds
let tomorrow = new Date(todayTimeStamp * 1000); tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimeStamp = tomorrow.getTime() / 1000
let endOfTomorrow = new Date(tomorrowTimeStamp * 1000); endOfTomorrow.setHours(23, 59, 59);
const endOfTomorrowTimeStamp = endOfTomorrow.getTime() / 1000;

// console.log("today: ", new Date(now.getFullYear(), now.getMonth(), now.getDate()))
// console.log("todayTimeStamp: ", todayTimeStamp)
// console.log("nextMonthTimeStamp: ", new Date(now.getFullYear(), now.getMonth() + 1, 1))
// console.log("timeZoneOffset: ", timeZoneOffset)
// console.log("tomorrow: ", tomorrow)
// console.log("tomorrowTimeStamp: ", tomorrowTimeStamp)
// console.log("endOfTomorrow: ", endOfTomorrow)
// console.log("endOfTomorrowTimeStamp: ", endOfTomorrowTimeStamp)

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

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, [])

    // https://swagger-ui.kidsloop.net/#/schedule/getScheduleTimeView
    async function getScheduleTimeViews(timeAt: number, timeZoneOffset: number) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const encodedParams = qs.stringify({
            view_type: "month",
            time_at: timeAt,
            time_zone_offset: timeZoneOffset,
            org_id: selectedOrg.organization_id
        }, { encodeValuesOnly: true });
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules_time_view?${encodedParams}`, {
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
        async function fetchEverything() {
            async function fetchScheduleTimeViews() {
                const thisMonthSchedules = await getScheduleTimeViews(todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await getScheduleTimeViews(nextMonthTimeStamp, timeZoneOffset);
                const totalSchedules = thisMonthSchedules.concat(nextMonthSchedules);
                const liveSchedules = totalSchedules.filter((s: any) => s.class_type === "OnlineClass")
                const studySchedules = totalSchedules.filter((s: any) => s.class_type === "Homework")
                dispatch(setSchedule({ total: totalSchedules, live: liveSchedules, study: studySchedules }))
            }

            try {
                await Promise.all([fetchScheduleTimeViews()])
            } catch (err) {
                dispatch(setSchedule({ total: [], live: [], study: [] }))
                console.error(`Fail to fetchScheduleTimeViews: ${err}`)
            } finally {
                dispatch(setInFlight(false));
            }
        }
        if (selectedOrg && selectedOrg.organization_id) {
            dispatch(setInFlight(true));
            fetchEverything();
        }
    }, [selectedOrg])

    return (<>
        <Header isHomeRoute />
        {inFlight ? <Loading /> :
            <Grid
                wrap="nowrap"
                container
                direction="column"
                justify="flex-start"
                item
                style={{ flexGrow: 1, overflowY: "auto" }}
            >
                <ScheduleList />
            </Grid>
        }
        <Grid
            container
            direction="row"
            justify="space-between"
            item
            style={{ flexGrow: 0, height: theme.spacing(10) }}
        >
            <SwitchClassType />
        </Grid>
    </>)
}

function ScheduleList() {
    const { listRoot, listSubheaderText } = useStyles();
    const classType = useSelector((state: State) => state.session.classType);
    const { live, study } = useSelector((state: State) => state.data.schedule);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<Schedule[]>([]);
    const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
    const [tomorrowSchedules, setTomorrowSchedules] = useState<Schedule[]>([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        classType === ClassType.LIVE ? setTotal(live) : setTotal(study);
    }, [classType])

    useEffect(() => {
        if (total.length > 0) {
            const todaySchedules = total.filter(s => s.start_at >= todayTimeStamp && s.end_at < tomorrowTimeStamp);
            const tomorrowSchedules = total.filter(s => s.start_at >= tomorrowTimeStamp && s.end_at <= endOfTomorrowTimeStamp);
            const upcomingSchedules = total.filter(s => s.start_at > endOfTomorrowTimeStamp);
            setTodaySchedules(todaySchedules);
            setTomorrowSchedules(tomorrowSchedules);
            setUpcomingSchedules(upcomingSchedules);
        }
        setLoading(false);
    }, [total])

    const [openAlert, setOpenAlert] = useState(false);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") { return; }
        setOpenAlert(false);
    };

    return (loading ? <Loading /> : <>
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
                        <ScheduleItem key={`${schedule.id}-${i}`} classType={classType} schedule={schedule} setOpenAlert={setOpenAlert} />
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
                    tomorrowSchedules.map((schedule: Schedule, i, a) =>
                        <ScheduleItem key={schedule.id} classType={classType} schedule={schedule} setOpenAlert={setOpenAlert} />
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
                    upcomingSchedules.map((schedule: Schedule, i, a) =>
                        <ScheduleItem key={schedule.id} classType={classType} schedule={schedule} setOpenAlert={setOpenAlert} />
                    )
                }
            </List>
        </Grid>
        <Snackbar open={openAlert} autoHideDuration={3500} onClose={handleClose}>
            <Alert onClose={handleClose} variant="filled" severity="error">
                <FormattedMessage id="error_unknown_error" />
            </Alert>
        </Snackbar>
    </>)
}

function ScheduleItem({ classType, schedule, setOpenAlert }: {
    classType: ClassType,
    schedule: Schedule,
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listItemAvatar, listItemTextPrimary } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const [info, setInfo] = useState<Schedule>();
    const [livePrimaryText, setLivePrimaryText] = useState<string>("");
    const [liveSecondaryText, setLiveSecondaryText] = useState<string>("");
    const [teachers, setTeachers] = useState<string>("");

    const { setToken } = useUserContext();

    // https://swagger-ui.kidsloop.net/#/schedule/getScheduleByID
    async function getScheduleInfo() {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const encodedParams = qs.stringify({ org_id: selectedOrg.organization_id }, { encodeValuesOnly: true });
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules/${schedule.id}?${encodedParams}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleInfo() {
                const detail: ScheduleDetail = await getScheduleInfo();
                setInfo({
                    ...schedule,
                    detail: detail
                });
            }
            try {
                await Promise.all([fetchScheduleInfo()])
            } catch (err) {
                console.error(`Fail to fetchScheduleInfo: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [classType])

    useEffect(() => {
        if (!info || !info.detail) { return; }
        if (classType === ClassType.LIVE) {
            const fullDateStr = dateFormat(new Date(schedule.start_at * 1000), "fullDate", false, false);
            const monthDDYYYY: string = fullDateStr.substr(fullDateStr.indexOf(",") + 2); // TODO (Isu): Use regex
            setLivePrimaryText(monthDDYYYY);
            // TODO (Isu): Use regex
            // const reDayOfWeek = /^(Sun|Mon|(T(ues|hurs))|Fri)(day|\.)?$|Wed(\.|nesday)?$|Sat(\.|urday)?$|T((ue?)|(hu?r?))\.?$/i
            // const reResult = monthDDYYYY.match(reDayOfWeek);
            // const dayOfWeekStr = reResult !== null ? reResult[0] + ", " : "" // ex) `Monday, ` | ""
            const dayOfWeekStr = fullDateStr.split(" ")[0];
            const startAtStr = dateFormat(new Date(info.start_at * 1000), "shortTime", false, false);
            const endAtStr = dateFormat(new Date(info.end_at * 1000), "shortTime", false, false);
            const fullSecondaryText = dayOfWeekStr + startAtStr + " - " + endAtStr;
            setLiveSecondaryText(fullSecondaryText);
        } else {
            const teachers = info.detail.teachers
            if (teachers.length > 0) {
                let teacherList = []
                for (const teacher of teachers) {
                    teacherList.push(teacher.name);
                }
                setTeachers(teacherList.join(", "))
            }
        }
    }, [info])

    // https://swagger-ui.kidsloop.net/#/schedule/getScheduleLiveToken
    async function getScheduleLiveToken() {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const encodedParams = qs.stringify({ org_id: selectedOrg.organization_id }, { encodeValuesOnly: true });
        const response = await fetch(`${CMS_ENDPOINT}/v1/schedules/${schedule.id}/live/token?${encodedParams}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    const goJoin = () => {
        if (!info || !info.detail) { return; }
        dispatch(setSelectedPlan(info.detail.lesson_plan.id));
        if (classType === ClassType.LIVE) {
            getScheduleLiveToken().then((res) => {
                if (res.token) {
                    setToken(res.token);

                    // TODO: Can we get rid of the token query parameter and just use
                    // react component state for keeping and parsing the token instead?
                    location.href = `#/join?token=${res.token}`;
                } else {
                    setOpenAlert(true); return;
                }
            })
        } else {
            location.href = `#/join`;
        }
    }

    return (classType === ClassType.LIVE ?
        <ListItem button onClick={goJoin}>
            {/* TODO: Adjust src size */}
            <ListItemAvatar>
                <Avatar alt="Live schedule" src={LiveSchedulePopcorn} imgProps={{ height: 24 }} className={listItemAvatar} />
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{livePrimaryText}</Typography>}
                secondary={<Typography variant="caption" color="textSecondary">{liveSecondaryText}</Typography>}
            />
        </ListItem> :
        <ListItem button onClick={goJoin}>
            {/* TODO: Adjust src size */}
            <ListItemAvatar>
                <Avatar alt="Study schedule" src={StudyScheduleHouse} imgProps={{ height: 24 }} className={listItemAvatar} />
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{schedule.title}</Typography>}
                secondary={info && info.detail ? <>
                    <Typography variant="caption" color="textSecondary">{teachers === "" ? "" : `Assigned by: ${info.detail.teachers[0].name}`}</Typography>
                    <Typography variant="caption" color="textSecondary" style={{ fontStyle: "italic" }}>{` - ${info.detail.program.name}`}</Typography>
                </> : undefined}
            />
        </ListItem>
    )
}