import { LocalSessionContext } from "../../../providers/providers";
import { ClassType } from "../../../store/actions";
import {
    isChatOpenState,
    isLessonPlanOpenState,
} from "../../../store/layoutAtoms";
import { StyledDrawer } from "../utils/utils";
import Chat from "./chat/chat";
import LessonPlan from "./lessonPlan/lessonPlan";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

function MainDrawer () {
    const { classtype, isTeacher } = useContext(LocalSessionContext);

    return (
        <>
            <StyledDrawer active={classtype === ClassType.CLASSES}>
                <LessonPlan />
            </StyledDrawer>
        </>
    );
}

export default MainDrawer;
