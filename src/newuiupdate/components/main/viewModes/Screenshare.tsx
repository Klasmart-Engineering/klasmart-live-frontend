import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { TvFill as ScreenShareIcon } from "@styled-icons/bootstrap/TvFill";
import React, { useContext } from "react";
import { Stream } from "../../../../webRTCState";
import { ScreenShareContext } from "../../../providers/screenShareProvider";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        border: `5px solid gren`,
    },
}));

function Screenshare () {
    const classes = useStyles();
    const screenShare = useContext(ScreenShareContext);

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                <Stream stream={screenShare.stream} />
            </Grid>
        </Grid>
    );
}

export default Screenshare;
