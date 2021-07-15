import { LocalSessionContext } from "../../../../providers/providers";
import { materialActiveIndexState } from "../../../../states/layoutAtoms";
import { MaterialTypename } from "../../../../../lessonMaterialContext";
import { NoItemList } from "../../../utils/utils";
import { RoomContext } from "../../../../providers/roomContext";
import { ContentType } from "../../../../../pages/room/room";
import {
    Grid,
    makeStyles,
    Step,
    StepLabel,
    Stepper,
    Theme,
} from "@material-ui/core";
import { Book as PlanIcon } from "@styled-icons/boxicons-regular/Book";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        overflowY: `scroll`,
        minHeight: 300,
        minWidth: 300,
    },
    stepDisabled: {
        pointerEvents: `none`,
        opacity: `0.3`,
    }
}));

function Plan () {
    const classes = useStyles();
    const intl = useIntl();
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const { materials } = useContext(LocalSessionContext);
    const { content } = useContext(RoomContext);

    const checkDisable = (material:any) => {
        if (content?.type === ContentType.Activity && material.__typename !== MaterialTypename.Iframe) return true;
        else return false;
    }

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs
                className={classes.container}>
                {materials.length === 0 ? (
                    <NoItemList
                        icon={<PlanIcon />}
                        text={intl.formatMessage({
                            id: `lessonplan_content_noresults`,
                        })} />
                ) : (
                    <Stepper
                        activeStep={materialActiveIndex}
                        orientation="vertical"
                    >
                        {materials.map((material, index) => (
                            <Step
                                className={ checkDisable(material) ? classes.stepDisabled : ``}
                                key={`step-${material.name}-${index}`}
                                disabled={ checkDisable(material) }
                                onClick={() => setMaterialActiveIndex(index)}
                            >
                                <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                ) }

            </Grid>
        </Grid>
    );
}

export default Plan;
