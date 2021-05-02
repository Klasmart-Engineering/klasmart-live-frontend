import { MaterialTypename } from "../../../../lessonMaterialContext";
import { ContentType } from "../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import {
    hasControlsState, interactiveModeState,
    materialActiveIndexState, streamIdState,
} from "../../../states/layoutAtoms";
import { MUT_SHOW_CONTENT } from "../../utils/graphql";
import { PreviewPlayer } from "../../utils/interactiveContent/previewPlayer";
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

    const {
        materials, roomId, sessionId,
    } = useContext(LocalSessionContext);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUT_SHOW_CONTENT, {
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
        roomId,
        interactiveMode,
        material,
        streamId,
        sessionId,
    ]);

    if(hasControls){
        return(<PreviewLessonPlan />);
    }

    if(content){
        return (
            <PreviewPlayer
                streamId={content?.contentId}
                width="100%"
                height="100%" />
        );
    }

    return(null);
}

export default Present;
