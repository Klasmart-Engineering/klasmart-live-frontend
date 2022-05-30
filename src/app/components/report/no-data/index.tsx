import { THEME_COLOR_BACKGROUND_LIST, TEXT_COLOR_REPORT_NO_DATA } from "@/config";
import { Grid, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CalendarIcon from "@/assets/img/parent-dashboard/calendar.svg";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    noDataText: {
        color: TEXT_COLOR_REPORT_NO_DATA,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
}));

interface Props{
    messageId: string;
}

export default function ReportNoData (props: Props) {
    const classes = useStyles();
    const { messageId } = props;

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            className={classes.root}
        >
            <Grid item>
                <img
                    alt="Calendar icon"
                    src={CalendarIcon}
                    width={30}
                    height={30}
                />
            </Grid>
            <Grid item>
                <Typography className={classes.noDataText}>
                    <FormattedMessage id={messageId} />
                </Typography>
            </Grid>
        </Grid>
    );
}
