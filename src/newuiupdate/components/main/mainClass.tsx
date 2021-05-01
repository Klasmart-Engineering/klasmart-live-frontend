import { ClassContent } from "./classContent";
import { WBToolbarContainer } from "./WBToolbar";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainClass () {
    const classes = useStyles();

    return (
        <>
            <ClassContent />
            <WBToolbarContainer />
        </>
    );
}

export default MainClass;
