import ActivityImage from "@/components/interactiveContent/image";
import { RecordedIframe } from "@/components/interactiveContent/recordediframe";
import { ReplicatedMedia } from "@/components/interactiveContent/synchronized-video";
import { useSessionContext } from "@/providers/session-context";
import {
    materialActiveIndexState,
    observeDisableState,
    studyRecommandUrlState,
} from "@/store/layoutAtoms";
import { MaterialTypename } from "@/types/lessonMaterial";
import { useMaterialToHref } from "@/utils/contentUtils";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

function PreviewLessonPlan () {
    const {  materials } = useSessionContext();
    const [ materialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ studyRecommandUrl ] = useRecoilState(studyRecommandUrlState);
    const [ , setObserveDisable ] = useRecoilState(observeDisableState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;
    const [ contentHref ] = useMaterialToHref(material);

    // If recommanded content in study mode
    if(materialActiveIndex === materials.length && studyRecommandUrl){
        return(
            <RecordedIframe
                contentHref={studyRecommandUrl}
            />
        );
    }

    if(material?.__typename === MaterialTypename.IMAGE){
        setObserveDisable(false);
        return (
            <ActivityImage material={contentHref} />
        );
    }

    if(material?.__typename === MaterialTypename.VIDEO ||
        (material?.__typename === undefined && material?.video)){
        setObserveDisable(true);
        return(
            <ReplicatedMedia
                type={material?.__typename || MaterialTypename.VIDEO}
                src={(material?.__typename === undefined && material?.video) || contentHref}
                style={{
                    width: `100%`,
                }}
            />
        );
    }

    if(material?.__typename === MaterialTypename.AUDIO) {
        setObserveDisable(false);
    }

    if(((material?.__typename === MaterialTypename.IFRAME || material?.__typename === undefined) && material?.url)){
        setObserveDisable(false);
        return(
            <RecordedIframe
                contentHref={contentHref}
            />
        );
    }

    return(<Typography><FormattedMessage id="loading_activity_error" /></Typography>);

}

export default PreviewLessonPlan;
