import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AppsIcon from "@material-ui/icons/Apps";
import SettingsIcon from "@material-ui/icons/Settings";
import * as QueryString from "query-string";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import LearningPassLogo from "../../../assets/img/logo_learning_pass_header.png";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
import ClassSettings from "../settings/classSettings";
import UserSettings from "../settings/userSettings";
import NavButton from "./navButton";
import NavMenu from "./navMenu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            margin: theme.spacing(0, 1),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        profileButton: {
            backgroundColor: "white",
            border: "1px solid #efefef",
            borderRadius: 12,
        },
        root: {
            flexGrow: 1,
        },
        safeArea: {
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
        },
        title: {
            flex: 1,
            marginLeft: theme.spacing(2),
        },
    }),
);

interface LabelProps {
    classes: string;
}

function ClassroomLabel(props: LabelProps) {
    return(
        <Grid container item xs={10} direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Typography variant="body1" className={props.classes} noWrap>
                    Shawn @ Calm Island
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" className={props.classes} noWrap>
                    Pre-production
                </Typography>
            </Grid>
        </Grid>
    );
}

export default function NavBar() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const store = useStore();

    const activeComponent = useSelector((state: State) => state.ui.activeComponentHome);
    const setActiveComponent = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_COMPONENT_HOME, payload: value });
    };

    const handleClickOpen = () => {
        store.dispatch({ type: ActionTypes.CLASS_SETTINGS_TOGGLE, payload: true });
    };

    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;
    const menuLabel = ["Live", "Library", "People", "Assessments"];

    return (
        <div className={classes.root}>
            <AppBar color="inherit" position="sticky" className={classes.safeArea}>
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ minHeight }}
                    >
                        <Grid
                            container item
                            xs={12} md={4} lg={3}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            wrap="nowrap"
                            style={{ minHeight }}
                        >
                            <Grid container item xs={8} direction="row"
                            wrap="nowrap">
                                <NavMenu />
                                <ClassroomLabel classes={classes.title} />
                            </Grid>
                            <Hidden mdUp>
                                <Grid
                                    container item
                                    xs={4}
                                    justify="flex-end"
                                    direction="row"
                                    alignItems="center"
                                    wrap="nowrap"
                                >
                                    <Grid item>
                                        <IconButton
                                            edge="start"
                                            onClick={handleClickOpen}
                                            color="inherit"
                                            aria-label="settings of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                    </Grid>
                                    <UserSettings />
                                </Grid>
                            </Hidden>
                        </Grid>
                        <Grid
                            container item
                            xs={12} md={4} lg={6}
                            direction="row"
                            justify="center"
                            wrap="nowrap"
                        >
                            { menuLabel.map((label: string) => {
                                const value = label.toLowerCase();
                                return (
                                    <NavButton
                                        key={`menuLabel-${value}`}
                                        onClick={() => {
                                            history.push(`/?${QueryString.stringify({ component: value })}`);
                                            setActiveComponent(value);
                                        }}
                                        isActive={activeComponent === value}
                                        style={{ minHeight }}
                                    >
                                        <FormattedMessage id={`navMenu_${value}Label`} />
                                    </NavButton>
                                );
                            })}
                        </Grid>
                        <Hidden smDown>
                            <Grid
                                container item
                                md={4} lg={3}
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <Grid item>
                                    <IconButton
                                        edge="start"
                                        onClick={handleClickOpen}
                                        color="inherit"
                                        aria-label="settings of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                </Grid>
                                <UserSettings />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Toolbar>
            </AppBar>
            <ClassSettings />
        </div>
    );
    }
