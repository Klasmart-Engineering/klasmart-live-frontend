import ScheduleItem from "../ScheduleItem";
import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import NoSchedule from "@/app/components/Schedule/NoSchedule";
import { getIdStudyType } from "@/app/components/Schedule/shared";
import StudyDetailsDialog from "@/app/components/Schedule/Study/Dialog/Details";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import { formatDueDateMillis } from "@/app/utils/dateTimeUtils";
import {
    isFocused,
    useWindowOnFocusChange,
} from "@/app/utils/windowEvents";
import {
    BG_AVT_ANYTIME_STUDY_DEFAULT,
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_FETCH_MONTH_DIFF,
    SCHEDULE_PAGE_ITEM_HEIGHT_MIN,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
    schedulePageWindowItemHeightToPageSize,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    SchedulesTimeViewListItem,
    useCmsApiClient,
    usePostSchedulesTimeViewList,
} from "@kl-engineering/cms-api-client";
import { ScheduleStudyType } from "@kl-engineering/cms-api-client/dist/api/schedule";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    CircularProgress,
    createStyles,
    List,
    makeStyles,
} from "@material-ui/core";
import {
    clamp,
    groupBy,
    uniqBy,
} from "lodash";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

export const getStudyTypes = (classType: ClassType) => {
    return classType === ClassType.HOME_FUN_STUDY ? [ ScheduleStudyType.HOME_FUN ] : [ ScheduleStudyType.NORMAL, ScheduleStudyType.REVIEW ];

};
const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        overflowX: `scroll`,
        flex: 1,
        display: `flex`,
        paddingLeft: theme.spacing(5),
        [theme.breakpoints.up(`md`)]: {
            paddingLeft: theme.spacing(7),
        },
        '&::-webkit-scrollbar': {
            display: `none`,
        },
    },
    listSection: {
        backgroundColor: `inherit`,
        [theme.breakpoints.up(`md`)]: {
            paddingTop: theme.spacing(12),
        },
    },
    ul: {
        backgroundColor: `inherit`,
        padding: 0,
        display: `flex`,
    },
    submittedText: {
        color: `#5DBD3B`,
    },
    anytimeStudyAvatar: {
        backgroundColor: BG_AVT_ANYTIME_STUDY_DEFAULT,
        color: theme.palette.common.white,
        height: 28,
        borderRadius: theme.spacing(3),
        fontWeight: theme.typography.fontWeightRegular as number,
        marginLeft: theme.spacing(1),
    },
    anytimeStudyText: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

interface Props {
    classType: ClassType;
}

export default function StudyScheduleList (props: Props) {

    const { classType } = props;

    const classes = useStyles();
    const intl = useIntl();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const selectedUser = useSelectedUserValue();
    const [ selectedStudySchedule, setSelectedStudySchedule ] = useState<SchedulesTimeViewListItem>();
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const {
        setToken,
        setTeachers,
        setDueDate,
        setTitle,
    } = useSessionContext();
    const organization = useSelectedOrganizationValue();
    const { push } = useHistory();
    const { actions } = useCmsApiClient();

    const organizationId = organization?.organization_id ?? ``;
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60 * -1;
    now.setSeconds(0);
    now.setMinutes(Math.floor(now.getMinutes() / SCHEDULE_FETCH_INTERVAL_MINUTES) * SCHEDULE_FETCH_INTERVAL_MINUTES);
    const nowInSeconds = Math.floor(now.getTime() / 1000);
    const twoMonthsFromNow = new Date(now);
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + SCHEDULE_FETCH_MONTH_DIFF);
    const twoMonthsFromNowInSeconds = Math.floor(twoMonthsFromNow.getTime() / 1000);
    const pageSize = schedulePageWindowItemHeightToPageSize(window.innerHeight, SCHEDULE_PAGE_ITEM_HEIGHT_MIN);

    const {
        data: anytimeSchedulesData,
        isFetching: isAnytimeSchedulesFetching,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        order_by: `schedule_at`,
        view_type: `full_view`,
        time_boundary: `union`,
        page: 1,
        page_size: pageSize,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        with_assessment_status: true,
        time_zone_offset: timeZoneOffset,
        class_types: [ `Homework` ],
        study_types: getStudyTypes(classType),
        anytime: true,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });
    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
        error: scheduleError,
        refetch: refetchSchedules,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        order_by: `schedule_at`,
        view_type: `full_view`,
        page,
        page_size: pageSize,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        with_assessment_status: true,
        start_at_ge: nowInSeconds,
        end_at_le: twoMonthsFromNowInSeconds,
        time_zone_offset: timeZoneOffset,
        class_types: [ `Homework` ],
        study_types: getStudyTypes(classType),
        anytime: false,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

    const studyScheduleSections = Object
        .entries(groupBy(items, (schedule) => formatDueDateMillis(fromSecondsToMilliseconds(schedule.due_at), intl)))
        .map(([ title, schedules ]) => ({
            title,
            schedules,
        }));

    const scrollRef = useBottomScrollListener<HTMLUListElement>(() => {
        if (isSchedulesFetching) return;
        const lastPage = Math.ceil((schedulesData?.total ?? 0) / pageSize);
        const newPage = clamp(page + 1, SCHEDULE_PAGE_START, lastPage);
        if (newPage === page) return;
        setPage(newPage);
    }, {
        offset: window.innerHeight / 2, // detect scrolling with an offset of half of the screen height from the bottom
        debounce: SCHEDULE_PAGINATION_DELAY,
    });

    useEffect(() => {
        if (scheduleError) setItems([]);
        if (!schedulesData) return;
        const newItems = schedulesData?.data ?? [];

        if(page === SCHEDULE_PAGE_START) {
            setItems(newItems);
            return;
        }
        setItems((oldItems) => uniqBy([ ...newItems, ...oldItems ], (item) => item.id)
            .sort((a, b) => a.start_at - b.start_at));
    }, [ scheduleError, schedulesData ]);

    useEffect(() => {
        setPage(SCHEDULE_PAGE_START);
        scrollRef.current?.scrollTo(0, 0);
    }, [ organization, selectedUser ]);

    const onFocusChange = useCallback(() => {
        if (isFocused()) return;
        if (page === SCHEDULE_PAGE_START) return;
        setItems([]);
        setPage(SCHEDULE_PAGE_START);
    }, [ page ]);

    useWindowOnFocusChange(onFocusChange);

    const setStudyDetailOpen = (studySchedule?: SchedulesTimeViewListItem) => {
        setDialogs({
            ...dialogs,
            isStudyDetailOpen: !!studySchedule?.id,
        });
        setSelectedStudySchedule(studySchedule);
    };

    const handleJoinHomeFunStudyClass = (scheduleId: string) => {
        if (!scheduleId) return;
        push(`/schedule/home-fun-study/${scheduleId}`);
    };

    const handleJoinStudyClass = async (studySchedule: SchedulesTimeViewListItem) => {
        if (!studySchedule.id) return;
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: studySchedule.id,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            const {
                title,
                teachers,
                due_at,
            } = await actions.getScheduleById({
                org_id: organizationId,
                schedule_id: studySchedule.id,
            });
            setTeachers(teachers);
            setTitle(title);
            setDueDate(due_at);
            setToken(token);
            push(`/room?token=${token}`);
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `error_unknown_error`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleJoinClass = (studySchedule: SchedulesTimeViewListItem) => {
        if(studySchedule.is_home_fun){
            handleJoinHomeFunStudyClass(studySchedule.id);
        } else {
            handleJoinStudyClass(studySchedule);
        }
        setDialogs({
            ...dialogs,
            isStudyDetailOpen: false,
        });
    };

    if (scheduleError) {
        if (isSchedulesFetching || isAnytimeSchedulesFetching) return <ScheduleLoading />;
        return <ScheduleErrorRetryButton onClick={() => refetchSchedules()} />;
    }

    if (!items.length) {
        if (isSchedulesFetching || isAnytimeSchedulesFetching) return <ScheduleLoading />;
        return <NoSchedule variant={ClassType.STUDY} />;
    }

    return (
        <>
            <List
                ref={scrollRef}
                subheader={<li />}
                className={classes.listRoot}
            >
                {studyScheduleSections.map((studySchedulesSection, sectionId) => (
                    <li
                        key={`section-${sectionId}`}
                        className={classes.listSection}
                    >
                        <ScheduleListSectionHeader title={studySchedulesSection.title} />
                        <ul className={classes.ul}>
                            {studySchedulesSection.schedules.map((studySchedule) => (
                                <ScheduleItem
                                    key={studySchedule.id}
                                    scheduleId={studySchedule.id}
                                    classType={studySchedule.is_home_fun ? ClassType.HOME_FUN_STUDY : studySchedule.is_review ? ClassType.REVIEW : ClassType.STUDY}
                                    title={studySchedule.title}
                                    actionTitle={intl.formatMessage({
                                        id: getIdStudyType(studySchedule),
                                    })}
                                    start_at={studySchedule.start_at}
                                    end_at={studySchedule.end_at}
                                    onClick={() => handleJoinClass(studySchedule)}
                                    onDetailClick={() => setStudyDetailOpen(studySchedule)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
                {isSchedulesFetching && (
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}
            </List>
            <StudyDetailsDialog
                open={dialogs.isStudyDetailOpen}
                studySchedule={selectedStudySchedule}
                onClose={() => {
                    setStudyDetailOpen(undefined);
                }}
            />
        </>
    );
}
