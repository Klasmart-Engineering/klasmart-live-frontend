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
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import * as QueryString from "query-string";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import NavButton from "./navButton";

const menuLabel = ["Live", "Library", "People", "Assessments"];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            marginLeft: theme.spacing(2),
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
        title: {
            flexGrow: 1,
        },
    }),
);

interface LabelProps {
    classes: string;
}

function ClassroomLabel(props: LabelProps) {
    return(
        <Grid container item xs={8} direction="column" justify="flex-start" alignItems="flex-start">
            <Grid item>
                <Typography variant="body1" className={props.classes}>
                    Shawn @ Calm Island
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2" className={props.classes}>
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

    const url = new URL(window.location.href);
    const [activeComponent, setActiveComponent] = useState<string>(url.searchParams.get("component") || "live");

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar color="inherit" position="sticky">
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ minHeight }}
                    >
                        <Grid container item xs={12} md={3} direction="row">
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <AppsIcon />
                            </IconButton>
                            <ClassroomLabel classes={classes.title} />
                        </Grid>
                        <Grid container item xs={12} md={6} direction="row" justify="center">
                            { menuLabel.map((label: string) => {
                                const value = label.toLowerCase();
                                return (
                                    <NavButton
                                        onClick={() => {
                                            history.push(`/?${QueryString.stringify({ component: value })}`);
                                            setActiveComponent(value);
                                        }}
                                        isActive={activeComponent === value}
                                        style={{ minHeight }}
                                    >
                                        {label}
                                    </NavButton>
                                );
                            })}
                        </Grid>
                        <Hidden smDown>
                            <Grid container item md={3} direction="row" justify="flex-end" alignItems="center">
                                <Grid item>
                                    <IconButton
                                        aria-label="settings of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        className={classes.profileButton}
                                        fullWidth
                                        onClick={handleMenu}
                                    >
                                        <Grid container direction="row" justify="flex-end" alignItems="center">
                                            <img src={KidsloopLogo} height={32} />
                                            <Avatar
                                                alt="Shawn Lee"
                                                className={classes.avatar}
                                            >
                                                <AccountCircle />
                                            </Avatar>
                                        </Grid>
                                    </Button>
                                </Grid>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        horizontal: "center",
                                        vertical: "bottom",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        horizontal: "center",
                                        vertical: "top",
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                </Menu>
                            </Grid>
                        </Hidden>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
    }
