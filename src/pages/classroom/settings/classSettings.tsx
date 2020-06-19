import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import AppsIcon from "@material-ui/icons/Apps";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import DialogAppBar from "../../../components/dialogAppBar";
import StyledFAB from "../../../components/fabButton";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
import { MenuItem } from "../../../types/objectTypes";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    appBar: {
        position: "relative",
    },
    fab: {
        bottom: theme.spacing(2),
        position: "absolute",
        right: theme.spacing(2),
    },
    menuButton: {
        maxWidth: "90%",
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
        },
    },
    menuContainer: {
        padding: theme.spacing(4, 5),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 2),
        },
    },
    menuGrid: {
        textAlign: "center",
    },
    title: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
}),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "90% top" }} ref={ref} {...props} />;
});

export default function ClassSettings() {
    const classes = useStyles();
    const store = useStore();
    const theme = useTheme();

    const open = useSelector((state: State) => state.ui.classSettings);
    const handleClose = () => {
        store.dispatch({ type: ActionTypes.CLASS_SETTINGS_TOGGLE, payload: false });
    };

    return (
        <>
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    toolbarBtn={
                        <Hidden smDown>
                            <Grid item>
                                <StyledFAB size="small" onClick={handleClose}>
                                    Save <SaveIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </Hidden>
                    }
                    handleClose={handleClose}
                    subtitleID={"classSettings_classroomSettings"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
                    test
                </Grid>
                <Hidden mdUp>
                    <StyledFAB className={classes.fab} size="small" onClick={handleClose}>
                        <SaveIcon fontSize="small"/>
                    </StyledFAB>
                </Hidden>
            </Dialog>
        </>
    );
}
