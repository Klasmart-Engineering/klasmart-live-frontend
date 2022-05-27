import { CustomCalendar } from "../calendar/customCalendar";
import { CalendarDialog } from "../calendar/dialog/calendarDialog";
import { InsightMessage } from "../insight-message";
import { useReportContext } from "@/app/context-provider/report-context";
import { DataFilterByDates, ReportType } from "@/app/components/report/share";
import Loading from "@/components/loading";
import {
    THEME_COLOR_BACKGROUND_LIST
} from "@/config";
import {
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
{ useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ScheduleItemTile from "../../Schedule/ScheduleItemTile";
import { ClassType } from "@/store/actions";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { useIntl } from "react-intl";
import { chain } from "lodash";
import ScheduleListSectionHeader from "../../Schedule/ListSectionHeader";
import { ReportDetailData } from "../../reportDetail/reportDetail";
import { formatDueDateMillis } from "@/app/utils/dateTimeUtils";
import ReportNoData from "../no-data";
import { useSetRecoilState } from "recoil";
import { reportDetailState } from "@/app/model/appModel";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: `100%`,
        display: `contents`,
    },
    listRoot: {
        width: `100%`,
        height: `100%`,
        flex: 1,
        padding: 0,
        overflowY: `scroll`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    listSection: {
        backgroundColor: `inherit`,
        "&:last-child": {
            marginBottom: theme.spacing(1.5),
        },
    },
    content: {
        overflowY: `scroll`,
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    sectionItem: {
        backgroundColor: `inherit`,
        padding: theme.spacing(0, 2),
        "& > div:last-child": {
            marginBottom: 0,
        },
    },
}));

interface ReportSummaryListProps {
  type: ReportType;
}

interface LiveClassListProps {
  data: DataFilterByDates[];
  onClick?: (data: ReportDetailData) => void;
}

function LiveClassList(props: LiveClassListProps) {
  const { data: liveClasses, onClick = (data) => {}} = props;
  const classes = useStyles();

  return liveClasses.length ? (
    <List
        disablePadding
        className={classes.listRoot}
    >
        {liveClasses.map((item: DataFilterByDates) => (
            <li
                key={item.date}
                className={classes.listSection}
            >
                <ul className={classes.sectionItem}>
                    <ScheduleListSectionHeader title={(item.date) as string} />
                    {item.data.map((data) => {
                        const liveClass = data as ReportLiveClass;
                        return (
                            <ScheduleItemTile 
                                key={liveClass.schedule_id}
                                scheduleId={liveClass.schedule_id} 
                                classType={ClassType.LIVE} 
                                title={liveClass.schedule_title}
                                start_at={liveClass.class_start_time}
                                end_at={liveClass.complete_at}
                                isReport
                                isShowFeedback={liveClass.teacher_feedback !== ``}
                                onClick={() => onClick({
                                    assessment_id: liveClass.assessment_id,
                                    teacher_feedback: liveClass.teacher_feedback,
                                    schedule_id: liveClass.schedule_id,
                                    start_at: liveClass.class_start_time,
                                })} />
                        )
                    })}
                </ul>
            </li>
        ))}
    </List>
  ) : (
      <ReportNoData messageId="parentsDashboard.liveScheduled.empty" />
  );
}

function AssignmentsList(props: LiveClassListProps) {
  const { data: assignments, onClick = (data) => {} } = props;
  const classes = useStyles();

  return assignments.length ? (
    <List
        disablePadding
        className={classes.listRoot}
    >
        {assignments.map((item: DataFilterByDates) => (
            <li
                key={item.date}
                className={classes.listSection}
            >
                <ul className={classes.sectionItem}>
                    <ScheduleListSectionHeader title={(item.date) as string} />
                    {item.data.map((data) => {
                        const assignment = data as ReportAssignment;
                        return (
                            <ScheduleItemTile
                                key={assignment.schedule_id} 
                                scheduleId={assignment.schedule_id} 
                                classType={assignment.assessment_type === ClassType.HOME_FUN_STUDY ? ClassType.HOME_FUN_STUDY : ClassType.STUDY} 
                                title={assignment.assessment_title} 
                                isReport
                                isShowFeedback={assignment.teacher_feedback !== ``}
                                onClick={() => onClick({
                                    assessment_id: assignment.assessment_id,
                                    teacher_feedback: assignment.teacher_feedback,
                                    schedule_id: assignment.schedule_id,
                                    start_at: assignment.create_at,
                                })} />
                        )
                    })}
                </ul>
            </li>
        ))}
    </List>
  ) : (
      <ReportNoData messageId="parentsDashboard.studyAssessed.empty" />
  );
}

export default function ReportSummaryList (props: ReportSummaryListProps) {
    const {
      type
    } = props;
    const classes = useStyles();
    const history = useHistory();
    const intl = useIntl();
    const [ openCalendar, setOpenCalendar ] = useState(false);
    const [ data, setData ] = useState<DataFilterByDates[]>([]);
    const setReportDetail = useSetRecoilState(reportDetailState);
    const {
        actions,
        startWeek,
        endWeek,
        liveClasses,
        assignments,
        loading,
    } = useReportContext();

    const onOpenCalendar = () => {
        setOpenCalendar(!openCalendar);
    };

    const onChangeCalendar = (dateStart: number, dateEnd: number) => {
        actions?.onChangeWeek(dateStart, dateEnd);
    };

    const redirectReportDetail = (reportDetail: ReportDetailData) => {
        setReportDetail(reportDetail);
        history.push(`/report/detail`);
    };

    useEffect(() => {
        if (type !== ReportType.LIVE_CLASS) return;
        if (liveClasses.length > 0){
            let liveClassesWithFormattedDate: ReportLiveClass[] = liveClasses.sort((item1: ReportLiveClass, item2: ReportLiveClass) => {
                return item1.class_start_time - item2.class_start_time;
            }).map((liveClass) => {
                liveClass.date_time_start_at = formatDueDateMillis(fromSecondsToMilliseconds((liveClass.class_start_time) as number), intl);
                return liveClass;
            });
            let result: ReportLiveClass[] = [];
            const currentData: DataFilterByDates[] = chain(liveClassesWithFormattedDate).groupBy(`date_time_start_at`).map((value, key) => ({
                date: key,
                data: result.concat(...value),
            })).value();
            setData(currentData);
            return;
        }
        setData([]);
    }, [ liveClasses ]);

    useEffect(() => {
        if (type !== ReportType.STUDY_ASSESSMENTS) return;
        if (assignments.length > 0){
            let assignmentsWithFormattedDate: ReportAssignment[] = assignments.sort((item1: ReportAssignment, item2: ReportAssignment) => {
                return item1.complete_at - item2.complete_at;
            }).map((assignment) => {
                assignment.date_time_start_at = formatDueDateMillis(fromSecondsToMilliseconds((assignment.complete_at) as number), intl);
                return assignment;
            });
            let result: ReportAssignment[] = [];
            const currentData: DataFilterByDates[] = chain(assignmentsWithFormattedDate).groupBy(`date_time_start_at`).map((value, key) => ({
                date: key,
                data: result.concat(...value),
            })).value();
            setData(currentData);
            return;
        }
        setData([]);
    }, [ assignments ]);

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
                <Grid item className={classes.content}>
                    {type === ReportType.LIVE_CLASS && <LiveClassList data={data} onClick={(data) => {
                        redirectReportDetail(data);
                    }} />}
                    {type === ReportType.STUDY_ASSESSMENTS && <AssignmentsList data={data} onClick={(data) => {
                        redirectReportDetail(data);
                    }}/>}
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
