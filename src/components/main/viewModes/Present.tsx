import { InteractionPlayer } from "@/components/interactiveContent/InteractionPlayer";
import InteractionRecorder from "@/components/interactiveContent/InteractionRecorder";
import { ReplicaMedia } from "@/components/interactiveContent/synchronized-video";
import PreviewLessonPlan from "@/components/main/previewLessonPlan";
import { useContent } from "@/data/live/state/useContent";
import { ContentType } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    hasControlsState,
    mainActivitySizeState,
} from "@/store/layoutAtoms";
import { useContentToHref } from "@/utils/contentUtils";
import { NoItemList } from "@/utils/utils";
import ContainedWhiteboard from "@/whiteboard/components/ContainedWhiteboard";
import { Book as PlanIcon } from "@styled-icons/boxicons-regular/Book";
import React from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

interface Props {
}

function Present (props: Props) {
    const mainActivitySize = useRecoilValue(mainActivitySizeState);
    const content = useContent();
    const hasControls = useRecoilValue(hasControlsState);
    const [ contentHref ] = useContentToHref(content);
    const { materials } = useSessionContext();
    const intl = useIntl();

    // IF TEACHER
    if (hasControls) return (
        <PreviewLessonPlan />
    );

    if( !materials.length ){
        return(
            <NoItemList
                icon={<PlanIcon />}
                text={intl.formatMessage({
                    id: `lessonplan_content_noresults`,
                })}
            />
        );
    }

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
