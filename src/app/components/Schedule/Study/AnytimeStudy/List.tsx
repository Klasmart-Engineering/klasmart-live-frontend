import ScheduleErrorRetryButton from "@/app/components/Schedule/ErrorRetryButton";
import ScheduleListItem from "@/app/components/Schedule/ListItem";
import ListItemAvatar from "@/app/components/Schedule/ListItemAvatar";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import {
    getStudyType,
    ScheduleListSection,
    StudyAssessmentStatus,
} from "@/app/components/Schedule/shared";
import StudyDetailsDialog from "@/app/components/Schedule/Study/Dialog/Details";
import { useSelectedOrganizationValue } from "@/app/data/user/atom";
import { homeFunStudyState } from "@/app/model/appModel";
import ScheduledStudyHouse from "@/assets/img/study_house.svg";
import {
    SCHEDULE_FETCH_INTERVAL_MINUTES,
    SCHEDULE_PAGE_ITEM_HEIGHT_MIN,
    SCHEDULE_PAGE_START,
    SCHEDULE_PAGINATION_DELAY,
    schedulePageWindowItemHeightToPageSize,
} from "@/config";
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
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    listRoot: {
        width: `100%`,
        backgroundColor: theme.palette.background.paper,
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

interface Props {
}

export default function AnytimeStudyScheduleList (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedScheduleId, setSelectedScheduleId ] = useState<string>();
    const [ page, setPage ] = useState(SCHEDULE_PAGE_START);
    const [ items, setItems ] = useState<SchedulesTimeViewListItem[]>([]);
    const organization = useSelectedOrganizationValue();
    const homeFunStudy = useRecoilValue(homeFunStudyState);

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
        if(!homeFunStudy.submitted) return;
        refetchSchedules();
    }, [ homeFunStudy.submitted ]);

    useEffect(() => {
        if (scheduleError) setItems([]);
        if (!schedulesData) return;
        const newItems = schedulesData?.data ?? [];
        // newItems can only be added before oldItems once https://calmisland.atlassian.net/browse/KLS-227 is completed and when sorted by `create_at`
        setItems((oldItems) => uniqBy([ ...oldItems, ...newItems ], (item) => item.id));
    }, [ scheduleError, schedulesData ]);

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
                <FormattedMessage id="schedule_studyNoSchedule" />
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
                {studyScheduleSections.map((studySchedulesSection, sectionId) => (
                    <li
                        key={`section-${sectionId}`}
                        className={classes.listSection}
                    >
                        <ul className={classes.ul}>
                            {studySchedulesSection.title && <ScheduleListSectionHeader title={studySchedulesSection.title} />}
                            {studySchedulesSection.schedules.map((studySchedule) => (
                                <ScheduleListItem
                                    key={studySchedule.id}
                                    leading={(
                                        <ListItemAvatar
                                            src={ScheduledStudyHouse}
                                            alt={studySchedule.title}
                                        />
                                    )}
                                    title={studySchedule.title}
                                    subtitle={getStudyType(studySchedule, intl)}
                                    trailing={StudyAssessmentStatus(studySchedule)}
                                    onClick={() => setSelectedScheduleId(studySchedule.id)}
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
                open={!!selectedScheduleId}
                onClose={() => {
                    setSelectedScheduleId(undefined);
                }}
            />
        </>
    );
}
