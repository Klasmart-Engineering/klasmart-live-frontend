import LessonPlan from "./lessonPlan/lessonPlan";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { StyledDrawer } from "@/utils/utils";
import React,
{ useContext } from "react";

function MainDrawer () {
    const { classType } = useSessionContext();

    return (
        <>
            <StyledDrawer active={classType === ClassType.CLASSES}>
                <LessonPlan />
            </StyledDrawer>
        </>
    );
}

export default MainDrawer;
