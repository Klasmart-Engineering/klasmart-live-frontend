import MainClass from "@/components/main/mainClass";
import MainDrawer from "@/components/main/mainDrawer";
import MainView from "@/components/main/mainView";
import Toolbar from "@/components/toolbar/toolbar";
import { THEME_COLOR_GREY_200 } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { mainActivitySizeState } from "@/store/layoutAtoms";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useEffect } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: `100%`,
    },
    contentContainer: {
        margin: theme.spacing(1, 1, 0, 1),
        overflowY: `auto`,
    },
    activityContainer: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    activityContainerStudy: {
        padding: theme.spacing(1, 2, 2, 2),
        boxSizing: `border-box`,
    },
    activityContainerLive: {
        backgroundColor: THEME_COLOR_GREY_200,
        borderRadius: theme.spacing(1.5),
    },
}));

function Main () {
    const classes = useStyles();
    const { classType } = useSessionContext();
    const setMainActivitySize = useSetRecoilState(mainActivitySizeState);
    const {
        ref: containerRef,
        height: containerHeight = 0,
        width: containerWidth = 0,
    } = useResizeDetector();

    useEffect(() => {
        setMainActivitySize({
            height: containerHeight,
            width: containerWidth,
        });
    }, [ containerWidth, containerHeight ]);

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}
        >
            <Grid
                item
                xs
                className={classes.contentContainer}
                id="main-content"
            >
                <Grid
                    container
                    className={classes.fullHeight}
                >
                    <Grid
                        item
                        xs
                    >
                        <div
                            ref={containerRef}
                            className={clsx(classes.activityContainer, classes.fullHeight, {
                                [classes.activityContainerStudy]: classType === ClassType.STUDY || classType === ClassType.CLASSES,
                                [classes.activityContainerLive]: classType === ClassType.LIVE,
                            })}
                        >
                            {classType === ClassType.LIVE ? <MainView /> : <MainClass />}
                        </div>
                    </Grid>
                    <Grid item>
                        <MainDrawer />
                    </Grid>
                </Grid>
            </Grid>
            {classType === ClassType.LIVE && (
                <Grid item>
                    <Toolbar />
                </Grid>
            )}
        </Grid>

    );
}

export default Main;
