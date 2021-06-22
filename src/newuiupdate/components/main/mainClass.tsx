import { ClassContent } from "./classContent";
import { WBToolbarContainer } from "./WBToolbar";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";
import { showEndStudyState } from "../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainClass () {
    const classes = useStyles();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);

    return (
        <>
            <ClassContent />
            {!showEndStudy && <WBToolbarContainer />}
        </>
    );
}

export default MainClass;
