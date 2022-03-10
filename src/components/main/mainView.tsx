import PreviewLessonPlan from "./previewLessonPlan";
import Observe from "./viewModes/Observe";
import OnStage from "./viewModes/onStage";
import Present from "./viewModes/Present";
import Screenshare from "./viewModes/Screenshare";
import { useContent } from "@/data/live/state/useContent";
import { ContentType } from "@/pages/utils";
import { isLessonPlanOpenState } from "@/store/layoutAtoms";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({}));

interface Props {
}

function MainView (props: Props) {
    const classes = useStyles();
    const content = useContent();

    const isLessonPlanOpen = useRecoilValue(isLessonPlanOpenState);

    const activePresent = content?.type === ContentType.Stream || content?.type === ContentType.Video || content?.type === ContentType.Audio || content?.type === ContentType.Image;

    // SCREENSHARE VIEW
    // TEACHER and STUDENTS : Host Screen
    if (content?.type === ContentType.Screen) return (
        <Screenshare sessionId={content.contentId}/>
    );

    // PRESENT VIEW
    // HOST : Present activity
    // STUDENTS : See activity screen from Host
    if (activePresent) return (
        <Present />
    );

    // TEACHER : Observe student doing activities
    // STUDENTS : Interactive activity
    if (content?.type === ContentType.Activity) return (
        <Observe />
    );

    // DEFAULT VIEW (OnStage)
    // TEACHER and STUDENTS : Host camera

    if ((content?.type === ContentType.Camera || content?.type === ContentType.Blank) && isLessonPlanOpen) return (
        <PreviewLessonPlan />
    );

    return (
        <OnStage />
    );
}

export default MainView;
