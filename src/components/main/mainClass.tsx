import { ClassContent } from "./classContent";
import { WBToolbarContainer } from "@/components/classContent/WBToolbar";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { showEndStudyState } from "@/store/layoutAtoms";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
    },
}));

function MainClass () {
    const { safeArea } = useStyles();
    const { classType } = useSessionContext();
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);

    return (
        <div className={safeArea}>
            <ClassContent />
            {!showEndStudy &&  <WBToolbarContainer useLocalDisplay={classType !== ClassType.LIVE} />}
        </div>
    );
}

export default MainClass;
