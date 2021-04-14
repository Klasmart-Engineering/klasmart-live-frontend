import { materialActiveIndexState } from "../../../../states/layoutAtoms";
import {
    Grid,
    makeStyles,
    Step,
    StepLabel,
    Stepper,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
}));

const materials = [
    {
        id: `1`,
        name: `Step 1 Colors`,
    },
    {
        id: `2`,
        name: `Step 2 Animals`,
    },
    {
        id: `3`,
        name: `Step 3 Scientology`,
    },
];

function Plan () {
    const classes = useStyles();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);

    return (
        <Stepper
            style={{
                overflowX: `hidden`,
                overflowY: `auto`,
            }}
            activeStep={materialActiveIndex}
            orientation="vertical"
        >
            {materials.map((material, index) => (
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
