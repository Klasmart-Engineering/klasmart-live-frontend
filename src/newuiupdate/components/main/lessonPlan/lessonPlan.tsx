import { materialActiveIndexState } from "../../../states/layoutAtoms";
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
    fullHeight:{
        height: `100%`,
    },
    head:{
        borderBottom: `1px solid lightgrey`,
        padding: `6px 0`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
        overflowY: `scroll`,
    },
    title:{
        fontSize: `1.25rem`,
        fontWeight: 600,
    },
    stepper:{
        backgroundColor: `transparent`,
    },
    step: {
        cursor: `pointer`,
    },
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

function LessonPlan () {
    const classes = useStyles();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                className={classes.head}>
                <Typography className={classes.title}>Lesson Plan</Typography>
            </Grid>
            <Grid
                item
                xs
                className={classes.container}>
                <Stepper
                    style={{
                        overflowX: `hidden`,
                        overflowY: `auto`,
                    }}
                    activeStep={materialActiveIndex}
                    orientation="vertical"
                    classes={{
                        root: classes.stepper,
                    }}
                >
                    {materials.map((material, index) => (
                        <Step
                            key={`step-${material.name}`}
                            disabled={false}
                            className={classes.step}
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

export default LessonPlan;
