import { CustomCalendar } from "../calendar/customCalendar";
import ParentListItem from "../list/ListItem";
import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import NoSchedule,
{ NoScheduleVariant } from "@/app/components/Schedule/NoSchedule";
import { ScheduleListSection } from "@/app/components/Schedule/shared";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { dialogsState } from "@/app/model/appModel";
import {
    isFocused,
    useWindowOnFocusChange,
} from "@/app/utils/windowEvents";
import LearningOutComesIcon from "@/assets//img/parent-dashboard/learning_outcomes.svg";
import LiveIcon from "@/assets//img/parent-dashboard/live_attendance.svg";
import StudyTaskIcon from "@/assets//img/parent-dashboard/study_tasks.svg";
import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_PAGE_ITEM_HEIGHT_MIN,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
    schedulePageWindowItemHeightToPageSize,
    THEME_COLOR_BACKGROUND_LIST,
} from "@/config";
import {
    SchedulesTimeViewListItem,
    usePostSchedulesTimeViewList,
} from "@kl-engineering/cms-api-client";
import {
    createStyles,
    Grid,
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
import { useRecoilState } from "recoil";

const useStyles = makeStyles(() => createStyles({
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
    },
}));

export default function ParentDashboard () {
    const classes = useStyles();
    const intl = useIntl();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
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

    const setStudyDetailOpen = (scheduleId?: string) => {
        setDialogs({
            ...dialogs,
            isStudyDetailOpen: !!scheduleId,
        });
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
        <Grid
            container
            direction="column"
            alignItems="center"
            style={{
                height: `100%`,
                display: `block`,
            }}
        >
            <Grid
                item
            >
                <CustomCalendar />
            </Grid>
            <Grid
                item
            >
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
                                {studySchedulesSection.schedules.map((studySchedule, index) => (

                                    <ParentListItem
                                        key={studySchedule.id}
                                        title={studySchedule.title}
                                        status={`6/10`}
                                        isLiveClassAt={studySchedule.is_home_fun && (index % 2 !== 0)}
                                        isStudyAssessments = {studySchedule.is_home_fun && (index % 2 === 0)}
                                        isLearningOutcomes = {!studySchedule.is_home_fun}
                                        icon={studySchedule.is_home_fun ? ((index % 2 === 0) ? StudyTaskIcon : LiveIcon) : LearningOutComesIcon}
                                        assessment={studySchedule.class_type}
                                    />
                                ))}
                            </ul>
                        </li>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}
