import { MaterialTypename } from "../../../../lessonMaterialContext";
import { ContentType } from "../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import {
    hasControlsState, interactiveModeState,
    isLessonPlanOpenState,
    materialActiveIndexState, streamIdState,
} from "../../../states/layoutAtoms";
import { MUTATION_SHOW_CONTENT } from "../../utils/graphql";
import ActivityImage from "../../utils/interactiveContent/image";
import { PreviewPlayer } from "../../utils/interactiveContent/previewPlayer";
import { RecordedIframe } from "../../utils/interactiveContent/recordediframe";
import { ReplicaMedia } from "../../utils/interactiveContent/synchronized-video";
import PreviewLessonPlan from "../previewLessonPlan";
import { useMutation } from "@apollo/client";
import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import React, { useContext, useEffect } from "react";
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
    const { content, sessions } = useContext(RoomContext);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ streamId, setStreamId ] = useRecoilState(streamIdState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);

    const {
        materials, roomId, sessionId,
    } = useContext(LocalSessionContext);

    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUTATION_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        if (material) {
            if (material.__typename === MaterialTypename.Video || (material.__typename === undefined && material.video)) {
                showContent({
                    variables: {
                        roomId,
                        type: ContentType.Video,
                        contentId: sessionId,
                    },
                });
            } else if (material.__typename === MaterialTypename.Audio) {
                showContent({
                    variables: {
                        roomId,
                        type: ContentType.Audio,
                        contentId: sessionId,
                    },
                });
            } else if (material.__typename === MaterialTypename.Image) {
                showContent({
                    variables: {
                        roomId,
                        type: ContentType.Image,
                        contentId: material.url,
                    },
                });
            } else if ((material.__typename === MaterialTypename.Iframe || (material.__typename === undefined && material.url)) && streamId) {
                showContent({
                    variables: {
                        roomId,
                        type: ContentType.Stream,
                        contentId: streamId,
                    },
                });
            }
        }
    }, [
        // roomId,
        interactiveMode,
        material,
        streamId,
        // sessionId,
    ]);

    useEffect(() => {
        setMaterialActiveIndex(0);
    }, []);

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
