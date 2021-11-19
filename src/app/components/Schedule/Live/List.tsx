import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListItem from "@/app/components/Schedule/ListItem";
import ListItemAvatar from "@/app/components/Schedule/ListItemAvatar";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import LiveClassDetailsDialog from "@/app/components/Schedule/Live/Dialog/Details";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import {
    filterTodaySchedules,
    filterTomorrowSchedules,
    filterUpcomingSchedules,
    ScheduleListSection,
} from "@/app/components/Schedule/shared";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { formatStartEndDateTimeMillis } from "@/app/utils/dateTimeUtils";
import ScheduledLivePopcorn from "@/assets/img/schedule_popcorn.svg";
import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_FETCH_MONTH_DIFF,
    SCHEDULE_PAGE_SIZE,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
} from "@/config";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    SchedulesTimeViewListItem,
    usePostSchedulesTimeViewList,
} from "@kidsloop/cms-api-client";
import {
    Box,
    CircularProgress,
    createStyles,
    List,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    clamp,
    uniqBy,
} from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: theme.palette.background.paper,
        overflowY: `scroll`,
        flex: 1,
    },
    listItemTextPrimary: {
        color: `#0C3680`,
        fontWeight: 600, // theme.typography.fontWeightBold
    },
    listSection: {
        backgroundColor: `inherit`,
    },
    ul: {
        backgroundColor: `inherit`,
        padding: 0,
    },
}));

interface Props {
}

export default function LiveScheduleList (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedScheduleId, setSelectedScheduleId ] = useState<string>();
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
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
        page_size: SCHEDULE_PAGE_SIZE,
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
        const lastPage = Math.floor((schedulesData?.total ?? 0) / SCHEDULE_PAGE_SIZE + 1);
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
        setItems((oldItems) => uniqBy([ ...newItems, ...oldItems ], (item) => item.id).sort((a, b) => a.start_at - b.start_at));
    }, [ scheduleError, schedulesData ]);

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

    if (scheduleError) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return <ScheduleErrorRetryButton onClick={() => refetchSchedules()}/>;
    }

    if (!items.length) {
        if (isSchedulesFetching) return <ScheduleLoading />;
        return (
            <Typography
                variant="body2"
                color="textSecondary"
                align="center"
            >
                <FormattedMessage id="schedule_liveNoSchedule" />
            </Typography>
        );
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
                                <ScheduleListItem
                                    key={liveSchedule.id}
                                    leading={(
                                        <ListItemAvatar
                                            src={ScheduledLivePopcorn}
                                            alt={liveSchedule.title}
                                        />
                                    )}
                                    title={liveSchedule.title}
                                    subtitle={formatStartEndDateTimeMillis(fromSecondsToMilliseconds(liveSchedule.start_at), fromSecondsToMilliseconds(liveSchedule.end_at), intl)}
                                    onClick={() => setSelectedScheduleId(liveSchedule.id)}
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
                        <CircularProgress size={24}/>
                    </Box>
                )}
            </List>
            <LiveClassDetailsDialog
                scheduleId={selectedScheduleId}
                open={!!selectedScheduleId}
                onClose={() => {
                    setSelectedScheduleId(undefined);
                }}
            />
        </>
    );
}
