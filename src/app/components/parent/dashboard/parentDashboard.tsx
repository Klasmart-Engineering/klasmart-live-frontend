import { CustomCalendar } from "../calendar/customCalendar";
import { CalendarDialog } from "../calendar/dialog/calendarDialog";
import ParentListItem from "../list/ListItem";
import { LearningOutComes, useParentsDataContext } from "@/app/context-provider/parent-context";
import LearningOutComesIcon from "@/assets//img/parent-dashboard/learning_outcomes.svg";
import LiveIcon from "@/assets//img/parent-dashboard/live_attendance.svg";
import StudyTaskIcon from "@/assets//img/parent-dashboard/study_tasks.svg";
import Loading from "@/components/loading";
import { THEME_COLOR_BACKGROUND_LIST } from "@/config";
import { GetLearningOutComesResponse, GetAppInsightMessagesResponse } from "@kl-engineering/cms-api-client";
import {
    createStyles,
    Grid,
    List,
    makeStyles,
} from "@material-ui/core";
import React,
{ useState } from "react";
import { useHistory } from "react-router-dom";

enum ClassesItem {
    INSIGHT_MESSAGE,
    LIVE_CLASS,
    STUDY_ASSESSMENTS,
    LEARNING_OUTCOMES,
}

const useStyles = makeStyles(() => createStyles({
    root: {
        height: `100%`,
        display: `block`,
    },
    listRoot: {
        width: `100%`,
        height: `100%`,
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

interface StudyAssignmentsections<T> {
    id: ClassesItem;
    title: string;
    viewTitle: string;
    icon: string;
    data?: Array<T>;
}

export default function ParentDashboard () {
    const classes = useStyles();
    const [ openCalendar, setOpenCalendar ] = useState(false);
    const {
        actions,
        startWeek,
        endWeek,
        insightMessageList,
        learningOutComesList,
        loading,
    } = useParentsDataContext();

    const history = useHistory();

    let studyAssignmentsections: StudyAssignmentsections<LearningOutComes | GetAppInsightMessagesResponse> [] = [
        // {
        //     id: ClassesItem.LIVE_CLASS,
        //     title: `report.dashboard.live.title`,
        //     viewTitle: `report.dashboard.live.detail`,
        //     icon: LiveIcon,
        // },
        // {
        //     id: ClassesItem.STUDY_ASSESSMENTS,
        //     title: `report.dashboard.study.title`,
        //     viewTitle: `report.dashboard.study.detail`,
        //     icon: StudyTaskIcon,
        // },
        {
            id: ClassesItem.LEARNING_OUTCOMES,
            title: `parentsDashboard.learningOutcome.title`,
            viewTitle: `parentsDashboard.learningOutcome.view`,
            icon: LearningOutComesIcon,
            data: [learningOutComesList],
        },
    ];

    if (insightMessageList && insightMessageList.length > 0) {
        if (Object.keys(insightMessageList[0]).length > 0) {
            studyAssignmentsections = [
                {
                    id: ClassesItem.INSIGHT_MESSAGE,
                    title: ``,
                    viewTitle: ``,
                    icon: ``,
                    data: insightMessageList,
                },
                ...studyAssignmentsections,
            ];
        }
    }

    const onOpenCalendar = () => {
        setOpenCalendar(!openCalendar);
    };

    const onNavigateToLearning = () => {
        history.push(`/learning-outcomes`);
    };

    const onChangeCalendar = (dateStart: number, dateEnd: number) => {
        actions?.onChangeWeek(dateStart, dateEnd);
    };

    if(loading){
        return <Loading messageId="loading" />;
    }

    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                className={classes.root}
            >
                <Grid
                    item
                >
                    <CustomCalendar
                        startWeek={startWeek}
                        endWeek={endWeek}
                        onOpenCalendar={onOpenCalendar}
                        onChangeCalendar={onChangeCalendar}
                    />
                </Grid>
                <Grid
                    item
                    style={{
                        overflowY: `scroll`,
                        height: `100%`,
                    }}
                >
                    <List
                        subheader={<li />}
                        className={classes.listRoot}
                    >
                        {studyAssignmentsections.map((item) => (
                            <ParentListItem
                                key={item.id}
                                title={item.title}
                                listData={item.data}
                                isInsightMessage={item.id === ClassesItem.INSIGHT_MESSAGE}
                                isLiveClassAt={item.id === ClassesItem.LIVE_CLASS}
                                isStudyAssessments={item.id === ClassesItem.STUDY_ASSESSMENTS}
                                isLearningOutcomes={item.id === ClassesItem.LEARNING_OUTCOMES}
                                icon={item.icon}
                                assessment={item.viewTitle}
                                onChangeDirection={onNavigateToLearning}
                            />
                        ))}
                    </List>
                </Grid>
            </Grid>
            <CalendarDialog
                startWeek={startWeek}
                endWeek={endWeek}
                open={openCalendar}
                onClose={(startDate, endDate) => {
                    setOpenCalendar(false);
                    onChangeCalendar(startDate, endDate);
                }}
            />
        </>
    );
}
