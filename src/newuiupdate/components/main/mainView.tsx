import { ContentType } from "../../../pages/room/room";
import { RoomContext } from "../../providers/roomContext";
import { ScreenShareContext } from "../../providers/screenShareProvider";
import { WebRTCContext } from "../../providers/WebRTCContext";
import { isLessonPlanOpenState, pinnedUserState } from "../../states/layoutAtoms";
import { Whiteboard } from "../utils/Whiteboard";
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
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.grey[200],
        borderRadius: 12,
        height: `100%`,
        position: `relative`,
        overflow: `hidden`,
    },
    fullHeight:{
        height: `100%`,
    },
}));

function MainView () {
    const classes = useStyles();
    const { content } = useContext(RoomContext);
    const screenShare = useContext(ScreenShareContext);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const webrtc = useContext(WebRTCContext);
    const activeScreenshare = screenShare.stream || content && webrtc.getAuxStream(content.contentId);

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
                    <Whiteboard uniqueId="student" />
                    <Screenshare />
                </Grid>
            </Grid>
        );
    }

    // PRESENT VIEW
    // HOST : Present activity
    // STUDENTS : See activity screen from Host
    if(content?.type === ContentType.Stream){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    xs
                    className={classes.fullHeight}
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
                    className={classes.fullHeight}
                >
                    <Observe />
                </Grid>
            </Grid>
        );
    }

    // DEFAULT VIEW (OnStage)
    // TEACHER and STUDENTS : Host camera

    if((content?.type === ContentType.Camera) && isLessonPlanOpen){
        return(
            <Grid
                container
                className={classes.root}
                alignItems="center"
                justify="center"
            >
                <Grid
                    item
                    xs
                    className={classes.fullHeight}
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
