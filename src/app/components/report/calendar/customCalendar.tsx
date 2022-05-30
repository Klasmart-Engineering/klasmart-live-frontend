// Inspired by the former Facebook spinners.
import { getStartEndDateOfWeekReturnNumber, DateTypeOfWeek } from "@/app/utils/dateTimeUtils";
import { addDays, endOfWeek, endOfDay } from "date-fns";
import { formatCalendarDates } from "@/app/utils/dateTimeUtils";
import { SECONDS_IN_ONE_DAY } from "@/config";
import PreviousIcon from "@/assets/img/parent-dashboard/back_arrow.svg";
import CalendarIcon from "@/assets/img/parent-dashboard/calendar.svg";
import NextIcon from "@/assets/img/parent-dashboard/forward_arrow.svg";
import { Box, Grid, IconButton, Typography, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import React,
{ useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { fromSecondsToMilliseconds } from "@/utils/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 46,
            display: `flex`,
            flexDirection: `row`,
            alignItems: `center`,
            justifyContent: `space-between`,
            margin: theme.spacing(0, 4),
        },
        calendar:{
            display: `flex`,
            flexDirection: `row`,
        },
        disabled: {
            opacity: 0.3,
        },
        customMarginRight: {
            marginRight: theme.spacing(0.5),
        }
    }));

enum ArrowType{
    PREVIOUS,
    NEXT
}

interface Props {
    onOpenCalendar?: () => void;
    onChangeCalendar: (dateStart: number, dateEnd: number) => void;
    startWeek: number;
    endWeek: number;
}

export function CustomCalendar(props: Props) {
    
    const {
        onOpenCalendar,
        onChangeCalendar,
        startWeek,
        endWeek
    } = props;
    
    const classes = useStyles();
    const intl = useIntl();
    const [ isDisabledGoNext , setIsDisabledGoNext]  = useState<boolean>(false);
    const displayDate: string = formatCalendarDates(fromSecondsToMilliseconds(startWeek), 
    fromSecondsToMilliseconds(endWeek), intl);

    useEffect(() => {
        const endOfCurrentWeek = endOfWeek(new Date(), {weekStartsOn: 1});
        const endNextWeek = endOfDay(addDays(fromSecondsToMilliseconds(endWeek), 7));
        if (endOfCurrentWeek <= endNextWeek) {
            setIsDisabledGoNext(true)
            return;
        }
        setIsDisabledGoNext(false);
    }, [endWeek]);

    const onClickArrowIcon= useCallback((arrowType: ArrowType) => {
        let date: number;
        switch(arrowType){
            case ArrowType.PREVIOUS:
                date = startWeek - SECONDS_IN_ONE_DAY;
                break;
            case ArrowType.NEXT:
                date = endWeek + SECONDS_IN_ONE_DAY;
                break;
        }
        const newDate = fromSecondsToMilliseconds(date);
        onChangeCalendar(
            getStartEndDateOfWeekReturnNumber(newDate, DateTypeOfWeek.START_DATE),
            getStartEndDateOfWeekReturnNumber(newDate, DateTypeOfWeek.END_DATE)
        );
    }, [ endWeek ]);

    return (
        <Box className={classes.root}>
            <IconButton
                aria-label="Previous"
                onClick={() => onClickArrowIcon(ArrowType.PREVIOUS)}
                size="large">
                <img
                    alt="previous icon"
                    src={PreviousIcon}
                />
            </IconButton>
            <Box
                className={classes.calendar}
                onClick={onOpenCalendar}
            >
                <img
                    alt="Calendar icon"
                    src={CalendarIcon}
                    className={classes.customMarginRight}
                />
                <Typography variant="body1">{displayDate}</Typography>
            </Box>
            <IconButton
                disabled={isDisabledGoNext}
                className={clsx({
                    [classes.disabled] : isDisabledGoNext,
                })}
                aria-label="Next"
                onClick={() => onClickArrowIcon(ArrowType.NEXT)}
                size="large">
                <img
                    alt="next icon"
                    src={NextIcon}
                />
            </IconButton>
        </Box>
    );
}
