import {ListItemSecondaryAction} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {makeStyles, Theme} from '@material-ui/core/styles';
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
import {useShouldSelectOrganization} from "../account/selectOrgDialog";
import {Fallback} from "../fallback";
import {Header} from "../../components/header";
import Loading from "../../components/loading";
import {useSessionContext} from "../../context-provider/session-context";
import {useServices} from "../../context-provider/services-provider";
import {State} from "../../store/store";
import {
    ScheduleClassType,
    ScheduleResponse,
    ScheduleTimeViewResponse,
    TimeView
} from "../../services/cms/ISchedulerService";
import {ClassType, OrientationType} from "../../store/actions";
import {setInFlight} from "../../store/reducers/communication";
import {
    setSelectHomeFunStudyDialogOpen,
    setSelectOrgDialogOpen,
    setSelectUserDialogOpen
} from "../../store/reducers/control";
import {
    setLessonPlanIdOfSelectedSchedule,
    setScheduleTimeViewAll,
    setScheduleTimeViewLiveAll,
    setScheduleTimeViewLiveToday,
    setScheduleTimeViewLiveTomorrow,
    setScheduleTimeViewLiveUpcoming,
    setScheduleTimeViewStudyAll,
    setScheduleTimeViewStudyAnytime
} from "../../store/reducers/data";
import {lockOrientation} from "../../utils/screenUtils";
import {autoHideDuration} from "../../utils/fixedValues";
import {useShouldSelectUser} from "../account/selectUserDialog";
import {useUserInformation} from "../../context-provider/user-information-context";
import StudyDetail from "../join/study-detail";
import {AssessmentForStudent, AssessmentStatusType, AssessmentType} from "../../services/cms/IAssessmentService";

const dateFormat = require("dateformat");

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
    },
    submittedText: {
        color: "#5DBD3B"
    },
    listItemSecondAction: {
        paddingRight: "6rem"
    }
}));

export function Schedule() {
    const dispatch = useDispatch();
    const classType = useSelector((state: State) => state.session.classType);
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const selectedUserId = useSelector((state: State) => state.session.selectedUserId);
    const inFlight = useSelector((state: State) => state.communication.inFlight);
    const selectHomeFunStudyDialogOpen = useSelector((state: State) => state.control.selectHomeFunStudyDialogOpen);

    const { schedulerService } = useServices();

    const { shouldSelectUser, userSelectErrorCode } = useShouldSelectUser();
    const { shouldSelectOrganization, organizationSelectErrorCode } = useShouldSelectOrganization();

    const { selectedUserProfile, isSelectingUser } = useUserInformation();

    const [key, setKey] = useState(Math.random().toString(36))
    const [alertMessageId, setAlertMessageId] = useState<string>();
    const [openAlert, setOpenAlert] = useState(false);
    const [openStudyDetail, setOpenStudyDetail] = useState(false);

    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse>();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") { return; }
        setOpenAlert(false);
    };

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, [])

    useEffect(() => {
        if(selectHomeFunStudyDialogOpen && selectHomeFunStudyDialogOpen.submitted){
            dispatch(setSelectHomeFunStudyDialogOpen({open: false, submitted: false}))
            setKey(Math.random().toString(36)); //force to refresh the schedule list
        }
    },[selectHomeFunStudyDialogOpen])

    useEffect(() => {
        async function fetchEverything() {
            async function fetchSchedules() {
                if (!schedulerService) return Promise.reject();
                if (!selectedUserProfile) return Promise.reject();
                if (!selectedOrg) return Promise.reject();

                // TODO (Isu): Apply more API params to filter. It makes don't need to do .filter().
                const thisMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, TimeView.MONTH, todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrg.organization_id, TimeView.MONTH, nextMonthTimeStamp, timeZoneOffset);
                const timeViewStudyAnytime = await schedulerService.getAnytimeStudyScheduleTimeViews(selectedOrg.organization_id);

                const timeViewAll = thisMonthSchedules.concat(nextMonthSchedules);
                const timeViewLiveAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.LIVE);
                const timeViewStudyAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.STUDY && (tv.is_home_fun && tv.due_at >= todayTimeStamp || !tv.is_home_fun && tv.due_at != 0));

                dispatch(setScheduleTimeViewAll(timeViewAll));
                dispatch(setScheduleTimeViewLiveAll(timeViewLiveAll));
                dispatch(setScheduleTimeViewStudyAll(timeViewStudyAll));
                dispatch(setScheduleTimeViewStudyAnytime(timeViewStudyAnytime));

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

        if (isSelectingUser) {
            return;
        }

        if (shouldSelectUser) {
            dispatch(setSelectUserDialogOpen(true));
            return;
        } else {
            dispatch(setSelectUserDialogOpen(false));

            if (shouldSelectOrganization) {
                dispatch(setSelectOrgDialogOpen(true));
                return;
            } else {
                dispatch(setSelectOrgDialogOpen(false));
            }
        }

        const selectedValidUser = selectedUserId && selectedUserId === selectedUserProfile?.id;
        const selectedValidOrg = selectedOrg && selectedUserProfile?.organizations?.some(
            o => o.organization.organization_id === selectedOrg?.organization_id
        );

        if (selectedValidUser && selectedValidOrg) {
            dispatch(setInFlight(true));

            fetchEverything();
        }
    }, [shouldSelectUser, shouldSelectOrganization, selectedOrg, schedulerService, selectedUserProfile, key, isSelectingUser]);

    const { setToken } = useSessionContext();

    const joinStudy = () => {
        if (!schedulerService) { return; }
        if (!selectedSchedule) { return; }
        if (!selectedOrg) { return; }

        if (selectedSchedule.is_home_fun) {
            dispatch(setSelectHomeFunStudyDialogOpen({ open: true, studyId: selectedSchedule.id }))
        } else {
            dispatch(setLessonPlanIdOfSelectedSchedule(selectedSchedule.lesson_plan.id));
            schedulerService.getScheduleToken(selectedOrg.organization_id, selectedSchedule.id).then((res) => {
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
    }

    if (userSelectErrorCode && userSelectErrorCode !== 401) {
        return (
            <Fallback
                errCode={`${userSelectErrorCode}`}
                titleMsgId={`err_${userSelectErrorCode}_title`}
                subtitleMsgId={`err_${userSelectErrorCode}_subtitle`}
            />
        );
    }

    if (organizationSelectErrorCode && organizationSelectErrorCode !== 401) {
        return (
            <Fallback
                errCode={`${organizationSelectErrorCode}`}
                titleMsgId={`err_${organizationSelectErrorCode}_title`}
                subtitleMsgId={`err_${organizationSelectErrorCode}_subtitle`}
            />
        );
    }

    return (<>
        <Header isHomeRoute setKey={setKey} />
        {inFlight ? <LoadingSchedule isOrgSelected={Boolean(selectedOrg?.organization_id)} /> :
            <Grid
                id="schedule-container"
                wrap="nowrap"
                container
                direction="column"
                justify="flex-start"
                item
                style={{ flexGrow: 1, overflowY: "auto", backgroundColor: "white" }}
            >
                {classType === ClassType.LIVE ? <ScheduledLiveList setOpenAlert={setOpenAlert} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} /> : <ScheduledStudyList setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />}
            </Grid>
        }
        <ClassTypeSwitcher />
        <Snackbar open={openAlert} autoHideDuration={autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} variant="filled" severity="error">
                <FormattedMessage id={alertMessageId === "" ? "error_unknown_error" : alertMessageId} />
            </Alert>
        </Snackbar>
        <StudyDetail schedule={selectedSchedule} open={openStudyDetail} onClose={() => setOpenStudyDetail(false)} joinStudy={joinStudy} />
    </>)
}

function ScheduledLiveList({ setOpenAlert, setSelectedSchedule, setOpenStudyDetail }: { setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>> }) {
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
                ) : scheduleTimeViewLiveToday.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />)}
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
                ) : scheduleTimeViewLiveTomorrow.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />)}
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
                ) : scheduleTimeViewLiveUpcoming.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem key={tv.id} scheduleId={tv.id} setOpenAlert={setOpenAlert} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail}/>)}
            </List>
        </Grid>
    </>)
}

function ScheduledLiveItem({ scheduleId, setOpenAlert, setSelectedSchedule, setOpenStudyDetail }: { scheduleId: string,
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>> }) {
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

                if (!selectedOrg) {
                    throw new Error("Organization is not selected.");
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

    const displayScheduleInformation = () => {
        if (!liveInfo) return;

        setSelectedSchedule(liveInfo);
        setOpenStudyDetail(true);
    }

    return (
        <ListItem button onClick={displayScheduleInformation}>
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

function ScheduledStudyList({ setSelectedSchedule, setOpenStudyDetail }: {
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const scheduleTimeViewStudyAll = useSelector((state: State) => state.data.scheduleTimeViewStudyAll);
    const scheduleTimeViewStudyAnytime = useSelector((state: State) => state.data.scheduleTimeViewStudyAnytime);
    const {assessmentService} = useServices()
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const [assessmentsForStudyAll, setAssessmentsForStudyAll] = useState<AssessmentForStudent[]>([]);
    const [assessmentsForStudyAnytime, setAssessmentsForStudyAnytime] = useState<AssessmentForStudent[]>([]);

    useEffect(() => {
        async function fetchEverything() {
            async function fetchHomeFunStudyAssessment(scheduleTimeViews: ScheduleTimeViewResponse[]): Promise<AssessmentForStudent[]>{
                if(!assessmentService) return Promise.reject()
                if(!scheduleTimeViewStudyAll) return Promise.reject()
                if(!scheduleTimeViewStudyAnytime) return Promise.reject()
                if(!selectedOrg) return Promise.reject()

                return await assessmentService?.getAssessmentsForStudent(
                    selectedOrg.organization_id,
                    scheduleTimeViews.map((tv: ScheduleTimeViewResponse) => tv.id),
                    AssessmentType.HOME_FUN_STUDY,
                    0,
                    1
                );
            }
            async function fetchHomeFunStudyAssessmentForStudyAll(){
                setAssessmentsForStudyAll(await fetchHomeFunStudyAssessment(scheduleTimeViewStudyAll));
            }
            async function fetchHomeFunStudyAssessmentForStudyAnytime(){
                setAssessmentsForStudyAnytime(await fetchHomeFunStudyAssessment(scheduleTimeViewStudyAnytime));
            }
            try {
                await Promise.all([fetchHomeFunStudyAssessmentForStudyAll(), fetchHomeFunStudyAssessmentForStudyAnytime()])
            } catch (err) {
                console.error(`Fail to fetchScheduledLiveInfo: ${err}`)
            }
        }
        fetchEverything()
    },[assessmentService, scheduleTimeViewStudyAll, scheduleTimeViewStudyAnytime, selectedOrg])

    return (scheduleTimeViewStudyAnytime.length === 0 && scheduleTimeViewStudyAll.length === 0 ?
        <Typography variant="body2" color="textSecondary">
            <FormattedMessage id="schedule_studyNoSchedule" />
        </Typography> : <>
            <AnytimeStudyList timeViews={scheduleTimeViewStudyAnytime} assessmentForStudents={assessmentsForStudyAnytime} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />
            <Grid item>
                {scheduleTimeViewStudyAll.length === 0 ? null :
                    scheduleTimeViewStudyAll.map((study: ScheduleTimeViewResponse) => <ScheduledStudyItem key={study.id} studyId={study.id} assessmentForStudent={assessmentsForStudyAll.find(assessment => assessment.schedule.id === study.id)} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />)}
            </Grid>
        </>
    )
}

function AnytimeStudyList({ timeViews, assessmentForStudents, setSelectedSchedule, setOpenStudyDetail }: {
    timeViews: ScheduleTimeViewResponse[],
    assessmentForStudents?: AssessmentForStudent[],
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listRoot } = useStyles();

    return (
        <Grid item>
            <List component="nav" aria-labelledby="study-subheader" className={listRoot}>
                {timeViews.map(tv => <AnytimeStudyItem studyId={tv.id} assessmentForStudent={assessmentForStudents?.find(assessment => assessment.schedule.id === tv.id)} setSelectedSchedule={setSelectedSchedule} setOpenStudyDetail={setOpenStudyDetail} />)}
            </List>
        </Grid>
    )
}

function AnytimeStudyItem({ studyId, assessmentForStudent, setSelectedSchedule, setOpenStudyDetail }: {
    studyId: string,
    assessmentForStudent?: AssessmentForStudent,
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const classes = useStyles();
    const { listItemAvatar, listItemTextPrimary } = useStyles();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const { schedulerService } = useServices();

    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduledStudyInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }
                if (!selectedOrg) {
                    throw new Error("Organization is not selected.");
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
    }, []);

    const displayScheduleInformation = () => {
        if (!studyInfo) return;

        setSelectedSchedule(studyInfo);
        setOpenStudyDetail(true);
    }

    return (
        <ListItem key={studyId} button onClick={displayScheduleInformation}>
            <ListItemAvatar>
                <Avatar alt={"Scheduled Study"} className={listItemAvatar}>
                    <img src={ScheduledStudyHouse} height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography variant="body1" className={listItemTextPrimary}>{studyInfo ? studyInfo.title : ""}</Typography>}
                secondary={<Typography variant="caption" color="textSecondary"><FormattedMessage id={studyInfo?.is_home_fun ? "schedule_studyHomeFunStudy" : "schedule_studyAnytimeStudy"} /></Typography>}
            />
            {
                assessmentForStudent?.status === AssessmentStatusType.COMPLETE ?
                    <ListItemSecondaryAction>
                        <Grid container direction={"column"}>
                            <Grid item><Typography variant="subtitle2" color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete1" /></Typography></Grid>
                            <Grid item><Typography variant="subtitle2" color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete2" /></Typography></Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                    : assessmentForStudent?.student_attachments && assessmentForStudent?.student_attachments.length > 0
                    ?<ListItemSecondaryAction>
                        <Typography variant="subtitle2" className={classes.submittedText}><FormattedMessage id="schedule_studySubmittedFeedback" /></Typography>
                    </ListItemSecondaryAction> : ""
            }
        </ListItem>
    )
}

function ScheduledStudyItem({ studyId, assessmentForStudent, setSelectedSchedule, setOpenStudyDetail }: {
    studyId: string,
    assessmentForStudent?: AssessmentForStudent,
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>,
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { listRoot, listSubheaderText, listItemAvatar, listItemTextPrimary, submittedText, listItemSecondAction } = useStyles();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const { schedulerService } = useServices();

    const [studyInfo, setStudyInfo] = useState<ScheduleResponse>();
    const [hasDueDate, setHasDueDate] = useState<boolean>(true);
    const [formattedDueDate, setFormattedDueDate] = useState<string>("");

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchEverything() {
            async function fetchScheduledStudyInfo() {
                if (!schedulerService) {
                    throw new Error("Scheduler service not available.");
                }

                if (!selectedOrg) {
                    throw new Error("Organization is not selected.");
                }

                const studyPayload = await schedulerService.getScheduleInfo(selectedOrg!.organization_id, studyId);
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
    }, []);

    const displayScheduleInformation = () => {
        if (!studyInfo) return;

        setSelectedSchedule(studyInfo);
        setOpenStudyDetail(true);
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
            <ListItem button onClick={displayScheduleInformation} classes={{secondaryAction: listItemSecondAction}}>
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
                {
                    assessmentForStudent?.status === AssessmentStatusType.COMPLETE ?
                        <ListItemSecondaryAction>
                            <Grid container direction={"column"}>
                                <Grid item><Typography variant="subtitle2" color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete1" /></Typography></Grid>
                                <Grid item><Typography variant="subtitle2" color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete2" /></Typography></Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                        : assessmentForStudent?.student_attachments && assessmentForStudent?.student_attachments.length > 0
                        ?<ListItemSecondaryAction>
                            <Typography variant="subtitle2" className={submittedText}><FormattedMessage id="schedule_studySubmittedFeedback" /></Typography>
                        </ListItemSecondaryAction> : ""
                }
            </ListItem>
        </List>
    )
}

function LoadingSchedule({ isOrgSelected }: { isOrgSelected: boolean }) {
    return (
        isOrgSelected ? <Loading messageId={"schedule_loadingSelectOrg"} /> :
            <Loading messageId={"schedule_selectOrgLoaded"} />
    )
}
