import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import Toolbar from "../toolbar/toolbar";
import MainClass from "./mainClass";
import MainDrawer from "./mainDrawer";
import MainLive from "./mainLive";
import MainStudy from "./mainStudy";
import MainView from "./mainView";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    fullViewHeight: {
        height: `100vh`,
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
    },
    mainViewDrawer: {
        position: `relative`,
    },
    relative:{
        position: `relative`,
    },
}));

function Main () {
    const classes = useStyles();
    const { classtype } = useContext(LocalSessionContext);

    return (
        <Grid
            container
            direction="column"
            className={classes.fullViewHeight}>
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
                            className={classes.relative}>
                            {/* <MainView /> */}
                            <Whiteboard uniqueId="student" />
                            {classtype == ClassType.LIVE &&  <MainView /> }
                            {classtype == ClassType.STUDY &&  <MainStudy /> }
                            {classtype == ClassType.CLASSES &&  <MainClass /> }
                        </Grid>
                        <Grid
                            item
                            className={classes.mainViewDrawer}>
                            <MainDrawer />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            {classtype === ClassType.LIVE &&
             <Grid item>
                 <Toolbar />
             </Grid>
            }
        </Grid>
    );
}

export default Main;
