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
    useState,
} from "react";
import { DateRange, RangeKeyDict, Range } from "react-date-range";

import {
  startOfWeek,
  endOfWeek,
} from 'date-fns';

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
    onClose: () => void;
}

export function CalendarDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();

    const [selectionRange, setSelectionRange] = useState<Range>({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
        key: `selection`,
    });

    const handleSelect = (ranges: RangeKeyDict) => {
        const newRanges = { ...ranges };
        const range = newRanges['selection'];
        range.startDate = startOfWeek(range.startDate ?? new Date());
        range.endDate = endOfWeek(range.startDate ?? new Date());
        setSelectionRange(range);
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
            onClose={onClose}
        >
            <DialogContent className={classes.content}>
                <DateRange
                    rangeColors={[ COLOR_RANGE_CALENDAR ]}
                    showDateDisplay={false}
                    showMonthAndYearPickers={false}
                    ranges={[ selectionRange ]}
                    onChange={handleSelect}
                    showPreview={false}
                />
            </DialogContent>
        </Dialog>
    );
}
