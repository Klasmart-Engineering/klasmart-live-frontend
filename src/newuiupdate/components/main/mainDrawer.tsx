import {
    isChatOpenState,
    isLessonPlanOpenState,
    isPinUserOpenState,
} from "../../states/layoutAtoms";
import { StyledDrawer } from "../utils/utils";
import Chat from "./chat/chat";
import LessonPlan from "./lessonPlan/lessonPlan";
import PinUser from "./pinUser/pinUser";
import React from "react";
import { useRecoilState } from "recoil";

function MainDrawer () {
    const [ isPinUserOpen, setIsPinUserOpen ] = useRecoilState(isPinUserOpenState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    return (
        <>
            <StyledDrawer active={isPinUserOpen}>
                <PinUser />
            </StyledDrawer>

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
