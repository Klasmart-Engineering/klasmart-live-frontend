import { CustomCalendar } from "../calendar/customCalendar";
import { CalendarDialog } from "../calendar/dialog/calendarDialog";
import { InsightMessage } from "../insight-message";
import ParentDashboardListItem from "./ListItem";
import { ReportType } from "@/app/components/report/share";
import { useReportContext } from "@/app/context-provider/report-context";
import LearningOutComesIcon from "@/assets//img/parent-dashboard/learning_outcomes.svg";
import Loading from "@/components/loading";
import {
    LEARNING_OUTCOMES_COLOR,
    THEME_COLOR_BACKGROUND_LIST,
} from "@/config";
import {
    GetLearningOutComesResponse,
    ReportAssignment,
    ReportLiveClass,
} from "@kl-engineering/cms-api-client";
import {
    createStyles,
    Grid,
    List,
    makeStyles,
} from "@material-ui/core";
import React,
{ useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => createStyles({
    root: {
        height: `100%`,
        display: `block`,
    },
    listRoot: {
        width: `100%`,
        height: `100%`,
        flex: 1,
        padding: 0,
        overflowY: `scroll`,
    },
    content: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
        overflowY: `scroll`,
    },
}));

interface ParentDashboardItem {
    id: ReportType;
    title: string;
    viewText: string;
    emptyText: string;
    icon: string;
    color: string;
    data: ReportLiveClass[] | ReportAssignment[] | GetLearningOutComesResponse[];
}

export default function ParentDashboard () {
    const classes = useStyles();
    const history = useHistory();
    const [ openCalendar, setOpenCalendar ] = useState(false);
    const {
        actions,
        startWeek,
        endWeek,
        learningOutcomes,
        loading,
    } = useReportContext();

    const parentDashboardArray: ParentDashboardItem[] = [
        {
            id: ReportType.LEARNING_OUTCOMES,
            title: `parentsDashboard.learningOutcome.title`,
            viewText: `parentsDashboard.learningOutcome.view`,
            emptyText: `parentsDashboard.learningOutcome.empty`,
            icon: LearningOutComesIcon,
            color: LEARNING_OUTCOMES_COLOR,
            data: learningOutcomes,
        },
    ];

    const onOpenCalendar = () => {
        setOpenCalendar(prev => !prev);
    };

    const onRedirect = (id: ReportType) => {
        switch(id){
        case ReportType.LIVE_CLASS:
            break;
        case ReportType.STUDY_ASSESSMENTS:
            break;
        case ReportType.LEARNING_OUTCOMES:
            history.push(`/report/learning-outcomes`);
            break;
        }
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
                <Grid item>
                    <CustomCalendar
                        startWeek={startWeek}
                        endWeek={endWeek}
                        onOpenCalendar={onOpenCalendar}
                        onChangeCalendar={onChangeCalendar}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.content}
                >
                    <InsightMessage />
                    <List className={classes.listRoot}>
                        {parentDashboardArray.map((dashboardItem: ParentDashboardItem) => (
                            <ParentDashboardListItem
                                key={dashboardItem.id}
                                type={dashboardItem.id}
                                onRedirect={() => onRedirect(dashboardItem.id)}
                                {...dashboardItem}
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
