import { ContentType } from "../../../pages/room/room";
import { RoomContext } from "../../providers/roomContext";
import { ScreenShareContext } from "../../providers/screenShareProvider";
import { WebRTCContext } from "../../providers/WebRTCContext";
import {
    hasControlsState,
    isLessonPlanOpenState,
    isViewModesOpenState,
} from "../../states/layoutAtoms";
import PreviewLessonPlan from "./previewLessonPlan";
import Observe from "./viewModes/Observe";
import OnStage from "./viewModes/onStage";
import Present from "./viewModes/Present";
import Screenshare from "./viewModes/Screenshare";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React,
{
    useContext,
    useEffect,
} from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 12,
        height: `100%`,
        position: `relative`,
        overflow: `hidden`,
    },
    fullHeight:{
        height: `100%`,
    },
    fullHeightCentered:{
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function MainView () {
    const classes = useStyles();
    const { content } = useContext(RoomContext);
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(WebRTCContext);

    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const activeScreenshare = screenShare.stream || content && webrtc.getAuxStream(content.contentId);
    const activePresent = content?.type === ContentType.Stream || content?.type === ContentType.Video || content?.type === ContentType.Audio || content?.type === ContentType.Image;

    // SCREENSHARE VIEW
    // TEACHER and STUDENTS : Host Screen
    if(content?.type === ContentType.Screen && activeScreenshare){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs
                    className={classes.fullHeight}
                    id="main-container"
                >
                    <Screenshare />
                </Grid>
            </Grid>
        );
    }

    // PRESENT VIEW
    // HOST : Present activity
    // STUDENTS : See activity screen from Host
    if(activePresent){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs
                    className={classes.fullHeightCentered}
                >
                    <Present />
                </Grid>
            </Grid>
        );
    }

    // TEACHER : Observe student doing activities
    // STUDENTS : Interactive activity
    if(content?.type === ContentType.Activity){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs
                    className={classes.fullHeightCentered}
                >
                    <Observe />
                </Grid>
            </Grid>
        );
    }

    // DEFAULT VIEW (OnStage)
    // TEACHER and STUDENTS : Host camera

    if((content?.type === ContentType.Camera || content?.type === ContentType.Blank) && isLessonPlanOpen){
        return(
            <Grid
                container
                className={classes.root}
                alignItems="center"
                justifyContent="center"
            >
                <Grid
                    item
                    xs
                    className={classes.fullHeightCentered}
                >
                    <PreviewLessonPlan />
                </Grid>
            </Grid>
        );
    }

    return(
        <Grid
            container
            className={classes.root}>
            <Grid
                item
                xs
                className={classes.fullHeight}
            >
                <OnStage />
            </Grid>
        </Grid>
    );
}

export default MainView;
