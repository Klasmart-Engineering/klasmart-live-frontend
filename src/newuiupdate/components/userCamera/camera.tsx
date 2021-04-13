import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

interface CameraType {
    user: any;
}

function Camera (props: CameraType) {
    const { user } = props;

    const classes = useStyles();

    return (
        <Grid container>
            <Grid
                item
                xs>
                SHOW CAMERA OF USER
            </Grid>
        </Grid>
    );
}

export default Camera;
