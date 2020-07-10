import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { MyCamera, Cameras } from "../webRTCState";
import Typography from "@material-ui/core/Typography";

const drawerWidth = 340;
const cameraHeight = 240;

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            height: cameraHeight,
            width: drawerWidth,
            flex: "none",
        },
    }),
);

interface Props {
    isTeacher: boolean
}

export default function CameraContainer(props: Props): JSX.Element {
    const { isTeacher } = props;
    const classes = useStyles();

    return (<>
        {isTeacher ? <>
            <Grid className={classes.container} container direction="column" item xs={12}>
                <MyCamera />
            </Grid>
            <Divider />
            <Grid className={classes.container} container direction="column" item xs={12}>
                <Typography align="center">
                    Student Info coming soon!
                </Typography>
            </Grid>
        </> : <>
            <Grid className={classes.container} container direction="column" item xs={12}>
                <Cameras />
            </Grid>
            <Divider />
            <Grid className={classes.container} container direction="column" item xs={12}>
                <MyCamera />
            </Grid>
        </>}
        <Divider />
    </>)
}