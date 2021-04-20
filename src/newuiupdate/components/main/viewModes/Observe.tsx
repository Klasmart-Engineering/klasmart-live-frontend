import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function Observe () {
    const classes = useStyles();

    return (
        <Grid
            container
            className={classes.root}>
            <Grid item>
                <ObserveIcon size="4rem" />
                <br/>
				OBSERVE
            </Grid>
        </Grid>
    );
}

export default Observe;
