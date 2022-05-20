import LessonPlan from "@/components/main/lessonPlan/lessonPlan";
import { isLessonPlanOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    useMediaQuery,
    useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({}));

interface LessonPlanMenuProps {
	anchor: HTMLElement;
}

function LessonPlanMenu (props: LessonPlanMenuProps) {
    const { anchor } = props;
    const theme = useTheme();
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    return (
        <StyledPopper
            open={isLessonPlanOpen}
            anchorEl={anchor}
            dialog={isXsDown}
            dialogClose={() => setIsLessonPlanOpen(open => !open)}
        >
            <LessonPlan />
        </StyledPopper>
    );
}

export default LessonPlanMenu;
