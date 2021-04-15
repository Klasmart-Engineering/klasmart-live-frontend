import { materialActiveIndexState, classInfoState } from "../../../../states/layoutAtoms";
import {
    Step,
    StepLabel,
    Stepper,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";



function Plan () {
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ classInfo, setClassInfo ] = useRecoilState(classInfoState);

    return (
        <Stepper
            style={{
                overflowX: `hidden`,
                overflowY: `auto`,
            }}
            activeStep={materialActiveIndex}
            orientation="vertical"
        >
            {classInfo.materials.map((material, index) => (
                <Step
                    key={`step-${material.name}`}
                    disabled={false}
                    onClick={() => setMaterialActiveIndex(index)}
                >
                    <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}

export default Plan;
