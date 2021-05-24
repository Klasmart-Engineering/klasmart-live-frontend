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

import ScheduledLivePopcorn from "../../assets/img/schedule_popcorn.svg";
import ScheduledStudyHouse from "../../assets/img/study_house.svg";

import ClassTypeSwitcher from "./classTypeSwitcher";
import { useShouldSelectOrganization } from "../account/selectOrgDialog";
import { Fallback } from "../fallback";
import { Header } from "../../components/header";
import Loading from "../../components/loading";
import { useSessionContext } from "../../context-provider/session-context";
import { useServices } from "../../context-provider/services-provider";
import { State } from "../../store/store";
import { ScheduleClassType, ScheduleTimeViewResponse, ScheduleResponse, TimeView } from "../../services/cms/ISchedulerService";
import { ClassType, OrientationType } from "../../store/actions";
import { setInFlight } from "../../store/reducers/communication";
import { setSelectOrgDialogOpen } from "../../store/reducers/control";
import {
    setScheduleTimeViewAll,
    setScheduleTimeViewLiveAll,
    setScheduleTimeViewStudyAll,
    setScheduleTimeViewLiveToday,
    setScheduleTimeViewLiveTomorrow,
    setScheduleTimeViewLiveUpcoming,
    setScheduleStudyAnytime,
    setScheduleStudyDueDate,
    setLessonPlanIdOfSelectedSchedule,
    setScheduleTimeViewStudyAnytime
} from "../../store/reducers/data";
import { lockOrientation } from "../../utils/screenUtils";
import { autoHideDuration } from "../../utils/fixedValues";

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
        marginTop: theme.spacing(2)
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
    const classType = useSelector((state: State) => state.session.classType);
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const inFlight = useSelector((state: State) => state.communication.inFlight);

    const { schedulerService } = useServices();
    const { shouldSelect, errCode } = useShouldSelectOrganization();

    const [key, setKey] = useState(Math.random().toString(36))
    const [alertMessageId, setAlertMessageId] = useState<string>();
    const [openAlert, setOpenAlert] = useState(false);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") { return; }
        setOpenAlert(false);
    };

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, [])

    useEffect(() => {
        async function fetchEverything() {
            async function fetchSchedules() {
                if (!schedulerService) return Promise.reject();
                // TODO (Isu): Apply more API params to filter. It makes don't need to do .filter().
                const thisMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, TimeView.MONTH, todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, TimeView.MONTH, nextMonthTimeStamp, timeZoneOffset);
                const timeViewStudyAnytime = await schedulerService.getAnytimeStudyScheduleTimeViews(selectedOrg.organization_id);

                const timeViewAll = thisMonthSchedules.concat(nextMonthSchedules);
                const timeViewLiveAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.LIVE);
                const timeViewStudyAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.STUDY && tv.due_at !== 0 && tv.is_home_fun === false);
                const timeViewStudyAnytimeNoHomeFun = timeViewStudyAnytime.filter((tv: ScheduleTimeViewResponse) => tv.is_home_fun === false);

                dispatch(setScheduleTimeViewAll(timeViewAll));
                dispatch(setScheduleTimeViewLiveAll(timeViewLiveAll));
                dispatch(setScheduleTimeViewStudyAll(timeViewStudyAll));
                dispatch(setScheduleTimeViewStudyAnytime(timeViewStudyAnytimeNoHomeFun));

                let timeViewLiveToday: ScheduleTimeViewResponse[] = [],
                    timeViewLiveTomorrow: ScheduleTimeViewResponse[] = [],
                    timeViewLiveUpcoming: ScheduleTimeViewResponse[] = [];
                if (timeViewLiveAll.length > 0) {
                    timeViewLiveToday = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at >= todayTimeStamp && tv.end_at < tomorrowTimeStamp);
                    timeViewLiveTomorrow = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at >= tomorrowTimeStamp && tv.end_at <= endOfTomorrowTimeStamp);
                    timeViewLiveUpcoming = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at > endOfTomorrowTimeStamp);
                }
                dispatch(setScheduleTimeViewLiveToday(timeViewLiveToday));
                dispatch(setScheduleTimeViewLiveTomorrow(timeViewLiveTomorrow));
                dispatch(setScheduleTimeViewLiveUpcoming(timeViewLiveUpcoming));
            }

            try {
                await Promise.all([fetchSchedules()]);
            } catch (err) {
                dispatch(setScheduleTimeViewAll([]));
                dispatch(setScheduleTimeViewLiveAll([]));
                dispatch(setScheduleTimeViewStudyAll([]));
                dispatch(setScheduleTimeViewStudyAnytime([]));
                dispatch(setScheduleTimeViewLiveToday([]));
                dispatch(setScheduleTimeViewLiveTomorrow([]));
                dispatch(setScheduleTimeViewLiveUpcoming([]));
                setAlertMessageId("schedule_errorFetchTimeViews");
                setOpenAlert(true);
                console.error(`Fail to fetchSchedules: ${err}`);
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
        {inFlight ? <LoadingSchedule isOrgSelected={Boolean(selectedOrg.organization_id)} /> :
            <Grid
                id="schedule-container"
                wrap="nowrap"
                container
                direction="column"
                justify="flex-start"
                item
                style={{ flexGrow: 1, overflowY: "auto", backgroundColor: "white" }}
            >
                {classType === ClassType.LIVE ? <ScheduledLiveList setOpenAlert={setOpenAlert} /> : <ScheduledStudyList setOpenAlert={setOpenAlert} />}
            </Grid>
        }
        <ClassTypeSwitcher />
        <Snackbar open={openAlert} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} variant="filled" severity="error">
                <FormattedMessage id={alertMessageId === "" ? "error_unknown_error" : alertMessageId} />
            </Alert>
        </Snackbar>
    </>)
}

function ScheduledLiveList({ setOpenAlert }: { setOpenAlert: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { listRoot, listSubheaderText } = useStyles();
    const scheduleTimeViewLiveToday = useSelector((state: State) => state.data.scheduleTimeViewLiveToday);
    const scheduleTimeViewLiveTomorrow = useSelector((state: State) => state.data.scheduleTimeViewLiveTomorrow);
    const scheduleTimeViewLiveUpcoming = useSelector((state: State) => state.data.scheduleTimeViewLiveUpcoming);

    return (<>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-today"
                subheader={
                    <ListSubheader component="div" id="list-subheader-today">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderToday" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {scheduleTimeViewLiveToday === undefined || scheduleTimeViewLiveToday.length === 0 ? (
                    <ListItem>
                        <Typography variant="body2" color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : scheduleTimeViewLiveToday.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} />)}
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-tomorrow"
                subheader={
                    <ListSubheader component="div" id="list-subheader-tomorrow">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderTomorrow" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {scheduleTimeViewLiveTomorrow === undefined || scheduleTimeViewLiveTomorrow.length === 0 ? (
                    <ListItem>
                        <Typography variant="body2" color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : scheduleTimeViewLiveTomorrow.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} />)}
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-upcoming"
                subheader={
                    <ListSubheader component="div" id="list-subheader-upcoming">
                        <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderUpcoming" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                {scheduleTimeViewLiveUpcoming === undefined || scheduleTimeViewLiveUpcoming.length === 0 ? (
                    <ListItem>
                        <Typography variant="body2" color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : scheduleTimeViewLiveUpcoming.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} />)}
            </List>
        </Grid>
    </>)
}

function ScheduledLiveItem({ scheduleId, setOpenAlert }: { scheduleId: string, setOpenAlert: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { listItemAvatar, listItemTextPrimary } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const [liveInfo, setLiveInfo] = useState<ScheduleResponse>();
    const [liveDate, setLiveDate] = useState<string>("");
    const [liveTime, setLiveTime] = useState<string>("");

    const { setToken } = useSessionContext();
    const { schedulerService } = useServices();

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduledLiveInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }

                const live = await schedulerService.getScheduleInfo(selectedOrg.organization_id, scheduleId);
                setLiveInfo(live);
            }
            try {
                await Promise.all([fetchScheduledLiveInfo()])
            } catch (err) {
                console.error(`Fail to fetchScheduledLiveInfo: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [])

    useEffect(() => {
        if (!liveInfo) { return; }
        const fullDateStr = dateFormat(new Date(liveInfo.start_at * 1000), "fullDate", false, false);
        setLiveDate(fullDateStr);
        const startAtStr = dateFormat(new Date(liveInfo.start_at * 1000), "shortTime", false, false);
        const endAtStr = dateFormat(new Date(liveInfo.end_at * 1000), "shortTime", false, false);
        const timeStr = startAtStr + " - " + endAtStr;
        setLiveTime(timeStr);
    }, [liveInfo])

    const goJoin = () => {
        if (!schedulerService) { return; }
        if (!liveInfo) { return; }
        dispatch(setLessonPlanIdOfSelectedSchedule(liveInfo.lesson_plan.id));
        schedulerService.getScheduleToken(selectedOrg.organization_id, liveInfo.id).then((res) => {
            if (res.token) {
                setToken(res.token);
                // TODO: Can we get rid of the token query parameter and just use
                // react component state for keeping and parsing the token instead?
                location.href = `#/join?token=${res.token}`;
            } else {
                setOpenAlert(true);
                return;
            }
        })
    }

    return (
        <ListItem button onClick={goJoin}>
            <ListItemAvatar>
                <Avatar alt={"Scheduled Live"} className={listItemAvatar}>
                    <img src={ScheduledLivePopcorn} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{liveInfo ? liveInfo.title : ""}</Typography>}
                secondary={liveInfo ? <Typography variant="caption" color="textSecondary">{`${liveTime}, ${liveDate}`}</Typography> : ""}
            />
        </ListItem>
    )
}

function ScheduledStudyList({ setOpenAlert }: { setOpenAlert: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { listRoot, listSubheaderText, listItemAvatar, listItemTextPrimary } = useStyles();

    const scheduleTimeViewStudyAll = useSelector((state: State) => state.data.scheduleTimeViewStudyAll);
    const scheduleTimeViewStudyAnytime = useSelector((state: State) => state.data.scheduleTimeViewStudyAnytime);

    return (scheduleTimeViewStudyAnytime.length === 0 && scheduleTimeViewStudyAll.length === 0 ?
        <Typography variant="body2" color="textSecondary">
            <FormattedMessage id="schedule_studyNoSchedule" />
        </Typography> : <>
            <AnytimeStudyList timeViews={scheduleTimeViewStudyAnytime} setOpenAlert={setOpenAlert} />
            <Grid item>
                {scheduleTimeViewStudyAll.length === 0 ? null :
                    scheduleTimeViewStudyAll.map((study: ScheduleTimeViewResponse) => <ScheduledStudyItem key={study.id} studyId={study.id} setOpenAlert={setOpenAlert} />)}
            </Grid>
        </>
    )
}

function AnytimeStudyList({ timeViews, setOpenAlert }: {
    timeViews: ScheduleTimeViewResponse[],
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listRoot } = useStyles();

    return (
        <Grid item>
            <List component="nav" aria-labelledby="study-subheader" className={listRoot}>
                {timeViews.map(tv => <AnytimeStudyItem studyId={tv.id} setOpenAlert={setOpenAlert} />)}
            </List>
        </Grid>
    )
}

function AnytimeStudyItem({ studyId, setOpenAlert }: {
    studyId: string,
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listItemAvatar, listItemTextPrimary } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const { setToken } = useSessionContext();
    const { schedulerService } = useServices();

    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduledStudyInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }
                const studyPayload = await schedulerService.getScheduleInfo(selectedOrg.organization_id, studyId);
                setStudyInfo(studyPayload);
            }
            try {
                await Promise.all([fetchScheduledStudyInfo()])
            } catch (err) {
                console.error(`Fail to fetchScheduledStudyInfo: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [])

    const goJoin = () => {
        if (!schedulerService) { return; }
        if (!studyInfo) { return; }
        dispatch(setLessonPlanIdOfSelectedSchedule(studyInfo.lesson_plan.id));
        schedulerService.getScheduleToken(selectedOrg.organization_id, studyInfo.id).then((res) => {
            if (res.token) {
                setToken(res.token);
                // TODO: Can we get rid of the token query parameter and just use
                // react component state for keeping and parsing the token instead?
                location.href = `#/join?token=${res.token}`;
            } else {
                setOpenAlert(true);
                return;
            }
        })
    }

    return (
        <ListItem button onClick={goJoin}>
            <ListItemAvatar>
                <Avatar alt={"Scheduled Study"} className={listItemAvatar}>
                    <img src={ScheduledStudyHouse} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{studyInfo ? studyInfo.title : ""}</Typography>}
                secondary={<Typography variant="caption" color="textSecondary"><FormattedMessage id="schedule_studyAnytimeStudy" /></Typography>}
            />
        </ListItem>
    )
}

function ScheduledStudyItem({ studyId, setOpenAlert }: {
    studyId: string,
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listRoot, listSubheaderText, listItemAvatar, listItemTextPrimary } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const { setToken } = useSessionContext();
    const { schedulerService } = useServices();

    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();
    const [hasDueDate, setHasDueDate] = useState<boolean>(true);
    const [formattedDueDate, setFormattedDueDate] = useState<string>("");

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduledStudyInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }
                const studyPayload = await schedulerService.getScheduleInfo(selectedOrg.organization_id, studyId);
                if (studyPayload.due_at !== 0) {
                    const formattedDueDate =
                        dateFormat(new Date(studyPayload.due_at * 1000), "shortTime", false, false) + ", " +
                        dateFormat(new Date(studyPayload.due_at * 1000), "fullDate", false, false);
                    setHasDueDate(true); setFormattedDueDate(formattedDueDate);
                } else {
                    setHasDueDate(false); setFormattedDueDate("");
                }
                setStudyInfo(studyPayload);
            }
            try {
                await Promise.all([fetchScheduledStudyInfo()])
            } catch (err) {
                console.error(`Fail to fetchScheduledStudyInfo: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [])

    const goJoin = () => {
        if (!schedulerService) { return; }
        if (!studyInfo) { return; }
        dispatch(setLessonPlanIdOfSelectedSchedule(studyInfo.lesson_plan.id));
        schedulerService.getScheduleToken(selectedOrg.organization_id, studyInfo.id).then((res) => {
            if (res.token) {
                setToken(res.token);
                // TODO: Can we get rid of the token query parameter and just use
                // react component state for keeping and parsing the token instead?
                location.href = `#/join?token=${res.token}`;
            } else {
                setOpenAlert(true);
                return;
            }
        })
    }

    return (
        <List
            component="nav"
            aria-labelledby="study-subheader"
            subheader={
                <ListSubheader component="div" id={`${hasDueDate ? "" : "anytime-"}study-subheader`}>
                    <Typography component="p" variant="subtitle1" color="textSecondary" className={listSubheaderText}>
                        {formattedDueDate}
                    </Typography>
                </ListSubheader>
            }
            className={listRoot}
        >
            <ListItem button onClick={goJoin}>
                <ListItemAvatar>
                    <Avatar alt={"Scheduled Study"} className={listItemAvatar}>
                        <img src={ScheduledStudyHouse} height={24} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={<Typography variant="body1" className={listItemTextPrimary}>{studyInfo ? studyInfo.title : ""}</Typography>}
                    secondary={hasDueDate ? <>
                        {/* TODO (Isu): Show all teachers' name */}
                        <Typography variant="caption" color="textSecondary">{`Assigned by: ${studyInfo && studyInfo.teachers ? studyInfo.teachers[0].name : ""}`}</Typography>
                        <Typography variant="caption" color="textSecondary" style={{ fontStyle: "italic" }}>{` - ${studyInfo ? studyInfo.program.name : ""}`}</Typography><br />
                    </> : <Typography variant="caption" color="textSecondary"><FormattedMessage id="schedule_studyAnytimeStudy" /></Typography>}
                />
            </ListItem>
        </List>
    )
}

function LoadingSchedule({ isOrgSelected }: { isOrgSelected: boolean }) {
    return <Loading messageId={isOrgSelected ? "schedule_loadingSelectOrg" : "schedule_selectOrgLoaded"} />
}