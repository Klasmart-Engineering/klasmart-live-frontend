import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import LiveClassDetailsDialog from "@/app/components/Schedule/Live/Dialog/Details";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import NoSchedule,
{ NoScheduleVariant } from "@/app/components/Schedule/NoSchedule";
import {
    filterTodaySchedules,
    filterTomorrowSchedules,
    filterUpcomingSchedules,
    ScheduleListSection,
} from "@/app/components/Schedule/shared";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { ScheduleLiveTokenType } from "@/app/services/cms/ISchedulerService";
import {
    isFocused,
    useWindowOnFocusChange,
} from "@/app/utils/windowEvents";
import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_FETCH_MONTH_DIFF,
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
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";
import ScheduleItemTile from "../ScheduleItemTile";

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
        overflowY: `scroll`,
        flex: 1,
    },
    listSection: {
        backgroundColor: `inherit`,
        padding: theme.spacing(0, 2),
    },
    ul: {
        backgroundColor: `inherit`,
        padding: 0,
    },
}));

export default function LiveScheduleList () {
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedScheduleId, setSelectedScheduleId ] = useState<string>();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const { setToken, setTeachers, setTitle, setStartTime } = useSessionContext();
    const { actions } = useCmsApiClient();
    const organization = useSelectedOrganizationValue();

    const organizationId = organization?.organization_id ?? ``;
    const now = new Date();
    const timeZoneOffset = now.getTimezoneOffset() * 60 * -1;
    now.setSeconds(0); // floor the seconds to 0 to not cause unncessary refetches
    now.setMinutes(Math.floor(now.getMinutes() / SCHEDULE_FETCH_INTERVAL_MINUTES) * SCHEDULE_FETCH_INTERVAL_MINUTES); // and round to the nearest (low) whole 5 minutes
    const nowInSeconds = Math.floor(now.getTime() / 1000);
    const twoMonthsFromNow = new Date(now);
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + SCHEDULE_FETCH_MONTH_DIFF);
    const twoMonthsFromNowInSeconds = Math.floor(twoMonthsFromNow.getTime() / 1000);
    const pageSize = schedulePageWindowItemHeightToPageSize(window.innerHeight, SCHEDULE_PAGE_ITEM_HEIGHT_MIN);
    const [ timeBeforeClassSeconds, setTimeBeforeClassSeconds ] = useState(Number.MAX_SAFE_INTEGER);

    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
        error: scheduleError,
        refetch: refetchSchedules,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        view_type: `full_view`,
        time_boundary: `union`,
        page,
        page_size: pageSize,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        start_at_ge: nowInSeconds,
        end_at_le: twoMonthsFromNowInSeconds,
        time_zone_offset: timeZoneOffset,
        order_by: `start_at`,
        class_types: [ `OnlineClass` ],
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

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

    const handleJoinLiveClass = async (liveSchedule: SchedulesTimeViewListItem) => {
        if (!liveSchedule.id) return;
        try {
            const { token } = await actions.getLiveTokenByScheduleId({
                org_id: organizationId,
                schedule_id: liveSchedule.id,
                live_token_type: ScheduleLiveTokenType.LIVE,
            });
            const { title, start_at, teachers } = await actions.getScheduleById({
                org_id: organizationId,
                schedule_id: liveSchedule.id,
            })
            setTeachers(teachers);
            setTitle(title);
            setStartTime(start_at);
            setToken(token);

            location.href = `#/room?token=${token}`;
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `error_unknown_error`,
            }), {
                variant: `error`,
            });
        }
    };

    useEffect(() => {
        if (scheduleError) setItems([]);
        if (!schedulesData) return;
        const newItems = schedulesData?.data ?? [];

        if(page === SCHEDULE_PAGE_START) {
            setItems(newItems);
            return;
        }
        setItems((oldItems) => uniqBy([ ...newItems, ...oldItems ], (item) => item.id).sort((a, b) => a.start_at - b.start_at));
    }, [
        scheduleError,
        schedulesData,
        page,
    ]);

    const onFocusChange = useCallback(() => {
        if (isFocused()) return;
        if (page === SCHEDULE_PAGE_START) return;
        setItems([]);
        setPage(SCHEDULE_PAGE_START);
    }, [ page ]);

    useWindowOnFocusChange(onFocusChange);

    const todayLiveSchedules = items.filter(filterTodaySchedules);
    const tomorrowLiveSchedules = items.filter(filterTomorrowSchedules);
    const upcomingLiveSchedules = items.filter(filterUpcomingSchedules);

    const liveClassSections: Required<ScheduleListSection>[] = [
        ...todayLiveSchedules.length
            ? [
                {
                    title: intl.formatMessage({
                        id: `schedule_liveSubheaderToday`,
                    }),
                    schedules: todayLiveSchedules,
                },
            ]
            : [],
        ...tomorrowLiveSchedules.length
            ? [
                {
                    title: intl.formatMessage({
                        id: `schedule_liveSubheaderTomorrow`,
                    }),
                    schedules: tomorrowLiveSchedules,
                },
            ]
            : [],
        ...upcomingLiveSchedules.length
            ? [
                {
                    title: intl.formatMessage({
                        id: `schedule_liveSubheaderUpcoming`,
                    }),
                    schedules: upcomingLiveSchedules,
                },
            ]
            : [],
    ];

    const setLiveClassDetailOpen = (scheduleId?: string) => {
        setDialogs({
            ...dialogs,
            isLiveClassDetailOpen: !!scheduleId,
        });
        setSelectedScheduleId(scheduleId);
    };

    if (scheduleError) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return <ScheduleErrorRetryButton onClick={() => refetchSchedules()} />;
    }

    if (!items.length) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return <NoSchedule variant={NoScheduleVariant.LIVE} />;
    }

    return (
        <>
            <List
                ref={scrollRef}
                subheader={<li />}
                className={classes.listRoot}
            >
                {liveClassSections.map((liveSchedulesSection, sectionId) => (
                    <li
                        key={`section-${sectionId}`}
                        className={classes.listSection}
                    >
                        <ul className={classes.ul}>
                            <ScheduleListSectionHeader title={liveSchedulesSection.title} />
                            {liveSchedulesSection.schedules.map((liveSchedule) => (
                                <ScheduleItemTile
                                    key={liveSchedule.id}
                                    scheduleId={liveSchedule.id}
                                    classType={ClassType.LIVE}
                                    title={liveSchedule.title}
                                    actionTitle={intl.formatMessage({
                                        id: `schedule.status.joinNow`,
                                        defaultMessage: `Join Now`,
                                    })}
                                    start_at={liveSchedule.start_at}
                                    end_at={liveSchedule.end_at}
                                    onClick={() => handleJoinLiveClass(liveSchedule)}
                                    onDetailClick={() => setLiveClassDetailOpen(liveSchedule.id)}
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
            <LiveClassDetailsDialog
                scheduleId={selectedScheduleId}
                open={dialogs.isLiveClassDetailOpen}
                onClose={() => {
                    setLiveClassDetailOpen(undefined);
                }}
            />
        </>
    );
}
