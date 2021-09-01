// Inspired by the former Facebook spinners.
import {
    CircularProgress,
    makeStyles,
} from "@material-ui/core";
import { CircularProgressProps } from "@material-ui/core/CircularProgress";
import {
    createStyles,
    Theme,
} from "@material-ui/core/styles";
import React from "react";

const useStylesFacebook = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `relative`,
        },
        bottom: {
            color: theme.palette.grey[theme.palette.type === `light` ? 200 : 700],
        },
        top: {
            color: `#1a90ff`,
            animationDuration: `550ms`,
            position: `absolute`,
            left: 0,
        },
        circle: {
            strokeLinecap: `round`,
        },
    }));

export function CustomCircularProgress (props: CircularProgressProps & { value? : number | undefined }) {
    const classes = useStylesFacebook();

    return (
        <div className={classes.root}>
            <CircularProgress
                variant="determinate"
                className={classes.bottom}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                disableShrink
                variant={props.value && props.value < 100 ? `determinate` : `indeterminate`}
                className={classes.top}
                classes={{
                    circle: classes.circle,
                }}
                {...props}
            />
        </div>
    );
}
