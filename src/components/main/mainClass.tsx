import { useSessionContext } from "../../providers/session-context";
import { ClassType } from "../../store/actions";
import { showEndStudyState } from "../../store/layoutAtoms";
import { WBToolbarContainer } from "../classContent/WBToolbar";
import { ClassContent } from "./classContent";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

function MainClass () {
    const { classType } = useSessionContext();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);

    return (
        <>
            <ClassContent />
            {!showEndStudy &&  <WBToolbarContainer useLocalDisplay={classType !== ClassType.LIVE} />}
        </>
    );
}

export default MainClass;
