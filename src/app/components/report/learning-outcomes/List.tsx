import { CustomCalendar } from "@/app/components/report/calendar/customCalendar";
import { CalendarDialog } from "@/app/components/report/calendar/dialog/calendarDialog";
import LearningOutcomeListItem from "@/app/components/report/learning-outcomes/ListItem";
import ReportNoData from "@/app/components/report/no-data";
import { DataFilterByDates } from "@/app/components/report/share";
import ScheduleListSectionHeader from "@/app/components/Schedule/ListSectionHeader";
import { useReportContext } from "@/app/context-provider/report-context";
import { formatDueDateMillis } from "@/app/utils/dateTimeUtils";
import Loading from "@/components/loading";
import { THEME_COLOR_BACKGROUND_LIST } from "@/config";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { GetLearningOutComesResponse } from "@kl-engineering/cms-api-client";
import { Grid, List } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: `100%`,
        display: `contents`,
    },
    contentWrapper: {
        height: `100%`,
        overflowY: `scroll`,
    },
    listRoot: {
        width: `100%`,
        height: `100%`,
        flex: 1,
        overflowY: `scroll`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    listSection: {
        backgroundColor: `inherit`,
    },
    ul: {
        backgroundColor: `inherit`,
        padding: theme.spacing(0, 2),
    },
}));

export default function ReportLearningOutcomesList () {
    const classes = useStyles();
    const intl = useIntl();
    const [ openCalendar, setOpenCalendar ] = useState(false);
    const [ data, setData ] = useState<DataFilterByDates[]>([]);
    const {
        actions,
        startWeek,
        endWeek,
        learningOutcomesFilterByDates,
        loading,
    } = useReportContext();

    const onOpenCalendar = () => {
        setOpenCalendar(prev => !prev);
    };

    const onChangeCalendar = (dateStart: number, dateEnd: number) => {
        actions?.onChangeWeek(dateStart, dateEnd);
    };

    useEffect(() => {
        if(learningOutcomesFilterByDates.length > 0){
            let currentData: DataFilterByDates[] = [];
            currentData = learningOutcomesFilterByDates.sort((item1: DataFilterByDates, item2: DataFilterByDates) => {
                return ((item1.date) as number) - ((item2.date) as number);
            }).map((item: DataFilterByDates) => ({
                date: formatDueDateMillis(fromSecondsToMilliseconds((item.date) as number), intl),
                data: item.data,
            }));
            setData(currentData);
            return;
        }
        setData([]);
    }, [ learningOutcomesFilterByDates ]);

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
                    className={classes.contentWrapper}
                >
                    {data.length ?
                        (
                            <List
                                disablePadding
                                className={classes.listRoot}
                            >
                                {data.map((item: DataFilterByDates) => (
                                    <li
                                        key={item.date}
                                        className={classes.listSection}
                                    >
                                        <ul className={classes.ul}>
                                            <ScheduleListSectionHeader title={(item.date) as string} />
                                            {item.data.map((data) => {
                                                const learningOutcome = data as GetLearningOutComesResponse;
                                                return (
                                                    <LearningOutcomeListItem
                                                        key={learningOutcome.id}
                                                        title={learningOutcome.name}
                                                        status={learningOutcome.status}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </li>
                                ))}
                            </List>
                        ): (
                            <ReportNoData messageId="parentsDashboard.learningOutcome.empty" />
                        )
                    }
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
