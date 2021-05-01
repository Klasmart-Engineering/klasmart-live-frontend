import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import Toolbar from "../toolbar/toolbar";
import { Whiteboard } from "../utils/Whiteboard";
import MainDrawer from "./mainDrawer";
import MainView from "./mainView";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React, { useContext } from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainStudy () {
    const classes = useStyles();
    const { classtype } = useContext(LocalSessionContext);

    return (
        <>
            STUDY
        </>
    );
}

export default MainStudy;
