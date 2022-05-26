import "./css/styles.css"; 
import "./css/default.css"; 
import {
    COLOR_RANGE_CALENDAR,
} from "@/config";
import {
    Dialog,
    DialogContent,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";
import { fromSecondsToMilliseconds, fromDateToSeconds } from "@/utils/utils";
import { floor } from "lodash";
import { isSameDay } from "date-fns";
import {
    DateTypeOfWeek,
    getStartEndDateOfWeekReturnDate, 
    initStarEndDateOfWeekReturnDate,  } from "@/app/utils/dateTimeUtils";

const useStyles = makeStyles((theme) => ({
    content: {
        display: `flex`,
        padding: theme.spacing(5, 2, 2),
        backgroundColor: `transparent`,

        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(8, 4, 2),
        },
        justifyContent: `center`,
        alignItems: `center`,
    },
}));

interface Props {
    open: boolean;
    startWeek: number;
    endWeek: number;
    onClose: (startWeek: number, endWeek: number) => void;
}

export function CalendarDialog (props: Props) {
    const {
        open,
        onClose,
        startWeek,
        endWeek
    } = props;
    const classes = useStyles();
    const { initStartDate, initEndDate } = initStarEndDateOfWeekReturnDate();
    const [selectionRange, setSelectionRange] = useState<Range>({
        startDate: initStartDate,
        endDate: initEndDate,
        key: `selection`,
    });
    const [selectedStartEndWeek, setSelectedStartEndWeek] = useState({
        startWeek: 0,
        endWeek: 0,
    })

    useEffect(() => {
        setSelectionRange({
            startDate: getStartEndDateOfWeekReturnDate(fromSecondsToMilliseconds(startWeek), DateTypeOfWeek.START_DATE),
            endDate: getStartEndDateOfWeekReturnDate(fromSecondsToMilliseconds(endWeek), DateTypeOfWeek.END_DATE),
            key: `selection`,
        });
        setSelectedStartEndWeek({ startWeek, endWeek });
    }, [ endWeek ])

    const handleSelect = (ranges: RangeKeyDict) => {
        const range = ranges.selection;

        if (range.startDate === undefined || range.endDate === undefined) return;

        if (isSameDay(range.startDate,(selectionRange.startDate) as Date) 
            || isSameDay(range.endDate, (selectionRange?.endDate) as Date)) return;

        range.startDate = getStartEndDateOfWeekReturnDate(range.startDate, DateTypeOfWeek.START_DATE);
        range.endDate = getStartEndDateOfWeekReturnDate(range.startDate, DateTypeOfWeek.END_DATE);

        setSelectionRange({
            ...range,
            key: `selection`,
        });

        setSelectedStartEndWeek({
            startWeek: floor(fromDateToSeconds(range.startDate)),
            endWeek: floor(fromDateToSeconds(range.endDate)),
        })
    };

    return (
        <Dialog
            aria-labelledby="select-calendar-dialog"
            open={open}
            PaperProps={{
                style: {
                    backgroundColor: `transparent`,
                    boxShadow: `none`,
                },
            }}
            onClose={() => {
                onClose(
                    selectedStartEndWeek.startWeek,
                    selectedStartEndWeek.endWeek
                );
            }}
        >
            <DialogContent className={classes.content}>
                <DateRange
                    rangeColors={[ COLOR_RANGE_CALENDAR ]}
                    showDateDisplay={false}
                    showMonthAndYearPickers={false}
                    ranges={[ selectionRange ]}
                    onChange={handleSelect}
                    showPreview={false}
                    weekStartsOn={1}
                    maxDate={(initEndDate) as Date}
                />
            </DialogContent>
        </Dialog>
    );
}
