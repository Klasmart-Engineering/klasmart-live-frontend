import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { TvFill as ScreenShareIcon } from "@styled-icons/bootstrap/TvFill";
import React from "react";

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

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                <ScreenShareIcon size="4rem" />
                <br/>
				Screenshare
            </Grid>
        </Grid>
    );
}

export default Screenshare;
