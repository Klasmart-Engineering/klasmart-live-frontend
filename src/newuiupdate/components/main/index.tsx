import { activeTabState } from "../../states/layoutAtoms";
import Toolbar from "../toolbar";
import CanvasDrawer from "./canvasDrawer";
import MainDrawer from "./mainDrawer";
import MainView from "./mainView";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";

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
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    if(activeTab !== `participants`){return(null);}

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
                    <Grid container>
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
