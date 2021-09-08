import { ContentType } from "@/pages/utils";
import { RoomContext } from "@/providers/roomContext";
import { hasControlsState } from "@/store/layoutAtoms";
import ActivityImage from "@/interactiveContent/image";
import { PreviewPlayer } from "@/interactiveContent/previewPlayer";
import { RecordedIframe } from "@/interactiveContent/recordediframe";
import { ReplicaMedia } from "@/interactiveContent/synchronized-video";
import PreviewLessonPlan from "@/previewLessonPlan";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

function Present () {
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
