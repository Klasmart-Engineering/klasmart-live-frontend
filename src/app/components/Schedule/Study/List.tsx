import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListItem from "@/app/components/Schedule/ListItem";
import ListItemAvatar from "@/app/components/Schedule/ListItemAvatar";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import NoSchedule,
{ NoScheduleVariant } from "@/app/components/Schedule/NoSchedule";
import {
    getIconStudyType,
    getStudyType,
    getTitleReview,
    StudyAssessmentStatus,
} from "@/app/components/Schedule/shared";
import StudyDetailsDialog from "@/app/components/Schedule/Study/Dialog/Details";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import { formatDueDateMillis } from "@/app/utils/dateTimeUtils";
import {
    isFocused,
    useWindowOnFocusChange,
} from "@/app/utils/windowEvents";
import {
    BG_AVT_ANYTIME_STUDY_DEFAULT,
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_FETCH_MONTH_DIFF,
    SCHEDULE_HOME_FUN_STUDY_DISPLAY_COUNT_MAX,
    SCHEDULE_PAGE_ITEM_HEIGHT_MIN,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
    schedulePageWindowItemHeightToPageSize,
    THEME_COLOR_BACKGROUND_LIST,
} from "@/config";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import {
    SchedulesTimeViewListItem,
    usePostSchedulesTimeViewList,
} from "@kidsloop/cms-api-client";
import {
    Avatar,
    Box,
    CircularProgress,
    createStyles,
    List,
    makeStyles,
} from "@material-ui/core";
import { ChevronRight } from "@styled-icons/material";
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

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
        overflowY: `scroll`,
        flex: 1,
    },
    listSection: {
        backgroundColor: `inherit`,
    },
    ul: {
        backgroundColor: `inherit`,
        padding: 0,
        "& > li:last-child > :first-child": {
            marginBottom: theme.spacing(1),
        },
    },
    submittedText: {
        color: `#5DBD3B`,
    },
    anytimeStudyAvatar: {
        backgroundColor: BG_AVT_ANYTIME_STUDY_DEFAULT,
        color: theme.palette.common.white,
    },
}));

export default function StudyScheduleList () {
    const classes = useStyles();
    const intl = useIntl();
    const history = useHistory();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedScheduleId, setSelectedScheduleId ] = useState<string>();
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
    const organization = useSelectedOrganizationValue();

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

    const displayHomeFunStudyCount = () => {
        const count = (anytimeSchedulesData?.total ?? 0);
        if (count > SCHEDULE_HOME_FUN_STUDY_DISPLAY_COUNT_MAX) return `${SCHEDULE_HOME_FUN_STUDY_DISPLAY_COUNT_MAX}+`;
        return count;
    };

    const handleAnytimeStudyClick = () => {
        history.push(`/schedule/anytime-study`);
    };

    const setStudyDetailOpen = (scheduleId?: string) => {
        setDialogs({
            ...dialogs,
            isStudyDetailOpen: !!scheduleId,
        });
        setSelectedScheduleId(scheduleId);
    };

    if (scheduleError) {
        if (isSchedulesFetching || isAnytimeSchedulesFetching) return <ScheduleLoading />;
        return <ScheduleErrorRetryButton onClick={() => refetchSchedules()}/>;
    }

    if (!items.length && !anytimeSchedulesData?.total) {
        if (isSchedulesFetching || isAnytimeSchedulesFetching) return <ScheduleLoading />;
        return <NoSchedule variant={NoScheduleVariant.STUDY} />;
    }

    return (
        <>
            <List
                ref={scrollRef}
                subheader={<li />}
                className={classes.listRoot}
            >
                <ScheduleListItem
                    isAnytimeStudy
                    leading={(
                        <Avatar className={classes.anytimeStudyAvatar}>
                            {isAnytimeSchedulesFetching
                                ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                )
                                : displayHomeFunStudyCount()
                            }
                        </Avatar>
                    )}
                    title={intl.formatMessage({
                        id: `schedule_studyAnytimeStudy`,
                    })}
                    trailing={<ChevronRight size={24} />}
                    onClick={handleAnytimeStudyClick}
                />
                {studyScheduleSections.map((studySchedulesSection, sectionId) => (
                    <li
                        key={`section-${sectionId}`}
                        className={classes.listSection}
                    >
                        <ul className={classes.ul}>
                            <ScheduleListSectionHeader title={studySchedulesSection.title} />
                            {studySchedulesSection.schedules.map((studySchedule) => (
                                <ScheduleListItem
                                    key={studySchedule.id}
                                    isStudySchedule
                                    leading={(
                                        <ListItemAvatar
                                            imgType
                                            src={getIconStudyType(studySchedule)}
                                        />
                                    )}
                                    title={studySchedule.is_review ? getTitleReview(studySchedule, studySchedule.title, intl) : studySchedule.title}
                                    subtitle={getStudyType(studySchedule, intl)}
                                    trailing={StudyAssessmentStatus(studySchedule)}
                                    onClick={() => setStudyDetailOpen(studySchedule.id)}
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
            <StudyDetailsDialog
                scheduleId={selectedScheduleId}
                open={dialogs.isStudyDetailOpen}
                onClose={() => {
                    setStudyDetailOpen(undefined);
                }}
            />
        </>
    );
}
