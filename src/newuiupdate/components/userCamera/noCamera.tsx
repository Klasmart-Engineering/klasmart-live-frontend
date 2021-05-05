import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { UserAvatar } from "kidsloop-px";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    avatar: {
        pointerEvents: `none`,
    },
}));

interface NoCameraType {
    name: string;
    variant?: "medium" | "large" | "small";
}

function NoCamera (props: NoCameraType) {
    const { name, variant } = props;

    const classes = useStyles();

    return (
        <Grid
            container
            justify="center">
            <Grid item>
                <UserAvatar
                    name={name}
                    className={classes.avatar}
                    size={variant || `medium`}
                    maxInitialsLength={2}
                />
            </Grid>
        </Grid>
    );
}

export default NoCamera;
