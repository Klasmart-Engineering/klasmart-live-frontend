import Avatar from "@material-ui/core/Avatar";
import Button, { ButtonProps } from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import clsx from "clsx";
import React, { useState } from "react";
import KidsloopLogo from "../../../assets/img/kidsloop.svg";
import LearningPassLogo from "../../../assets/img/logo_learning_pass_header.png";
import ClassSettings from "./classSettings";

interface Props extends ButtonProps {
    children?: React.ReactNode;
    className?: string;
}

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #0E78D5",
    },
})((props: MenuProps) => (
    <Menu
        elevation={1}
        getContentAnchorEl={null}
        anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
        }}
        transformOrigin={{
            horizontal: "center",
            vertical: "top",
        }}
        {...props}
    />
));

const useStyles = makeStyles((theme) => createStyles({
    avatar: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(0, 1),
        },
    },
    profileButton: {
        [theme.breakpoints.up("sm")]: {
            backgroundColor: "white",
            border: "1px solid #efefef",
            borderRadius: 12,
        },
    },
}));

export default function UserSettings(props: Props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {children, className, ...other } = props;

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Grid item>
                <Button
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    className={classes.profileButton}
                    fullWidth
                    onClick={handleMenu}
                >
                    <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        style={{ flexWrap: "nowrap" }}
                    >
                        <Hidden xsDown>
                            <img className={classes.avatar} src={KidsloopLogo} height={32} />
                        </Hidden>
                        <Avatar
                            alt="Shawn Lee"
                            className={classes.avatar}
                        >
                            <AccountCircle />
                        </Avatar>
                    </Grid>
                </Button>
            </Grid>
            <StyledMenu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
            </StyledMenu>
        </>
    );
}
