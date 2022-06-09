import MainStudy from "./mainStudy";
import GlobalMuteProvider from '@/components/globalMuteProvider';
import MainClass from "@/components/main/mainClass";
import MainView from "@/components/main/mainView";
import Toolbar from "@/components/toolbar/toolbar";
import { THEME_COLOR_GREY_200 } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { mainActivitySizeState } from "@/store/layoutAtoms";
import {
    Grid,
    Theme,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React,
{ useEffect } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: `100%`,
        [theme.breakpoints.down(`xs`)]: {
            flex: `1 1 40%`,
        },
    },
    contentContainer: {
        margin: theme.spacing(1, 1, 0, 1),
        overflowY: `hidden`,
        [theme.breakpoints.down(`xs`)]: {
            margin: 0,
        },
    },
    activityContainer: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        position: `relative`,
    },
    activityContainerLive: {
        backgroundColor: THEME_COLOR_GREY_200,
        borderRadius: theme.spacing(1.5),
        position: `relative`,
    },
}));

function Main () {
    const classes = useStyles();
    const {
        classType,
        type,
    } = useSessionContext();
    const setMainActivitySize = useSetRecoilState(mainActivitySizeState);

    const {
        ref: containerRef,
        height: containerHeight = 0,
        width: containerWidth = 0,
    } = useResizeDetector();

    const theme = useTheme();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    useEffect(() => {
        setMainActivitySize({
            height: containerHeight,
            width: containerWidth,
        });
    }, [ containerWidth, containerHeight ]);

    const renderContent = () => {
        switch(classType){
        case(ClassType.LIVE): return (
            <>
                <MainView />
                {type !== ClassType.PREVIEW && (
                    <GlobalMuteProvider />
                )}
            </>
        );
        case(ClassType.STUDY): return <MainStudy />;
        case(ClassType.CLASSES): return <MainClass />;
        }
    };

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}
        >
            <Grid
                item
                xs
                className={clsx({
                    [classes.contentContainer]: classType === ClassType.LIVE,
                })}
                id="main-content"
            >
                <div
                    ref={containerRef}
                    className={clsx(classes.activityContainer, classes.fullHeight)}
                >
                    {renderContent()}
                </div>
            </Grid>
            {classType === ClassType.LIVE && !isXsDown && (
                <Grid item>
                    <Toolbar />
                </Grid>
            )}
        </Grid>

    );
}

export default Main;
