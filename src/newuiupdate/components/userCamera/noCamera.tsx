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
}

function NoCamera (props: NoCameraType) {
    const { name } = props;

    const classes = useStyles();

    return (
        <Grid
            container
            justify="center">
            <Grid item>
                <UserAvatar
                    name={name}
                    className={classes.avatar}
                    size="medium"
                    maxInitialsLength={2}
                />
            </Grid>
        </Grid>
    );
}

export default NoCamera;
