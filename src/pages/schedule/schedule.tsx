const dateFormat = require("dateformat");
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
import { Schedule, setSchedule, setSelectedPlan } from "../../store/reducers/data";
import { setInFlight } from "../../store/reducers/communication";
import { lockOrientation } from "../../utils/screenUtils";
import { useShouldSelectOrganization } from "../account/selectOrgDialog";

import LiveSchedulePopcorn from "../../assets/img/schedule_popcorn.svg";
import StudyScheduleHouse from "../../assets/img/study_house.svg";
import { useUserContext } from "../../context-provider/user-context";
import { setSelectOrgDialogOpen } from "../../store/reducers/control";
import { useServices } from "../../context-provider/services-provider";
import { Fallback } from "../fallback";

// NOTE: China API server(Go lang) accept 10 digits timestamp
const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const nextMonthTimeStamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1 // to make seconds
let tomorrow = new Date(todayTimeStamp * 1000); tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimeStamp = tomorrow.getTime() / 1000
let endOfTomorrow = new Date(tomorrowTimeStamp * 1000); endOfTomorrow.setHours(23, 59, 59);
const endOfTomorrowTimeStamp = endOfTomorrow.getTime() / 1000;

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

export function Schedule() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [key, setKey] = useState(Math.random().toString(36))
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const inFlight = useSelector((state: State) => state.communication.inFlight);

    const { schedulerService } = useServices();

    const { shouldSelect, errCode } = useShouldSelectOrganization();

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, [])

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleTimeViews() {
                if (!schedulerService) return Promise.reject();

                const thisMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, "month", todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, "month", nextMonthTimeStamp, timeZoneOffset);
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
        dispatch(setInFlight(true));

        if (shouldSelect) {
            dispatch(setSelectOrgDialogOpen(true));
        } else {
            dispatch(setSelectOrgDialogOpen(false));
        }

        if (selectedOrg && selectedOrg.organization_id !== "") {
            fetchEverything();
        }

    }, [shouldSelect, selectedOrg, schedulerService, key])

    const user = useSelector((state: State) => state.session.user);
    const [hasOrg, _] = useState(Boolean(user.organizations.length));

    if (errCode && errCode !== 401) {
        const code = `${errCode}`;
        if (code === "403" && !hasOrg) {
            return (
                <Fallback
                    errCode={code}
                    titleMsgId={"err_403_title_not_supported"}
                    subtitleMsgId={"err_403_subtitle_not_supported"}
                    descriptionMsgId={"err_403_description_not_supported"}
                />
            );
        } else {
            return (
                <Fallback
                    errCode={code}
                    titleMsgId={`err_${code}_title`}
                    subtitleMsgId={`err_${code}_subtitle`}
                />
            );
        }
    }

    return (<>
        <Header isHomeRoute setKey={setKey} />
        {inFlight ? <Loading rawText={selectedOrg.organization_id === "" ? "Please select an organization first by tapping the top-left corner!" : ""} /> :
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
    const total = useSelector((state: State) => state.data.schedule.total);
    const live = useSelector((state: State) => state.data.schedule.live);
    const study = useSelector((state: State) => state.data.schedule.study);
    const [loading, setLoading] = useState<boolean>(true);
    const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
    const [tomorrowSchedules, setTomorrowSchedules] = useState<Schedule[]>([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (total.length === 0) { setLoading(false); return; }

        let todaySchedules: Schedule[] = [];
        let tomorrowSchedules: Schedule[] = [];
        let upcomingSchedules: Schedule[] = [];

        if (classType === ClassType.LIVE) {
            todaySchedules = live.filter(s => s.start_at >= todayTimeStamp && s.end_at < tomorrowTimeStamp);
            tomorrowSchedules = live.filter(s => s.start_at >= tomorrowTimeStamp && s.end_at <= endOfTomorrowTimeStamp);
            upcomingSchedules = live.filter(s => s.start_at > endOfTomorrowTimeStamp);
        } else if (classType === ClassType.STUDY) {
            todaySchedules = study.filter(s => s.start_at >= todayTimeStamp && s.end_at < tomorrowTimeStamp);
            tomorrowSchedules = study.filter(s => s.start_at >= tomorrowTimeStamp && s.end_at <= endOfTomorrowTimeStamp);
            upcomingSchedules = study.filter(s => s.start_at > endOfTomorrowTimeStamp);
        }

        setTodaySchedules(todaySchedules);
        setTomorrowSchedules(tomorrowSchedules);
        setUpcomingSchedules(upcomingSchedules);
        setLoading(false);
    }, [classType])

    const [openAlert, setOpenAlert] = useState(false);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") { return; }
        setOpenAlert(false);
    };

    return (loading ? <Loading rawText="Please select an organization first by tapping the top-left corner!" /> : <>
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
    const [liveDate, setLiveDate] = useState<string>("");
    const [liveTime, setLiveTime] = useState<string>("");
    const [teachers, setTeachers] = useState<string>("");

    const { setToken } = useUserContext();
    const { schedulerService } = useServices();

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduleInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }

                const detail = await schedulerService.getScheduleInfo(selectedOrg.organization_id, schedule.id);
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
            setLiveDate(fullDateStr);
            const startAtStr = dateFormat(new Date(info.start_at * 1000), "shortTime", false, false);
            const endAtStr = dateFormat(new Date(info.end_at * 1000), "shortTime", false, false);
            const timeStr = startAtStr + " - " + endAtStr;
            setLiveTime(timeStr);
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

    const goJoin = () => {
        if (!schedulerService) { return; }
        if (!info || !info.detail) { return; }
        dispatch(setSelectedPlan(info.detail.lesson_plan.id));
        schedulerService.getScheduleToken(selectedOrg.organization_id, schedule.id).then((res) => {
            if (res.token) {
                setToken(res.token);
                // TODO: Can we get rid of the token query parameter and just use
                // react component state for keeping and parsing the token instead?
                location.href = `#/join?token=${res.token}`;
            } else {
                setOpenAlert(true); return;
            }
        })
    }

    return (
        <ListItem button onClick={goJoin}>
            <ListItemAvatar>
                <Avatar alt={classType === ClassType.LIVE ? "Live schedule" : "Study schedule"} className={listItemAvatar}>
                    <img src={classType === ClassType.LIVE ? LiveSchedulePopcorn : StudyScheduleHouse} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{schedule.title}</Typography>}
                secondary={info && info.detail ?
                    classType === ClassType.LIVE
                        ? <Typography variant="caption" color="textSecondary">{`${liveTime}, ${liveDate}`}</Typography>
                        : <>
                            <Typography variant="caption" color="textSecondary">{teachers === "" ? "" : `Assigned by: ${info.detail.teachers[0].name}`}</Typography>
                            <Typography variant="caption" color="textSecondary" style={{ fontStyle: "italic" }}>{` - ${info.detail.program.name}`}</Typography>
                        </>
                    : undefined}
            />
        </ListItem>
    )
}