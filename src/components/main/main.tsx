import GlobalMuteOverlay from '../globalMuteOverlay';
import MainStudy from "./mainStudy";
import MainClass from "@/components/main/mainClass";
import MainView from "@/components/main/mainView";
import Toolbar from "@/components/toolbar/toolbar";
import { THEME_COLOR_GREY_200 } from "@/config";
import { useSessions } from "@/data/live/state/useSessions";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { mainActivitySizeState } from "@/store/layoutAtoms";
import {
    useCamera,
    useMicrophone,
} from '@kl-engineering/live-state/ui';
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
        position: `relative`,
    },
    activityContainerLive: {
        backgroundColor: THEME_COLOR_GREY_200,
        borderRadius: theme.spacing(1.5),
        position: `relative`,
    },
    globalMuteOverlayContainer: {
        alignItems: `center`,
        display: `flex`,
        justifyContent: `space-evenly`,
        position: `absolute`,
        height: `100%`,
        width: `100%`,
        pointerEvents: `none`,
    },
}));

function Main () {
    const classes = useStyles();
    const { sessionId, classType } = useSessionContext();
    const setMainActivitySize = useSetRecoilState(mainActivitySizeState);
    const sessions = useSessions();
    const localSession = sessions.get(sessionId);

    const camera = useCamera();
    const microphone = useMicrophone();

    const isCameraPausedGlobally = camera.isPausedGlobally;
    const isMicrophonePausedGlobally = microphone.isPausedGlobally;

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

    const renderContent = () => {
        switch(classType){
        case(ClassType.LIVE): return (
            <>
                <MainView />
                {!localSession?.isHost && (
                    <div className={classes.globalMuteOverlayContainer}>
                        <GlobalMuteOverlay
                            isCameraPausedGlobally={isCameraPausedGlobally}
                            isMicrophonePausedGlobally={isMicrophonePausedGlobally}
                        />
                    </div>
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
            {classType === ClassType.LIVE && (
                <Grid item>
                    <Toolbar />
                </Grid>
            )}
        </Grid>

    );
}

export default Main;
