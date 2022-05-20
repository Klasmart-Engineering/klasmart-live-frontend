// Inspired by the former Facebook spinners.
import { CircularProgress } from "@mui/material";
import { CircularProgressProps } from "@mui/material/CircularProgress";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

const useStylesFacebook = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `relative`,
        },
        bottom: {
            color: theme.palette.grey[theme.palette.mode === `light` ? 200 : 700],
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

export function CustomCircularProgress (props: CircularProgressProps & { value?: number | undefined }) {
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
