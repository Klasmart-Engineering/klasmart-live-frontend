import { InteractionPlayer } from "@/components/interactiveContent/InteractionPlayer";
import InteractionRecorder from "@/components/interactiveContent/InteractionRecorder";
import { ReplicaMedia } from "@/components/interactiveContent/synchronized-video";
import PreviewLessonPlan from "@/components/main/previewLessonPlan";
import { useContent } from "@/data/live/state/useContent";
import { ContentType } from "@/pages/utils";
import {
    hasControlsState,
    mainActivitySizeState,
} from "@/store/layoutAtoms";
import { useContentToHref } from "@/utils/contentUtils";
import ContainedWhiteboard from "@/whiteboard/components/ContainedWhiteboard";
import React from "react";
import { useRecoilValue } from "recoil";

interface Props {
}

function Present (props: Props) {
    const mainActivitySize = useRecoilValue(mainActivitySizeState);
    const content = useContent();
    const hasControls = useRecoilValue(hasControlsState);
    const [ contentHref ] = useContentToHref(content);

    // IF TEACHER
    if (hasControls) return (
        <PreviewLessonPlan />
    );

    switch (content?.type) {
    case ContentType.Image:
    case ContentType.Stream:
        return (
            <InteractionPlayer
                sizeConstraints={mainActivitySize}
                streamId={content.contentId}
            />
        );
    case ContentType.Activity:
        return (
            <InteractionRecorder contentHref={contentHref} />
        );
    case ContentType.Video:
        return (
            <ContainedWhiteboard>
                <ReplicaMedia
                    type={content.type}
                    sessionId={content.contentId}
                />
            </ContainedWhiteboard>
        );
    case ContentType.Audio:
        return (
            <ReplicaMedia
                type={content.type}
                sessionId={content.contentId}
            />
        );
    default:
        return null;
    }
}

export default Present;
