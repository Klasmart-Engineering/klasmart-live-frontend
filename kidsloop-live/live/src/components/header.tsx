import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Lock as LockIcon } from "@styled-icons/material/Lock";

import StyledIcon from "./styled/icon";
import { State } from "../store/store";
import { setSelectOrgOpen } from "../store/reducers/control";
import KidsloopLogo from "../assets/img/kidsloop_icon.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            borderBottom: `1px solid ${theme.palette.divider}`
        },
        safeArea: {
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            backgroundColor: theme.palette.background.paper
        },
        iconButton: {
            backgroundColor: theme.palette.background.paper
        },
    }),
);

export function Header() {
    const { root, safeArea } = useStyles();
    const theme = useTheme();
    const open = useSelector((state: State) => state.control.selectOrgOpen);

    return (
        <div className={root}>
            <AppBar
                position="sticky"
                elevation={0}
                className={safeArea}
            >
                <Toolbar style={{ padding: theme.spacing(0, 1) }}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid
                            container
                            item
                            xs={12}
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item style={{ flexGrow: 0 }}>
                                {open ? <CloseSelectOrg /> : <GoBack />}
                            </Grid>
                            <Grid item style={{ flexGrow: 1, textAlign: "center" }}>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height={32} />
                            </Grid>
                            <Grid item style={{ flexGrow: 0 }}>
                                <MenuButton />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}

function CloseSelectOrg() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();
    return (
        <IconButton
            onClick={() => dispatch(setSelectOrgOpen(false))}
            size="medium"
            className={iconButton}
        >
            <StyledIcon icon={<CloseIcon />} size="medium" />
        </IconButton>
    );
}

function GoBack() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();
    const history = useSelector((state: State) => state.location.history);
    const [lastIdx, setLastIdx] = useState<number>(history.lastIndexOf(location.hash));

    function goBack() {
        if (location.hash === "#/" || location.hash === "#/schedule") {
            return dispatch(setSelectOrgOpen(true));
        } else if (lastIdx <= 0) { return; }
        return location.href = history[lastIdx - 1];
    }

    return (
        <IconButton
            onClick={goBack}
            size="medium"
            className={iconButton}
        >
            <StyledIcon icon={<ArrowBackIcon />} size="medium" />
        </IconButton>
    );
}

function MenuButton() {
    const { iconButton } = useStyles();
    const open = useSelector((state: State) => state.control.selectOrgOpen);
    const [tootipOpen, setTooltipOpen] = useState(false);

    return (
        <Tooltip placement="bottom" title="Coming soon" open={tootipOpen} onClose={() => setTooltipOpen(false)}>
            <IconButton
                onClick={() => setTooltipOpen(true)}
                size="medium"
                className={iconButton}
                style={{ visibility: open ? "hidden" : "visible" }}
            >
                <StyledIcon icon={<LockIcon />} size="medium" />
            </IconButton>
        </Tooltip>
    );
}