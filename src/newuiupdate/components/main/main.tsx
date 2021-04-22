import Toolbar from "../toolbar/toolbar";
import MainDrawer from "./mainDrawer";
import MainView from "./mainView";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {},
    mainViewContainer: {
        display: `flex`,
    },
    mainView: {
        padding: 10,
        overflow: `hidden`,
        display: `flex`,
        flex: 1,
    },
    mainViewDrawer: {
        position: `relative`,
    },
}));

function Main () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            style={{
                height: `100vh`,
            }}>
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
            <Grid item>
                <Toolbar />
            </Grid>
        </Grid>
    );
}

export default Main;
