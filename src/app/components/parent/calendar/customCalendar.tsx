// Inspired by the former Facebook spinners.
import { formatCalendarDates } from "@/app/utils/dateTimeUtils";
import PreviousIcon from "@/assets//img/parent-dashboard/back_arrow.svg";
import CalendarIcon from "@/assets//img/parent-dashboard/calendar.svg";
import NextIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
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
{ useCallback, useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: `100%`,
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

export function CustomCalendar () {
    const classes = useStyles();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const intl = useIntl();
    const [date, setDate] = useState(new Date().getTime());
    
    const onClickedPrevious = useCallback(() => {
        const previousDate = date - sevenDays;
        setDate(previousDate);
    }, [date]);

    const onClickedNext = useCallback(() => {
        const nextDate = date + sevenDays;
        setDate(nextDate);
    }, [date]);

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
            >
                <img
                    alt="previous icon"
                    src={CalendarIcon}
                    style={{
                        marginRight: 5
                    }}
                />
                <Typography variant="body1">{formatCalendarDates(date, intl, sevenDays)}</Typography>
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
                        src={NextIcon}
                    />
                </IconButton>
            </Grid>
        </Grid>
    );
}
