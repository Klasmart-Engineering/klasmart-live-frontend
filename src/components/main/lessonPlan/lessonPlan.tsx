import Plan from "./plan/plan";
import {
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: `100%`,
        padding: theme.spacing(0.5),
    },
    title: {
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
    },
    divider: {
        height: 1,
    },
    lessonPlanContainer: {
        maxWidth: 300,
        [theme.breakpoints.up(`lg`)]: {
            maxHeight: 200,
            overflowY: `auto`,
        },
    },
}));

function LessonPlan () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}
        >
            <Grid item>
                <Typography className={classes.title}>
                    <FormattedMessage id="toolbar_lesson_plan" />
                </Typography>
            </Grid>
            <Divider
                flexItem
                className={classes.divider}
                orientation="horizontal"
            />
            <Grid
                item
                xs
            >
                <div className={classes.lessonPlanContainer}>
                    <Plan />
                </div>
            </Grid>
        </Grid>
    );
}

export default LessonPlan;
