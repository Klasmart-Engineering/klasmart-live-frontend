import { MaterialTypename } from "../../../lessonMaterialContext";
import { LocalSessionContext } from "../../providers/providers";
import {
    materialActiveIndexState,
    observeDisableState,
    studyRecommandUrlState,
} from "../../states/layoutAtoms";
import ActivityImage from "../utils/interactiveContent/image";
import { RecordedIframe } from "../utils/interactiveContent/recordediframe";
import { ReplicatedMedia } from "../utils/interactiveContent/synchronized-video";
import {
    Typography,
} from "@material-ui/core";
import React,
{ useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

function PreviewLessonPlan () {
    const {  materials } = useContext(LocalSessionContext);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ studyRecommandUrl, setStudyRecommandUrl ] = useRecoilState(studyRecommandUrlState);
    const [ observeDisable, setObserveDisable ] = useRecoilState(observeDisableState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;

    // If recommanded content in study mode
    if(materialActiveIndex === materials.length && studyRecommandUrl){
        return(
            <RecordedIframe
                contentId={studyRecommandUrl}
            />
        );
    }

    if(material?.__typename === MaterialTypename.Image){
        setObserveDisable(false);
        return (
            <ActivityImage material={material.url} />
        );
    }

    if(material?.__typename === MaterialTypename.Video ||
        material?.__typename === MaterialTypename.Audio ||
        (material?.__typename === undefined && material?.video)){
        setObserveDisable(true);
        return(
            <ReplicatedMedia
                type={material?.__typename || MaterialTypename.Video}
                src={(material?.__typename === undefined && material?.video) || material?.url}
                style={{
                    width: `100%`,
                }}
            />
        );
    }

    if(material?.__typename === MaterialTypename.Audio) {
        setObserveDisable(false);
    }

    if(((material?.__typename === MaterialTypename.Iframe || material?.__typename === undefined) && material?.url)){
        setObserveDisable(false);
        return(
            <RecordedIframe
                contentId={material.url}
            />
        );
    }

    return(<Typography><FormattedMessage id="loading_activity_error" /></Typography>);

}

export default PreviewLessonPlan;
