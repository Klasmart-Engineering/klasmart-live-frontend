import ScheduledLivePopcorn from "../../../assets/img/schedule_popcorn.svg";
import ScheduledStudyHouse from "../../../assets/img/study_house.svg";
import Loading from "../../../components/loading";
import { useSessionContext } from "../../../providers/session-context";
import { ClassType } from "../../../store/actions";
import { Header } from "../../components/layout/header";
import { useServices } from "../../context-provider/services-provider";
import { useUserInformation } from "../../context-provider/user-information-context";
import { useShouldSelectOrganization } from "../../dialogs/account/selectOrgDialog";
import { useShouldSelectUser } from "../../dialogs/account/selectUserDialog";
import StudyDetail from "../../dialogs/study-detail/study-detail";
import { scheduleState } from "../../model//scheduleModel";
import {
    dialogsState,
    homeFunStudyState,
    isProcessingRequestState,
    LayoutMode,
    layoutModeState,
    selectedOrganizationState,
    selectedUserState,
} from "../../model/appModel";
import {
    AssessmentForStudent,
    AssessmentStatusType,
    AssessmentType,
} from "../../services/cms/IAssessmentService";
import {
    ScheduleClassType,
    ScheduleResponse,
    ScheduleTimeViewResponse,
    TimeView,
} from "../../services/cms/ISchedulerService";
import { autoHideDuration } from "../../utils/fixedValues";
import { Fallback } from "../fallback";
import ClassTypeSwitcher from "./classTypeSwitcher";
import { useCameraContext } from "@/providers/Camera";
import { ListItemSecondaryAction } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Grid from "@material-ui/core/Grid";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Snackbar from "@material-ui/core/Snackbar";
import {
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const dateFormat = require(`dateformat`);

// NOTE: China API server(Go lang) accept 10 digits timestamp
const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const nextMonthTimeStamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
const tomorrow = new Date(todayTimeStamp * 1000); tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimeStamp = tomorrow.getTime() / 1000;
const endOfTomorrow = new Date(tomorrowTimeStamp * 1000); endOfTomorrow.setHours(23, 59, 59);
const endOfTomorrowTimeStamp = endOfTomorrow.getTime() / 1000;

const useStyles = makeStyles((theme: Theme) => ({
    listRoot: {
        width: `100%`,
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(2),
    },
    listSubheaderText: {
        fontWeight: 900,
    },
    listItemAvatar: {
        backgroundColor: `#C5E9FB`,
    },
    listItemTextPrimary: {
        color: `#0C3680`,
        fontWeight: 900,
    },
    submittedText: {
        color: `#5DBD3B`,
    },
    listItemSecondAction: {
        paddingRight: `6rem`,
    },
}));

export function Schedule () {
    const [ isProcessingRequest, setIsProcessingRequest ] = useRecoilState(isProcessingRequestState);
    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);
    const [ selectedUser ] = useRecoilState(selectedUserState);
    const [ homeFunStudy, setHomeFunStudy ] = useRecoilState(homeFunStudyState);
    const [ schedule, setSchedule ] = useRecoilState(scheduleState);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ layoutMode, setLayoutMode ] = useRecoilState(layoutModeState);

    const { schedulerService } = useServices();
    const { setAcquireDevices } = useCameraContext();

    const { shouldSelectUser, userSelectErrorCode } = useShouldSelectUser();
    const { shouldSelectOrganization, organizationSelectErrorCode } = useShouldSelectOrganization();

    const { selectedUserProfile, isSelectingUser } = useUserInformation();

    const [ key, setKey ] = useState(Math.random().toString(36));
    const [ alertMessageId, setAlertMessageId ] = useState<string>();
    const [ openAlert, setOpenAlert ] = useState(false);
    const [ openStudyDetail, setOpenStudyDetail ] = useState(false);

    const [ selectedSchedule, setSelectedSchedule ] = useState<ScheduleResponse>();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === `clickaway`) { return; }
        setOpenAlert(false);
    };

    useEffect(() => {
        setAcquireDevices(false);
        setLayoutMode(LayoutMode.DEFAULT);
    }, []);

    useEffect(() => {
        if(homeFunStudy && homeFunStudy.submitted) {
            setHomeFunStudy({
                ...homeFunStudy,
                open: false,
                submitted: false,
            });
            setKey(Math.random().toString(36)); //force to refresh the schedule list
        }
    }, [ setHomeFunStudy ]);

    useEffect(() => {
        async function fetchEverything () {
            async function fetchSchedules () {
                if (!schedulerService) return Promise.reject();
                if (!selectedUserProfile) return Promise.reject();
                if (!selectedOrganization) return Promise.reject();

                // TODO (Isu): Apply more API params to filter. It makes don't need to do .filter().
                const thisMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrganization.organization_id, TimeView.MONTH, todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrganization.organization_id, TimeView.MONTH, nextMonthTimeStamp, timeZoneOffset);
                const timeViewStudyAnytime = await schedulerService.getAnytimeStudyScheduleTimeViews(selectedOrganization.organization_id);

                const timeViewAll = thisMonthSchedules.concat(nextMonthSchedules);
                const timeViewLiveAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.LIVE);
                const timeViewStudyAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.STUDY && (tv.is_home_fun && tv.due_at >= todayTimeStamp || !tv.is_home_fun && tv.due_at != 0));
                const timeViewStudyAllOrderedByDate = [ ...timeViewStudyAll ].sort((a, b) => a.start_at < b.start_at ? -1 : 1);

                let timeViewLiveToday: ScheduleTimeViewResponse[] = [],
                    timeViewLiveTomorrow: ScheduleTimeViewResponse[] = [],
                    timeViewLiveUpcoming: ScheduleTimeViewResponse[] = [];
                if (timeViewLiveAll.length > 0) {
                    timeViewLiveToday = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at >= todayTimeStamp && tv.end_at < tomorrowTimeStamp);
                    timeViewLiveTomorrow = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at >= tomorrowTimeStamp && tv.end_at <= endOfTomorrowTimeStamp);
                    timeViewLiveUpcoming = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => tv.start_at > endOfTomorrowTimeStamp);
                }

                setSchedule({
                    ...schedule,
                    scheduleTimeViewAll: timeViewAll,
                    scheduleTimeViewLiveAll: timeViewLiveAll,
                    scheduleTimeViewStudyAll: timeViewStudyAllOrderedByDate,
                    scheduleTimeViewStudyAnytime: timeViewStudyAnytime,
                    scheduleTimeViewLiveToday: timeViewLiveToday,
                    scheduleTimeViewLiveTomorrow: timeViewLiveTomorrow,
                    scheduleTimeViewLiveUpcoming: timeViewLiveUpcoming,
                });
            }

            try {
                await Promise.all([ fetchSchedules() ]);
            } catch (err) {

                const newSchedule = {
                    ...schedule,
                    scheduleTimeViewAll: [],
                    scheduleTimeViewLiveAll: [],
                    scheduleTimeViewStudyAll: [],
                    scheduleTimeViewStudyAnytime: [],
                    scheduleTimeViewLiveToday: [],
                    scheduleTimeViewLiveTomorrow: [],
                    scheduleTimeViewLiveUpcoming: [],
                };

                setSchedule(newSchedule);

                setAlertMessageId(`schedule_errorFetchTimeViews`);
                setOpenAlert(true);
                console.error(`Fail to fetchSchedules: ${err}`);
            } finally {
                setIsProcessingRequest(false);
            }
        }

        if (isSelectingUser) {
            return;
        }

        if (shouldSelectUser) {
            setDialogs({
                ...dialogs,
                isSelectUserOpen: true,
            });
            return;
        } else {
            setDialogs({
                ...dialogs,
                isSelectUserOpen: false,
                isSelectOrganizationOpen: shouldSelectOrganization,
            });

            if (shouldSelectOrganization) {
                return;
            }
        }

        const selectedValidUser = selectedUser.userId && selectedUser.userId === selectedUserProfile?.id;
        const selectedValidOrg = selectedOrganization && selectedUserProfile?.organizations?.some(o => o.organization.organization_id === selectedOrganization?.organization_id);

        if (selectedValidUser && selectedValidOrg) {
            setIsProcessingRequest(true);

            fetchEverything();
        }
    }, [
        shouldSelectUser,
        shouldSelectOrganization,
        selectedOrganization,
        schedulerService,
        selectedUserProfile,
        key,
        isSelectingUser,
    ]);

    const { setToken } = useSessionContext();

    const joinStudy = () => {
        if (!schedulerService) { return; }
        if (!selectedSchedule) { return; }
        if (!selectedOrganization) { return; }

        if (selectedSchedule.is_home_fun) {
            setHomeFunStudy({
                ...homeFunStudy,
                open: true,
                submitted: false,
                studyId: selectedSchedule.id,
            });
        } else {

            setSchedule({
                ...schedule,
                lessonPlanIdOfSelectedSchedule: selectedSchedule.lesson_plan.id,
            });

            schedulerService.getScheduleToken(selectedOrganization.organization_id, selectedSchedule.id).then((res) => {
                if (res.token) {
                    setLayoutMode(LayoutMode.CLASSROOM);
                    setToken(res.token);
                    /* TODO: Can we get rid of the token query parameter and just use
                    ** react component state for keeping and parsing the token instead? */
                    location.href = `#/join?token=${res.token}`;
                } else {
                    setOpenAlert(true);
                    return;
                }
            });
        }
    };

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
        <Header
            isHomeRoute
            setKey={setKey} />
        { isProcessingRequest ? <LoadingSchedule isOrgSelected={Boolean(selectedOrganization?.organization_id)} /> :
            <Grid
                container
                item
                id="schedule-container"
                wrap="nowrap"
                direction="column"
                justifyContent="flex-start"
                style={{
                    flexGrow: 1,
                    overflowY: `auto`,
                    backgroundColor: `white`,
                }}
            >
                { schedule.viewClassType === ClassType.LIVE ? <ScheduledLiveList
                    setOpenAlert={setOpenAlert}
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail} /> : <ScheduledStudyList
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail} /> }
            </Grid>
        }
        <ClassTypeSwitcher />
        <Snackbar
            open={openAlert}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}>
            <Alert
                variant="filled"
                severity="error"
                onClose={handleClose}>
                <FormattedMessage id={alertMessageId === `` ? `error_unknown_error` : alertMessageId} />
            </Alert>
        </Snackbar>
        <StudyDetail
            schedule={selectedSchedule}
            open={openStudyDetail}
            joinStudy={joinStudy}
            onClose={() => setOpenStudyDetail(false)} />
    </>);
}

function ScheduledLiveList ({
    setOpenAlert, setSelectedSchedule, setOpenStudyDetail,
}: { setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>; }) {
    const { listRoot, listSubheaderText } = useStyles();
    const [ schedule ] = useRecoilState(scheduleState);

    return (<>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-today"
                subheader={
                    <ListSubheader
                        component="div"
                        id="list-subheader-today">
                        <Typography
                            component="p"
                            variant="subtitle1"
                            color="textSecondary"
                            className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderToday" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                { schedule.scheduleTimeViewLiveToday === undefined || schedule.scheduleTimeViewLiveToday.length === 0 ? (
                    <ListItem>
                        <Typography
                            variant="body2"
                            color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : schedule.scheduleTimeViewLiveToday.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem
                    key={tv.id}
                    scheduleId={tv.id}
                    setOpenAlert={setOpenAlert}
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail} />) }
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-tomorrow"
                subheader={
                    <ListSubheader
                        component="div"
                        id="list-subheader-tomorrow">
                        <Typography
                            component="p"
                            variant="subtitle1"
                            color="textSecondary"
                            className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderTomorrow" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                { schedule.scheduleTimeViewLiveTomorrow === undefined || schedule.scheduleTimeViewLiveTomorrow.length === 0 ? (
                    <ListItem>
                        <Typography
                            variant="body2"
                            color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : schedule.scheduleTimeViewLiveTomorrow.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem
                    key={tv.id}
                    scheduleId={tv.id}
                    setOpenAlert={setOpenAlert}
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail} />) }
            </List>
        </Grid>
        <Grid item>
            <List
                component="nav"
                aria-labelledby="list-subheader-upcoming"
                subheader={
                    <ListSubheader
                        component="div"
                        id="list-subheader-upcoming">
                        <Typography
                            component="p"
                            variant="subtitle1"
                            color="textSecondary"
                            className={listSubheaderText}>
                            <FormattedMessage id="schedule_liveSubheaderUpcoming" />
                        </Typography>
                    </ListSubheader>
                }
                className={listRoot}
            >
                { schedule.scheduleTimeViewLiveUpcoming === undefined || schedule.scheduleTimeViewLiveUpcoming.length === 0 ? (
                    <ListItem>
                        <Typography
                            variant="body2"
                            color="textSecondary">
                            <FormattedMessage id="schedule_liveNoSchedule" />
                        </Typography>
                    </ListItem>
                ) : schedule.scheduleTimeViewLiveUpcoming.map((tv: ScheduleTimeViewResponse) => <ScheduledLiveItem
                    key={tv.id}
                    scheduleId={tv.id}
                    setOpenAlert={setOpenAlert}
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail}/>) }
            </List>
        </Grid>
    </>);
}

function ScheduledLiveItem ({
    scheduleId, setSelectedSchedule, setOpenStudyDetail,
}: { scheduleId: string;
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>; }) {
    const {
        listItemAvatar,
        listItemTextPrimary,
        listItemSecondAction,
    } = useStyles();

    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);

    const [ liveInfo, setLiveInfo ] = useState<ScheduleResponse>();
    const [ liveDate, setLiveDate ] = useState<string>(``);
    const [ liveTime, setLiveTime ] = useState<string>(``);

    const { schedulerService } = useServices();

    useEffect(() => {
        async function fetchEverything () {
            async function fetchScheduledLiveInfo () {
                if (!schedulerService) {
                    throw new Error(`Scheduler service not available.`);
                }

                if (!selectedOrganization) {
                    throw new Error(`Organization is not selected.`);
                }

                const live = await schedulerService.getScheduleInfo(selectedOrganization.organization_id, scheduleId);
                setLiveInfo(live);
            }
            try {
                await Promise.all([ fetchScheduledLiveInfo() ]);
            } catch (err) {
                console.error(`Fail to fetchScheduledLiveInfo: ${err}`);
            }
        }
        fetchEverything();
    }, []);

    useEffect(() => {
        if (!liveInfo) { return; }
        const fullDateStr = dateFormat(new Date(liveInfo.start_at * 1000), `fullDate`, false, false);
        setLiveDate(fullDateStr);
        const startAtStr = dateFormat(new Date(liveInfo.start_at * 1000), `shortTime`, false, false);
        const endAtStr = dateFormat(new Date(liveInfo.end_at * 1000), `shortTime`, false, false);
        const timeStr = startAtStr + ` - ` + endAtStr;
        setLiveTime(timeStr);
    }, [ liveInfo ]);

    const displayScheduleInformation = () => {
        if (!liveInfo) return;

        setSelectedSchedule(liveInfo);
        setOpenStudyDetail(true);
    };

    return (
        <ListItem
            button
            classes={{
                secondaryAction: listItemSecondAction,
            }}
            onClick={displayScheduleInformation}>
            <ListItemAvatar>
                <Avatar
                    alt={`Scheduled Live`}
                    className={listItemAvatar}>
                    <img
                        src={ScheduledLivePopcorn}
                        height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography
                    variant="body1"
                    className={listItemTextPrimary}>{liveInfo ? liveInfo.title : ``}</Typography>}
                secondary={liveInfo ? <Typography
                    variant="caption"
                    color="textSecondary">{`${liveTime}, ${liveDate}`}</Typography> : ``}
            />
        </ListItem>
    );
}

function ScheduledStudyList ({ setSelectedSchedule, setOpenStudyDetail }: {
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [ schedule ] = useRecoilState(scheduleState);
    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);
    const { assessmentService } = useServices();

    const [ assessmentsForStudyAll, setAssessmentsForStudyAll ] = useState<AssessmentForStudent[]>([]);
    const [ assessmentsForStudyAnytime, setAssessmentsForStudyAnytime ] = useState<AssessmentForStudent[]>([]);

    useEffect(() => {
        async function fetchEverything () {
            async function fetchHomeFunStudyAssessment (scheduleTimeViews: ScheduleTimeViewResponse[]): Promise<AssessmentForStudent[]>{
                if(!assessmentService) return Promise.reject();
                if(!schedule.scheduleTimeViewStudyAll) return Promise.reject();
                if(!schedule.scheduleTimeViewStudyAnytime) return Promise.reject();
                if(!selectedOrganization) return Promise.reject();

                return await assessmentService?.getAssessmentsForStudent(selectedOrganization.organization_id, scheduleTimeViews.map((tv: ScheduleTimeViewResponse) => tv.id), AssessmentType.HOME_FUN_STUDY, 0, 1);
            }
            async function fetchHomeFunStudyAssessmentForStudyAll (){
                setAssessmentsForStudyAll(await fetchHomeFunStudyAssessment(schedule.scheduleTimeViewStudyAll));
            }
            async function fetchHomeFunStudyAssessmentForStudyAnytime (){
                setAssessmentsForStudyAnytime(await fetchHomeFunStudyAssessment(schedule.scheduleTimeViewStudyAnytime));
            }
            try {
                await Promise.all([ fetchHomeFunStudyAssessmentForStudyAll(), fetchHomeFunStudyAssessmentForStudyAnytime() ]);
            } catch (err) {
                console.error(`Fail to fetchScheduledLiveInfo: ${err}`);
            }
        }
        fetchEverything();
    }, [
        assessmentService,
        schedule,
        selectedOrganization,
    ]);

    return (schedule.scheduleTimeViewStudyAnytime.length === 0 && schedule.scheduleTimeViewStudyAll.length === 0 ?
        <Typography
            variant="body2"
            color="textSecondary">
            <FormattedMessage id="schedule_studyNoSchedule" />
        </Typography> : <>
            <AnytimeStudyList
                timeViews={schedule.scheduleTimeViewStudyAnytime}
                assessmentForStudents={assessmentsForStudyAnytime}
                setSelectedSchedule={setSelectedSchedule}
                setOpenStudyDetail={setOpenStudyDetail} />
            <Grid item>
                { schedule.scheduleTimeViewStudyAll.length === 0 ? null :
                    schedule.scheduleTimeViewStudyAll.map((study: ScheduleTimeViewResponse) => <ScheduledStudyItem
                        key={study.id}
                        studyId={study.id}
                        assessmentForStudent={assessmentsForStudyAll.find(assessment => assessment.schedule.id === study.id)}
                        setSelectedSchedule={setSelectedSchedule}
                        setOpenStudyDetail={setOpenStudyDetail} />) }
            </Grid>
        </>
    );
}

function AnytimeStudyList ({
    timeViews, assessmentForStudents, setSelectedSchedule, setOpenStudyDetail,
}: {
    timeViews: ScheduleTimeViewResponse[];
    assessmentForStudents?: AssessmentForStudent[];
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { listRoot } = useStyles();

    return (
        <Grid item>
            <List
                component="nav"
                aria-labelledby="study-subheader"
                className={listRoot}>
                {timeViews.map(tv => <AnytimeStudyItem
                    key={tv.id}
                    studyId={tv.id}
                    assessmentForStudent={assessmentForStudents?.find(assessment => assessment.schedule.id === tv.id)}
                    setSelectedSchedule={setSelectedSchedule}
                    setOpenStudyDetail={setOpenStudyDetail} />)}
            </List>
        </Grid>
    );
}

function AnytimeStudyItem ({
    studyId, assessmentForStudent, setSelectedSchedule, setOpenStudyDetail,
}: {
    studyId: string;
    assessmentForStudent?: AssessmentForStudent;
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const classes = useStyles();
    const {
        listItemAvatar,
        listItemTextPrimary,
        listItemSecondAction,
    } = useStyles();
    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);
    const { schedulerService } = useServices();
    const [ studyInfo, setStudyInfo ] = useState<ScheduleResponse>();

    useEffect(() => {
        async function fetchEverything () {
            async function fetchScheduledStudyInfo () {
                if (!schedulerService) {
                    throw new Error(`Scheduler service not available.`);
                }
                if (!selectedOrganization) {
                    throw new Error(`Organization is not selected.`);
                }

                const studyPayload = await schedulerService.getScheduleInfo(selectedOrganization.organization_id, studyId);
                setStudyInfo(studyPayload);
            }
            try {
                await Promise.all([ fetchScheduledStudyInfo() ]);
            } catch (err) {
                console.error(`Fail to fetchScheduledStudyInfo: ${err}`);
            }
        }
        fetchEverything();
    }, []);

    const displayScheduleInformation = () => {
        if (!studyInfo) return;

        setSelectedSchedule(studyInfo);
        setOpenStudyDetail(true);
    };

    return (
        <ListItem
            key={studyId}
            button
            classes={{
                secondaryAction: listItemSecondAction,
            }}
            onClick={displayScheduleInformation}>
            <ListItemAvatar>
                <Avatar
                    alt={`Scheduled Study`}
                    className={listItemAvatar}>
                    <img
                        src={ScheduledStudyHouse}
                        height={24} />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                disableTypography
                primary={<Typography
                    variant="body1"
                    className={listItemTextPrimary}>{studyInfo ? studyInfo.title : ``}</Typography>}
                secondary={<Typography
                    variant="caption"
                    color="textSecondary"><FormattedMessage id={studyInfo?.is_home_fun ? `schedule_studyHomeFunStudy` : `schedule_studyAnytimeStudy`} /></Typography>}
            />
            {
                assessmentForStudent?.status === AssessmentStatusType.COMPLETE ?
                    <ListItemSecondaryAction>
                        <Grid
                            container
                            direction={`column`}>
                            <Grid item><Typography
                                variant="subtitle2"
                                color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete1" /></Typography></Grid>
                            <Grid item><Typography
                                variant="subtitle2"
                                color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete2" /></Typography></Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                    : assessmentForStudent?.student_attachments && assessmentForStudent?.student_attachments.length > 0
                        ?<ListItemSecondaryAction>
                            <Typography
                                variant="subtitle2"
                                className={classes.submittedText}><FormattedMessage id="schedule_studySubmittedFeedback" /></Typography>
                        </ListItemSecondaryAction> : ``
            }
        </ListItem>
    );
}

function ScheduledStudyItem ({
    studyId, assessmentForStudent, setSelectedSchedule, setOpenStudyDetail,
}: {
    studyId: string;
    assessmentForStudent?: AssessmentForStudent;
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const {
        listRoot,
        listSubheaderText,
        listItemAvatar,
        listItemTextPrimary,
        submittedText,
        listItemSecondAction,
    } = useStyles();
    const [ selectedOrganization ] = useRecoilState(selectedOrganizationState);
    const { schedulerService } = useServices();

    const [ studyInfo, setStudyInfo ] = useState<ScheduleResponse>();
    const [ hasDueDate, setHasDueDate ] = useState<boolean>(true);
    const [ formattedDueDate, setFormattedDueDate ] = useState<string>(``);

    useEffect(() => {
        async function fetchEverything () {
            async function fetchScheduledStudyInfo () {
                if (!schedulerService) {
                    throw new Error(`Scheduler service not available.`);
                }

                if (!selectedOrganization) {
                    throw new Error(`Organization is not selected.`);
                }

                const studyPayload = await schedulerService.getScheduleInfo(selectedOrganization.organization_id, studyId);
                if (studyPayload.due_at !== 0) {
                    const formattedDueDate =
                        dateFormat(new Date(studyPayload.due_at * 1000), `shortTime`, false, false) + `, ` +
                        dateFormat(new Date(studyPayload.due_at * 1000), `fullDate`, false, false);
                    setHasDueDate(true); setFormattedDueDate(formattedDueDate);
                } else {
                    setHasDueDate(false); setFormattedDueDate(``);
                }
                setStudyInfo(studyPayload);
            }
            try {
                await Promise.all([ fetchScheduledStudyInfo() ]);
            } catch (err) {
                console.error(`Fail to fetchScheduledStudyInfo: ${err}`);
            }
        }
        fetchEverything();
    }, []);

    const displayScheduleInformation = () => {
        if (!studyInfo) return;

        setSelectedSchedule(studyInfo);
        setOpenStudyDetail(true);
    };

    return (
        <List
            component="nav"
            aria-labelledby="study-subheader"
            subheader={
                <ListSubheader
                    component="div"
                    id={`${hasDueDate ? `` : `anytime-`}study-subheader`}>
                    <Typography
                        component="p"
                        variant="subtitle1"
                        color="textSecondary"
                        className={listSubheaderText}>
                        {formattedDueDate}
                    </Typography>
                </ListSubheader>
            }
            className={listRoot}
        >
            <ListItem
                button
                classes={{
                    secondaryAction: listItemSecondAction,
                }}
                onClick={displayScheduleInformation}>
                <ListItemAvatar>
                    <Avatar
                        alt={`Scheduled Study`}
                        className={listItemAvatar}>
                        <img
                            src={ScheduledStudyHouse}
                            height={24} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={<Typography
                        variant="body1"
                        className={listItemTextPrimary}>{studyInfo ? studyInfo.title : ``}</Typography>}
                    secondary={hasDueDate ? <>
                        {/* TODO (Isu): Show all teachers' name */}
                        <Typography
                            variant="caption"
                            color="textSecondary">{`Assigned by: ${studyInfo && studyInfo.teachers ? studyInfo.teachers[0].name : ``}`}</Typography>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            style={{
                                fontStyle: `italic`,
                            }}>{` - ${studyInfo ? studyInfo.program.name : ``}`}</Typography><br />
                    </> : <Typography
                        variant="caption"
                        color="textSecondary"><FormattedMessage id="schedule_studyAnytimeStudy" /></Typography>}
                />
                {
                    assessmentForStudent?.status === AssessmentStatusType.COMPLETE ?
                        <ListItemSecondaryAction>
                            <Grid
                                container
                                direction={`column`}>
                                <Grid item><Typography
                                    variant="subtitle2"
                                    color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete1" /></Typography></Grid>
                                <Grid item><Typography
                                    variant="subtitle2"
                                    color="textSecondary"><FormattedMessage id="schedule_studyAssessmentComplete2" /></Typography></Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                        : assessmentForStudent?.student_attachments && assessmentForStudent?.student_attachments.length > 0
                            ?<ListItemSecondaryAction>
                                <Typography
                                    variant="subtitle2"
                                    className={submittedText}><FormattedMessage id="schedule_studySubmittedFeedback" /></Typography>
                            </ListItemSecondaryAction> : ``
                }
            </ListItem>
        </List>
    );
}

function LoadingSchedule ({ isOrgSelected }: { isOrgSelected: boolean }) {
    return (
        isOrgSelected ? <Loading messageId={`schedule_loadingSelectOrg`} /> :
            <Loading messageId={`schedule_selectOrgLoaded`} />
    );
}
