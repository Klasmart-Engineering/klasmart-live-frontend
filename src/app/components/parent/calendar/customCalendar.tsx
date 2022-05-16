// Inspired by the former Facebook spinners.
import { endOfWeekCal, startOfWeekCal } from "@/app/utils/common";
import { formatCalendarDates } from "@/app/utils/dateTimeUtils";
import PreviousIcon from "@/assets//img/parent-dashboard/back_arrow.svg";
import CalendarIcon from "@/assets//img/parent-dashboard/calendar.svg";
import NextIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
import NextIconDisable from "@/assets//img/parent-dashboard/forward_arrow_disable.svg";
import {
    Grid,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    Theme,
} from "@material-ui/core/styles";
import React,
{ useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 46,
            flexDirection: `row`,
        },
        calendar:{
            display: `flex`,
            flexDirection: `row`,
        },
        arrowLeft: {
            marginLeft: 34,
        },
        arrowRight: {
            marginRight: 34, 
        }
    }));

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
    const [startDate, setStartDate] = useState<number>(0);
    const [endDate, setEndDate] = useState<number>(0);
    const isMaxDateRef = useRef<boolean>(false);

    useEffect(() => {
        setStartDate(startWeek);
        setEndDate(endWeek);
        const now = new Date().getTime();
        if (endWeek*1000 >  now) {
            isMaxDateRef.current = true
        }
    }, [startWeek, endWeek]);

    const onClickedPrevious = useCallback(() => {
        const date: number = startWeek - 24 * 60 * 60;
        formatWeek(date);
    }, [startWeek]);

    const onClickedNext = useCallback(() => {
        if (isMaxDateRef.current) return;
        const date: number = endWeek + 24 * 60 * 60;
        formatWeek(date);       
    }, [endWeek]);


    const formatWeek = (date: number) => {
        const newDate = date * 1000;
        const startWeek = startOfWeekCal(newDate);
        const endWeek = endOfWeekCal(newDate);
        onChangeCalendar(startWeek, endWeek);
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="space-between"
            className={classes.root}
        >
            <Grid
                item
                 className={classes.arrowLeft}
            >
                <IconButton
                    aria-label="Canvas"
                    onClick={onClickedPrevious}
                >
                    <img
                        alt="previous icon"
                        src={PreviousIcon}
                    />
                </IconButton>

            </Grid>
            <Grid
                item
                className={classes.calendar}
                onClick={onOpenCalendar}
            >
                <img
                    alt="previous icon"
                    src={CalendarIcon}
                    style={{
                        marginRight: 5
                    }}
                />
                <Typography variant="body1">{formatCalendarDates(startDate * 1000, endDate * 1000, intl)}</Typography>
            </Grid>
            <Grid
                item
                 className={classes.arrowRight}
            >
                <IconButton
                    aria-label="Canvas"
                    onClick={onClickedNext}
                >
                    <img
                        alt="previous icon"
                        src={isMaxDateRef.current ? NextIconDisable : NextIcon}
                    />
                </IconButton>
            </Grid>
        </Grid>
    );
}
