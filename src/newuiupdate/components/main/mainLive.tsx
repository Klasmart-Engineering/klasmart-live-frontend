import { LocalSessionContext } from "../../../providers/providers";
import { ClassType } from "../../../store/actions";
import Toolbar from "../toolbar/toolbar";
import MainDrawer from "./mainDrawer";
import MainView from "./mainView";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import React,
{ useContext } from "react";

const useStyles = makeStyles((theme: Theme) => ({}));

function MainLive () {
    const classes = useStyles();
    const { classtype } = useContext(LocalSessionContext);

    return (
        <>
            <MainView />
        </>
    );
}

export default MainLive;
