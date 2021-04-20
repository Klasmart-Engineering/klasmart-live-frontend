import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function Present () {
    const classes = useStyles();

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                <PresentIcon size="4rem" />
                <br/>
				PRESENT
            </Grid>
        </Grid>
    );
}

export default Present;
