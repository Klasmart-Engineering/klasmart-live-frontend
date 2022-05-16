import { CustomCalendar } from "../parent/calendar/customCalendar";
import { CalendarDialog } from "../parent/calendar/dialog/calendarDialog";
import ListSectionHeader from "./header/listSectionHeader";
import LearningOutcomesItems from "./list/listItem";
import { LearningOutComes, useParentsDataContext } from "@/app/context-provider/parent-context";
import { formatMonthDateYear } from "@/app/utils/dateTimeUtils";
import Loading from "@/components/loading";
import { THEME_COLOR_BACKGROUND_LIST } from "@/config";
import {
    createStyles,
    Grid,
    List,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() => createStyles({
    root: {
        height: `100%`,
        display: `contents`,
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

export default function LearningOutcomes () {
    const classes = useStyles();
    const intl = useIntl();
    const [ openCalendar, setOpenCalendar ] = useState(false);
    const {
        actions,
        learningOutComesList,
        startWeek,
        endWeek,
        loading,
    } = useParentsDataContext();

    const onOpenCalendar = () => {
        setOpenCalendar(!openCalendar);
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
                        className={classes.listRoot}
                    >
                        {Object.keys(learningOutComesList).map((key) => (
                            <li
                                key={`section-${key}`}
                                className={classes.listSection}
                            >
                                <ul className={classes.ul}>
                                    {key && <ListSectionHeader title={key} />}
                                    {learningOutComesList[key].map((item) => (
                                        <LearningOutcomesItems
                                            key={item.id}
                                            title={item.name}
                                            status={item.status}
                                        />
                                    ))}
                                </ul>
                            </li>
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
