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

import {
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { endOfDateCal, endOfWeekCal, startOfDateCal, startOfWeekCal } from "@/app/utils/common";

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

type onCloseType = (startDate: number, endDate: number) => void;
interface Props {
    open: boolean;
    startWeek: number;
    endWeek: number;
    onClose: onCloseType;
}

export function CalendarDialog (props: Props) {
    const {
        open,
        onClose,
        startWeek,
        endWeek
    } = props;
    const classes = useStyles();

    const [ startDate, setStartDate ] = useState(0);
    const [ endDate, setEndDate ] = useState(0);
    
    const [selectionRange, setSelectionRange] = useState<Range>({
        startDate: startOfDateCal(new Date()),
        endDate: endOfDateCal(new Date()),
        key: `selection`,
    });

    useEffect(() => {

        const newRange = {
            startDate: startOfDateCal(startWeek*1000),
            endDate: endOfDateCal(endWeek*1000),
            key: `selection`,
        }
        setSelectionRange(newRange);
        setStartDate(startWeek);
        setEndDate(endWeek);
    }, [startWeek, endWeek])

    const handleSelect = (ranges: RangeKeyDict) => {

        const newRanges = { ...ranges };
        const range = newRanges['selection'];
        if (range.startDate === undefined || range.endDate === undefined) return;
        range.startDate = startOfDateCal(range.startDate);
        range.endDate = endOfDateCal(range.startDate);
        setSelectionRange(range);
        setStartDate(startOfWeekCal(range.startDate));
        setEndDate(endOfWeekCal(range.startDate));
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
                onClose(startDate, endDate);
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
                    maxDate={new Date()}
                />
            </DialogContent>
        </Dialog>
    );
}
