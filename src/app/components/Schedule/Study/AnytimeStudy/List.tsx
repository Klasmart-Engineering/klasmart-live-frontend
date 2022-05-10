import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import NoSchedule,
{ NoScheduleVariant } from "@/app/components/Schedule/NoSchedule";
import { getIdStudyType, ScheduleListSection } from "@/app/components/Schedule/shared";
import StudyDetailsDialog from "@/app/components/Schedule/Study/Dialog/Details";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import {
    isFocused,
    useWindowOnFocusChange,
} from "@/app/utils/windowEvents";
import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_PAGE_ITEM_HEIGHT_MIN,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
    schedulePageWindowItemHeightToPageSize,
    THEME_COLOR_BACKGROUND_LIST,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    SchedulesTimeViewListItem,
    useCmsApiClient,
    usePostSchedulesTimeViewList,
} from "@kl-engineering/cms-api-client";
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
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import ScheduleItemTile from "../../ScheduleItemTile";

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
        overflowY: `scroll`,
        flex: 1,
    },
    listSection: {
        backgroundColor: `inherit`,
        padding: theme.spacing(1, 2, 0),
    },
    ul: {
        backgroundColor: `inherit`,
        padding: 0,
    },
}));

export default function AnytimeStudyScheduleList () {
    const classes = useStyles();
    const intl = useIntl();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedStudySchedule, setSelectedStudySchedule ] = useState<SchedulesTimeViewListItem>();
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const { setToken, setTeachers, setDueDate, setTitle } = useSessionContext();
    const { actions } = useCmsApiClient();
    const { push } = useHistory();
    const organization = useSelectedOrganizationValue();

    const organizationId = organization?.organization_id ?? ``;
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60 * -1;
    now.setMinutes(Math.floor(now.getMinutes() / SCHEDULE_FETCH_INTERVAL_MINUTES) * SCHEDULE_FETCH_INTERVAL_MINUTES);
    const pageSize = schedulePageWindowItemHeightToPageSize(window.innerHeight, SCHEDULE_PAGE_ITEM_HEIGHT_MIN);

    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
        error: scheduleError,
        refetch: refetchSchedules,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        order_by: `schedule_at`,
        view_type: `full_view`,
        time_boundary: `union`,
        page,
        page_size: pageSize,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        with_assessment_status: true,
        time_zone_offset: timeZoneOffset,
        class_types: [ `Homework` ],
        anytime: true,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

    const studyScheduleSections: ScheduleListSection[] = items.length
        ? [
            {
                schedules: items,
            },
        ]
        : [];

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
            const { title, teachers, due_at } = await actions.getScheduleById({
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

    useEffect(() => {
        if (scheduleError) setItems([]);
        if (!schedulesData) return;
        const newItems = schedulesData?.data ?? [];
        setItems((oldItems) => uniqBy([ ...newItems, ...oldItems ], (item) => item.id).sort((a, b) => a.created_at - b.created_at));
    }, [ scheduleError, schedulesData ]);

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

    if (scheduleError) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return <ScheduleErrorRetryButton onClick={() => refetchSchedules()} />;
    }

    if (!items.length) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return <NoSchedule variant={NoScheduleVariant.STUDY} />;
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
                        <ul className={classes.ul}>
                            {studySchedulesSection.title && <ScheduleListSectionHeader title={studySchedulesSection.title} />}
                            {studySchedulesSection.schedules.map((studySchedule) => {
                                return (
                                    <ScheduleItemTile
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
                                );})}
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
