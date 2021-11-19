import ScheduledLivePopcorn from "../../../assets/img/schedule_popcorn.svg";
import ScheduledStudyHouse from "../../../assets/img/study_house.svg";
import Loading from "../../../components/loading";
import { useSessionContext } from "../../../providers/session-context";
import { ClassType } from "../../../store/actions";
import { Header } from "../../components/layout/header";
import { useServices } from "../../context-provider/services-provider";
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
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { useCameraContext } from "@/providers/Camera";
import { fromSecondsToMilliseconds } from "@/utils/utils";
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
    createStyles,
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
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

// NOTE: China API server(Go lang) accept 10 digits timestamp
const now = new Date();
const todayTimeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const endOfToday = new Date(todayTimeStamp * 1000);
endOfToday.setHours(23, 59, 59);
const endOfTodayTimeStamp = endOfToday.getTime() / 1000;
const nextMonthTimeStamp = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
const tomorrow = new Date(todayTimeStamp * 1000);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimeStamp = tomorrow.getTime() / 1000;
const endOfTomorrow = new Date(tomorrowTimeStamp * 1000);
endOfTomorrow.setHours(23, 59, 59);
const endOfTomorrowTimeStamp = endOfTomorrow.getTime() / 1000;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listRoot: {
            width: `100%`,
            backgroundColor: theme.palette.background.paper,
            marginTop: theme.spacing(2),
        },
        listItemAvatar: {
            backgroundColor: `#C5E9FB`,
        },
        listItemTextPrimary: {
            fontWeight: 600, // theme.typography.fontWeightBold
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
    const [ homeFunStudy, setHomeFunStudy ] = useRecoilState(homeFunStudyState);
    const [ schedule, setSchedule ] = useRecoilState(scheduleState);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const setLayoutMode = useSetRecoilState(layoutModeState);

    const { schedulerService } = useServices();
    const { setAcquireDevices } = useCameraContext();

    const {
        shouldSelectUser,
        loading: selectUserLoading,
        selectedValidUser,
    } = useShouldSelectUser();
    const { shouldSelectOrganization, organizationSelectErrorCode } = useShouldSelectOrganization();

    const { data: meData } = useMeQuery();
    const selectedOrganization = useSelectedOrganizationValue();

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
    }, [ homeFunStudy, setHomeFunStudy ]);

    useEffect(() => {
        async function fetchEverything () {
            async function fetchSchedules () {
                if (!schedulerService) return Promise.reject();
                if (!meData?.me) return Promise.reject();
                if (!selectedOrganization) return Promise.reject();

                // TODO (Isu): Apply more API params to filter. It makes don't need to do .filter().
                const thisMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrganization.organization_id, TimeView.MONTH, todayTimeStamp, timeZoneOffset);
                const nextMonthSchedules = await schedulerService.getScheduleTimeViews(selectedOrganization.organization_id, TimeView.MONTH, nextMonthTimeStamp, timeZoneOffset);
                const timeViewStudyAnytime = await schedulerService.getAnytimeStudyScheduleTimeViews(selectedOrganization.organization_id);

                const timeViewAll = thisMonthSchedules.concat(nextMonthSchedules);
                const timeViewLiveAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.LIVE);
                const timeViewStudyAll = timeViewAll.filter((tv: ScheduleTimeViewResponse) => tv.class_type === ScheduleClassType.STUDY && (tv.is_home_fun && tv.due_at >= todayTimeStamp || !tv.is_home_fun && tv.due_at != 0));
                const timeViewStudyAllOrderedByDate = [ ...timeViewStudyAll ].sort((a, b) => a.start_at - b.start_at);

                let timeViewLiveToday: ScheduleTimeViewResponse[] = [],
                    timeViewLiveTomorrow: ScheduleTimeViewResponse[] = [],
                    timeViewLiveUpcoming: ScheduleTimeViewResponse[] = [];
                if (timeViewLiveAll.length > 0) {
                    timeViewLiveToday = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => ((tv.start_at >= todayTimeStamp && tv.start_at <= endOfTodayTimeStamp) || (tv.end_at >= todayTimeStamp && tv.end_at <= endOfTodayTimeStamp) || (tv.start_at <= todayTimeStamp && tv.end_at >= endOfTodayTimeStamp)));
                    timeViewLiveTomorrow = timeViewLiveAll.filter((tv: ScheduleTimeViewResponse) => ((tv.start_at >= tomorrowTimeStamp && tv.start_at <= endOfTomorrowTimeStamp) || (tv.end_at >= tomorrowTimeStamp && tv.end_at <= endOfTomorrowTimeStamp) || (tv.start_at <= tomorrowTimeStamp && tv.end_at >= endOfTomorrowTimeStamp)));
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

        if (!selectedValidUser || selectUserLoading) {
            return;
        }

        setIsProcessingRequest(true);
        fetchEverything();
    }, [
        selectUserLoading,
        shouldSelectUser,
        shouldSelectOrganization,
        selectedOrganization,
        schedulerService,
        meData,
        key,
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

    /* TODO:
    if (userSelectErrorCode && userSelectErrorCode !== 401) {
        return (
            <Fallback
                errCode={`${userSelectErrorCode}`}
                titleMsgId={`err_${userSelectErrorCode}_title`}
                subtitleMsgId={`err_${userSelectErrorCode}_subtitle`}
            />
        );
    }
    */

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
    const { listRoot } = useStyles();
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
                        <FormattedMessage id="schedule_liveSubheaderToday" />
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
                        <FormattedMessage id="schedule_liveSubheaderTomorrow" />
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
                        <FormattedMessage id="schedule_liveSubheaderUpcoming" />
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
        listItemSecondAction,
        listItemTextPrimary,
    } = useStyles();
    const intl = useIntl();

    const selectedOrganization = useSelectedOrganizationValue();

    const [ liveInfo, setLiveInfo ] = useState<ScheduleResponse>();

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

    const displayScheduleInformation = () => {
        if (!liveInfo) return;

        setSelectedSchedule(liveInfo);
        setOpenStudyDetail(true);
    };

    const liveDate =  liveInfo && intl.formatDate(fromSecondsToMilliseconds(liveInfo.start_at), {
        day: `numeric`,
        month: `long`,
        year: `numeric`,
        weekday: `long`,
    });
    const startAtStr =  liveInfo && intl.formatTime(fromSecondsToMilliseconds(liveInfo.start_at));
    const endAtStr =  liveInfo && intl.formatTime(fromSecondsToMilliseconds(liveInfo.end_at));
    const liveTime = `${startAtStr} - ${endAtStr}`;

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
                classes={{
                    primary: listItemTextPrimary,
                }}
                primary={liveInfo?.title}
                secondary={(liveTime && liveDate) && <>{liveTime}, {liveDate}</>}
            />
        </ListItem>
    );
}

function ScheduledStudyList ({ setSelectedSchedule, setOpenStudyDetail }: {
    setSelectedSchedule: React.Dispatch<React.SetStateAction<ScheduleResponse | undefined>>;
    setOpenStudyDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [ schedule ] = useRecoilState(scheduleState);
    const selectedOrganization = useSelectedOrganizationValue();
    const { assessmentService } = useServices();

    const [ assessmentsForStudyAll, setAssessmentsForStudyAll ] = useState<AssessmentForStudent[]>([]);
    const [ assessmentsForStudyAnytime, setAssessmentsForStudyAnytime ] = useState<AssessmentForStudent[]>([]);

    useEffect(() => {
        async function fetchEverything () {
            function fetchHomeFunStudyAssessment (scheduleTimeViews: ScheduleTimeViewResponse[]): Promise<AssessmentForStudent[]>{
                if(!assessmentService) return Promise.reject();
                if(!schedule.scheduleTimeViewStudyAll) return Promise.reject();
                if(!schedule.scheduleTimeViewStudyAnytime) return Promise.reject();
                if(!selectedOrganization) return Promise.reject();

                return assessmentService?.getAssessmentsForStudent(selectedOrganization.organization_id, scheduleTimeViews.map((tv: ScheduleTimeViewResponse) => tv.id), AssessmentType.HOME_FUN_STUDY, 0, 1);
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
    const intl = useIntl();
    const selectedOrganization = useSelectedOrganizationValue();
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

    const listItemPrimary = studyInfo && studyInfo.title;
    const listItemSecondary = intl.formatMessage({
        id:  studyInfo?.is_home_fun ? `schedule_studyHomeFunStudy` : `schedule_studyAnytimeStudy`,
    });

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
                classes={{
                    primary: listItemTextPrimary,
                }}
                primary={listItemPrimary}
                secondary={listItemSecondary}
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
        listItemAvatar,
        listItemTextPrimary,
        submittedText,
        listItemSecondAction,
    } = useStyles();
    const selectedOrganization = useSelectedOrganizationValue();
    const { schedulerService } = useServices();
    const intl = useIntl();

    const [ studyInfo, setStudyInfo ] = useState<ScheduleResponse>();
    const [ hasDueDate, setHasDueDate ] = useState<boolean>(true);

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
                    setHasDueDate(true);
                } else {
                    setHasDueDate(false);
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

    const studyDate =  studyInfo && intl.formatDate(fromSecondsToMilliseconds(studyInfo.due_at), {
        day: `numeric`,
        month: `long`,
        year: `numeric`,
        weekday: `long`,
    });
    const studyTime =  studyInfo && intl.formatTime(fromSecondsToMilliseconds(studyInfo.due_at));

    const listItemPrimary = studyInfo && studyInfo.title;
    const listItemSecondary = hasDueDate ? intl.formatMessage({
        id: `schedule.assignedBy`,
    }, {
        teacher: studyInfo?.teachers[0]?.name,
        program: studyInfo?.program?.name,
    }) : intl.formatMessage({
        id: `schedule_studyAnytimeStudy`,
    });

    return (
        <List
            component="nav"
            aria-labelledby="study-subheader"
            subheader={
                <ListSubheader
                    component="div"
                    id={`${hasDueDate ? `` : `anytime-`}study-subheader`}>
                    {studyTime}, {studyDate}
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
                    classes={{
                        primary: listItemTextPrimary,
                    }}
                    primary={listItemPrimary}
                    secondary={listItemSecondary}
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
        <Grid
            container
            direction="column"
            justifyContent="center"
        >
            <Grid item>
                { isOrgSelected ? <Loading messageId={`schedule_loadingSelectOrg`} /> :
                    <Loading messageId={`schedule_selectOrgLoaded`} />}
            </Grid>
        </Grid>
    );
}
