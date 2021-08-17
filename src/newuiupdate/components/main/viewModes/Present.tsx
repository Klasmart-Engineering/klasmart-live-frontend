import ActivityImage from "../../../../components/interactiveContent/image";
import { PreviewPlayer } from "../../../../components/interactiveContent/previewPlayer";
import { RecordedIframe } from "../../../../components/interactiveContent/recordediframe";
import { ReplicaMedia } from "../../../../components/interactiveContent/synchronized-video";
import PreviewLessonPlan from "../../../../components/main/previewLessonPlan";
import { MaterialTypename } from "../../../../lessonMaterialContext";
import { ContentType } from "../../../../pages/utils";
import {
    LIVE_LINK,
    LocalSessionContext,
} from "../../../../providers/providers";
import { RoomContext } from "../../../../providers/roomContext";
import {
    hasControlsState,
    interactiveModeState,
    isLessonPlanOpenState,
    materialActiveIndexState,
    streamIdState,
} from "../../../../store/layoutAtoms";
import { MUTATION_SHOW_CONTENT } from "../../../../utils/graphql";
import { useMutation } from "@apollo/client";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import React,
{
    useContext,
    useEffect,
} from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
}));

function Present () {
    const classes = useStyles();
    const { content } = useContext(RoomContext);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

    // IF TEACHER
    if(hasControls){
        return(<PreviewLessonPlan />);
    }

    if(content && content.type === ContentType.Image){
        return (
            <ActivityImage material={content?.contentId} />
        );
    }

    if(content && content.type === ContentType.Stream){
        return (
            <PreviewPlayer
                streamId={content?.contentId}
                container="activity-view-container"
                width="100%"
                height="100%" />
        );
    }

    if(content && content.type === ContentType.Activity){
        return (
            <RecordedIframe contentId={content?.contentId}  />
        );
    }

    if(content && (content.type === ContentType.Video || content.type === ContentType.Audio)){
        return (
            <ReplicaMedia
                type={content.type}
                sessionId={content.contentId} />
        );
    }

    return(null);
}

export default Present;
