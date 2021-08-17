import { LocalSessionContext } from "../../providers/providers";
import { ClassType } from "../../store/actions";
import { showEndStudyState } from "../../store/layoutAtoms";
import { WBToolbarContainer } from "../classContent/WBToolbar";
import { ClassContent } from "./classContent";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

function MainClass () {
    const { classtype } = useContext(LocalSessionContext);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);

    return (
        <>
            <ClassContent />
            {!showEndStudy &&  <WBToolbarContainer useLocalDisplay={classtype !== ClassType.LIVE} />}
        </>
    );
}

export default MainClass;
