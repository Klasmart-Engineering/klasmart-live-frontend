import { useContent } from "@/data/live/state/useContent";
import { ContentType } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { materialActiveIndexState } from "@/store/layoutAtoms";
import { MaterialTypename } from "@/types/lessonMaterial";
import { NoItemList } from "@/utils/utils";
import {
    makeStyles,
    Step,
    StepButton,
    StepLabel,
    Stepper,
    Theme,
} from "@material-ui/core";
import { Book as PlanIcon } from "@styled-icons/boxicons-regular/Book";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight: {
        height: `100%`,
    },
    active: {
        backgroundColor: `rgb(0 0 0 / 10%)`,
    },
}));

function Plan () {
    const classes = useStyles();
    const intl = useIntl();
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const { materials } = useSessionContext();
    const content = useContent();

    const checkDisable = (material: any) => {
        if (content?.type === ContentType.Activity && material.__typename === MaterialTypename.VIDEO) return true;
        else return false;
    };

    return (
        <div className={classes.fullHeight}>
            {materials.length === 0 ? (
                <NoItemList
                    icon={<PlanIcon />}
                    text={intl.formatMessage({
                        id: `lessonplan_content_noresults`,
                    })}
                />
            ) : (
                <Stepper
                    activeStep={materialActiveIndex}
                    orientation="vertical"
                >
                    {materials.map((material, index) => (
                        <Step
                            key={`step-${material.name}-${index}`}
                            className={clsx({
                                [classes.active]: materialActiveIndex === index,
                            })}
                        >
                            <StepButton
                                disabled={checkDisable(material)}
                                onClick={() => setMaterialActiveIndex(index)}
                            >
                                <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            )}
        </div>
    );
}

export default Plan;
