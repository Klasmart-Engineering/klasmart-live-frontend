import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { MyCamera, Cameras } from "../webRTCState";

const drawerWidth = 340;

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            height: drawerWidth,
            width: drawerWidth,
            padding: 4,
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
                <Cameras />
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