import { isLessonPlanOpenState } from "../../../../../store/layoutAtoms";
import LessonPlan from "../../../main/lessonPlan/lessonPlan";
import { StyledPopper } from "../../../utils/utils";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 4,
    },
    item:{
        padding: `8px 16px`,
        margin: `0 4px`,
        cursor: `pointer`,
        borderRadius: 10,
        transition: `100ms all ease-in-out`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    itemClear:{},
    itemToggleCanvas:{},
}));

interface LessonPlanMenuProps {
	anchor?: any;
}

function LessonPlanMenu (props: LessonPlanMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    return (
        <StyledPopper
            open={isLessonPlanOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>
                <Grid
                    item
                    xs>
                    <LessonPlan />
                </Grid>
            </Grid>
        </StyledPopper>
    );
}

export default LessonPlanMenu;
