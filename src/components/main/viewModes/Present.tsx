import ActivityImage from "@/components/interactiveContent/image";
import { PreviewPlayer } from "@/components/interactiveContent/previewPlayer";
import { RecordedIframe } from "@/components/interactiveContent/recordediframe";
import { ReplicaMedia } from "@/components/interactiveContent/synchronized-video";
import PreviewLessonPlan from "@/components/main/previewLessonPlan";
import { ContentType } from "@/pages/utils";
import { RoomContext } from "@/providers/roomContext";
import { hasControlsState } from "@/store/layoutAtoms";
import { useContentToHref } from "@/utils/contentUtils";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

function Present () {
    const { content } = useContext(RoomContext);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ contentHref ] = useContentToHref(content);

    // IF TEACHER
    if(hasControls){
        return(<PreviewLessonPlan />);
    }

    if(content && content.type === ContentType.Image){
        return (
            <ActivityImage material={contentHref} />
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
            <RecordedIframe contentHref={contentHref}  />
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
