import { BG_COLOR_CAMERA } from "@/config";
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
    noCameraBackground: {
        backgroundColor: BG_COLOR_CAMERA,
        position: `absolute`,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: `100%`,
    },
}));

interface NoCameraType {
    name: string;
    variant?: "medium" | "large" | "small";
}

function NoCamera (props: NoCameraType) {
    const { name, variant } = props;

    const classes = useStyles();

    if(!name) return(null);

    return (
        <Grid
            container
            className={classes.noCameraBackground}
            justifyContent="center"
            alignItems="center"
        >
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
