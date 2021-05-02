import { MaterialTypename } from "../../../lessonMaterialContext";
import { LocalSessionContext } from "../../providers/providers";
import { materialActiveIndexState } from "../../states/layoutAtoms";
import ActivityImage from "../utils/interactiveContent/image";
import { RecordedIframe } from "../utils/interactiveContent/recordediframe";
import { ReplicatedMedia } from "../utils/interactiveContent/synchronized-video";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}));

function PreviewLessonPlan () {
    const classes = useStyles();
    const {  materials } = useContext(LocalSessionContext);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;

    if(material?.__typename === MaterialTypename.Image){
        return (
            <ActivityImage material={material} />
        );
    }

    if(material?.__typename === MaterialTypename.Video ||
        material?.__typename === MaterialTypename.Audio ||
        (material?.__typename === undefined && material?.video)){
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

    if((material?.__typename === MaterialTypename.Iframe || material?.__typename === undefined) && material?.url){
        return(
            <RecordedIframe
                contentId={material.url}
            />
        );
    }

    if(material?.__typename === MaterialTypename.Video){
        return (
            <>
                Video
            </>
        );
    }

    if(material?.__typename === MaterialTypename.Audio){
        return (
            <>
                Audio
            </>
        );
    }

    if(material?.__typename === MaterialTypename.Iframe){
        return (
            <>
                Iframe
            </>
        );
    }

    return(<div>Error loading materials</div>);

}

export default PreviewLessonPlan;
