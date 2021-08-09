import { LocalSessionContext } from "../../../providers/providers";
import { ClassType } from "../../../store/actions";
import { showEndStudyState } from "../../../store/layoutAtoms";
import { ClassContent } from "./classContent";
import { WBToolbarContainer } from "./WBToolbar";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainClass () {
    const classes = useStyles();
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
