import InteractionRecorder from "@/components/interactiveContent/InteractionRecorder";
import { ReplicatedMedia } from "@/components/interactiveContent/synchronized-video";
import { useSessionContext } from "@/providers/session-context";
import {
    materialActiveIndexState,
    observeDisableState,
} from "@/store/layoutAtoms";
import { MaterialTypename } from "@/types/lessonMaterial";
import { useMaterialToHref } from "@/utils/contentUtils";
import { NoItemList } from "@/utils/utils";
import { Book as PlanIcon } from "@styled-icons/boxicons-regular/Book";
import ContainedWhiteboard from "@/whiteboard/components/ContainedWhiteboard";
import { Typography } from "@material-ui/core";
import React,
{ useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useRecoilState } from "recoil";

function PreviewLessonPlan () {
    const { materials } = useSessionContext();
    const [ materialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ , setObserveDisable ] = useRecoilState(observeDisableState);
    const material = materialActiveIndex >= 0 && materialActiveIndex < materials.length ? materials[materialActiveIndex] : undefined;
    const [ contentHref ] = useMaterialToHref(material);
    const intl = useIntl();

    useEffect(() => {
        if (material?.__typename === MaterialTypename.IMAGE) {
            setObserveDisable(false);
        } else if (material?.__typename === MaterialTypename.VIDEO ||
            (material?.__typename === undefined && material?.video)) {
            setObserveDisable(true);
        } else if(material?.__typename === MaterialTypename.AUDIO) {
            setObserveDisable(false);
        } else if (((material?.__typename === MaterialTypename.IFRAME || material?.__typename === undefined) && material?.url)) {
            setObserveDisable(false);
        }
    }, [ material ]);

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

    if (material?.__typename === MaterialTypename.IMAGE) {
        return (
            <InteractionRecorder
                contentHref={contentHref}
            />
        );
    }

    if (material?.__typename === MaterialTypename.VIDEO || (material?.__typename === undefined && material?.video)) {
        return (
            <ContainedWhiteboard>
                <ReplicatedMedia
                    type={material?.__typename || MaterialTypename.VIDEO}
                    src={(material?.__typename === undefined && material?.video) || contentHref}
                    style={{
                        width: `100%`,
                    }}
                />
            </ContainedWhiteboard>
        );
    }

    if (material?.__typename === MaterialTypename.AUDIO) {
        return (
            <ReplicatedMedia
                type={MaterialTypename.AUDIO}
                src={contentHref}
                style={{
                    width: `100%`,
                }}
            />
        );
    }

    if (((material?.__typename === MaterialTypename.IFRAME || material?.__typename === undefined) && material?.url)) {
        return (
            <InteractionRecorder
                contentHref={contentHref}
            />
        );
    }

    return (
        <Typography>
            <FormattedMessage id="loading_activity_error" />
        </Typography>
    );

}

export default PreviewLessonPlan;
