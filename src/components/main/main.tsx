import MainClass from "./mainClass";
import MainDrawer from "./mainDrawer";
import MainView from "./mainView";
import Toolbar from "@/components/toolbar/toolbar";
import { ContentType } from "@/pages/utils";
import { RoomContext } from "@/providers/roomContext";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { Whiteboard } from "@/whiteboard/components/Whiteboard";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useContext } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    fullViewHeight: {
        height: `100%`,
        flexWrap: `nowrap`,
    },
    fullViewHeightXs:{
        height: `90vh`,
        minHeight: 350,
    },
    fullHeightCentered:{
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
    },
    mainViewContainer: {
        display: `flex`,
    },
    mainView: {
        padding: 10,
        overflow: `hidden`,
        display: `flex`,
        flex: 1,
        position: `relative`,
        // height: `calc(100vh - 115px)`,
    },
    mainViewDrawer: {
        position: `relative`,
    },
    relative:{
        position: `relative`,
        height: `100%`,
        overflow: `auto`,
    },
}));

function Main () {
    const classes = useStyles();
    const { classType, isTeacher } = useSessionContext();
    const { content } = useContext(RoomContext);

    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    return (
        <Grid
            container
            direction="column"
            className={clsx(classes.fullViewHeight, {
                [classes.fullViewHeightXs]: isXsDown && classType == ClassType.LIVE,
            })}>
            <Grid
                item
                xs
                className={classes.mainViewContainer}>
                <div className={classes.mainView}>
                    <Grid
                        container
                        id="main-content">
                        <Grid
                            item
                            xs
                            className={classes.relative}
                        >
                            {classType == ClassType.LIVE && <div
                                id="activity-view-container"
                                className={classes.fullHeightCentered}
                            >
                                {content?.type !== ContentType.Activity && <Whiteboard uniqueId={isTeacher ? `global` : `student`} />}
                                <MainView />
                            </div> }
                            {classType == ClassType.STUDY && <MainClass /> }
                            {classType == ClassType.CLASSES && <MainClass /> }
                        </Grid>
                        <Grid
                            item
                            className={classes.mainViewDrawer}>
                            <MainDrawer />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            {classType === ClassType.LIVE &&
             <Grid item>
                 <Toolbar />
             </Grid>
            }
        </Grid>
    );
}

export default Main;
