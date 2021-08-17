import LessonPlan from "../../newuiupdate/components/main/lessonPlan/lessonPlan";
import { LocalSessionContext } from "../../providers/providers";
import { ClassType } from "../../store/actions";
import { StyledDrawer } from "../../utils/utils";
import React,
{ useContext } from "react";

function MainDrawer () {
    const { classtype } = useContext(LocalSessionContext);

    return (
        <>
            <StyledDrawer active={classtype === ClassType.CLASSES}>
                <LessonPlan />
            </StyledDrawer>
        </>
    );
}

export default MainDrawer;
