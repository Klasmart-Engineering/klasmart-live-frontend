import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import Toolbar from "../toolbar/toolbar";
import { Whiteboard } from "../utils/Whiteboard";
import MainDrawer from "./mainDrawer";
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
                            xs>
                            <Whiteboard uniqueId="student" />
                            <MainView />
                        </Grid>
                        <Grid
                            item
                            className={classes.mainViewDrawer}>
                            <MainDrawer />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
            {classtype !== ClassType.STUDY &&
             <Grid item>
                 <Toolbar />
             </Grid>
            }
        </Grid>
    );
}

export default Main;
