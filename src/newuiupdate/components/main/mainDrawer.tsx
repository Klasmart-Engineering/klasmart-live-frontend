import {
    isChatOpenState,
    isLessonPlanOpenState,
} from "../../states/layoutAtoms";
import { StyledDrawer } from "../utils/utils";
import Chat from "./chat/chat";
import LessonPlan from "./lessonPlan/lessonPlan";
import React from "react";
import { useRecoilState } from "recoil";

function MainDrawer () {
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    return (
        <>
            <StyledDrawer active={isChatOpen}>
                <Chat />
            </StyledDrawer>

            <StyledDrawer active={isLessonPlanOpen}>
                <LessonPlan />
            </StyledDrawer>
        </>
    );
}

export default MainDrawer;
