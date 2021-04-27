import { LocalSessionContext } from "../../../../providers/providers";
import { materialActiveIndexState } from "../../../../states/layoutAtoms";
import {
    Grid,
    makeStyles,
    Step,
    StepLabel,
    Stepper,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    root:{
        overflowY: `scroll`,
    },
    container:{
        overflowY: `scroll`,
    },
}));

function Plan () {
    const classes = useStyles();
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);

    const { materials } = useContext(LocalSessionContext);

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs
                className={classes.container}>
                <Stepper
                    activeStep={materialActiveIndex}
                    orientation="vertical"
                >
                    {materials.map((material, index) => (
                        <Step
                            key={`step-${material.name}-${index}`}
                            disabled={false}
                            onClick={() => setMaterialActiveIndex(index)}
                        >
                            <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Grid>
        </Grid>
    );
}

export default Plan;
