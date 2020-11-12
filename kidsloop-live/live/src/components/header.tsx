import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Lock as LockIcon } from "@styled-icons/material/Lock";

import StyledIcon from "./styled/icon";
import { State } from "../store/store";
import { setSelectOrgDialogOpen } from "../store/reducers/control";
import { useShouldSelectOrganization } from "../pages/account/selectOrgDialog";

import KidsloopLogo from "../assets/img/kidsloop_icon.svg";
import DefaultOrganization from "../assets/img/avatars/Avatar_Student_01.jpg";

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
    const errCode = useSelector((state: State) => state.communication.errCode);
    const isSchedulePage = location.hash === "#/" || location.hash === "#/schedule";

    return (errCode ? <></> :
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
                                {isSchedulePage ? <SelectOrgButton /> : <GoBackButton />}
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

function SelectOrgButton() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();
    const open = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const { shouldSelect } = useShouldSelectOrganization();

    return (
        <IconButton
            onClick={() => dispatch(setSelectOrgDialogOpen(!open))}
            size="medium"
            className={iconButton}
            style={!open ? { padding: 0 } : { visibility: shouldSelect ? "hidden" : "visible" }}
        >
            {open ? <StyledIcon icon={<CloseIcon />} size="medium" /> : <Avatar alt="Organization's thumbnail" src={DefaultOrganization} />}
        </IconButton>
    );
}

function GoBackButton() {
    const { iconButton } = useStyles();
    const history = useSelector((state: State) => state.location.history);
    const [lastIdx, setLastIdx] = useState<number>(history.lastIndexOf(location.hash));

    function goBack() {
        if (lastIdx <= 0) { return; }
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
    const open = useSelector((state: State) => state.control.selectOrgDialogOpen);
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