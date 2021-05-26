import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";

import StyledIcon from "./styled/icon";
import { State } from "../store/store";
import { setSelectOrgDialogOpen, setSelectUserDialogOpen } from "../store/reducers/control";

import KidsloopLogo from "../assets/img/kidsloop_icon.svg";
import { useHistory } from "react-router-dom";
import { UserAvatar, OrganizationAvatar } from "kidsloop-px";
import ButtonBase from "@material-ui/core/ButtonBase";

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
        selectOrganizationButton: {
            borderRadius: 4,
        },
        selectUserButton: {
            borderRadius: "50%",
        },
    }),
);

export function Header({ isHomeRoute, setKey }: { isHomeRoute?: boolean, setKey?: React.Dispatch<React.SetStateAction<string>> }) {
    const { root, safeArea } = useStyles();
    const theme = useTheme();
    const errCode = useSelector((state: State) => state.communication.errCode);

    const selectOrgDialogOpen = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const selectUserDialogOpen = useSelector((state: State) => state.control.selectUserDialogOpen);

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
                                {selectOrgDialogOpen || selectUserDialogOpen ? <CloseSelectOrgOrUserButton /> : (
                                    isHomeRoute ? <OpenSelectOrgButton /> : <GoBackButton />
                                )}
                            </Grid>
                            <Grid item style={{ flexGrow: 0 }}>
                                { isHomeRoute && <div style={{width: 44, height: 44}} /> }
                            </Grid>
                            <Grid item style={{ flexGrow: 1, textAlign: "center" }}>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height={32} />
                            </Grid>
                            <Grid item style={{ flexGrow: 0 }}>
                                <MenuButton setKey={setKey} />
                            </Grid>
                            <Grid item style={{ flexGrow: 0 }}>
                                { isHomeRoute && <OpenSelectUserButton /> }
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}

function CloseSelectOrgOrUserButton() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();

    const selectOrgDialogOpen = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const selectUserDialogOpen = useSelector((state: State) => state.control.selectUserDialogOpen);

    return (
        <IconButton
            onClick={() => {
                if (selectOrgDialogOpen) {
                    dispatch(setSelectOrgDialogOpen(false))
                } else if (selectUserDialogOpen) {
                    dispatch(setSelectUserDialogOpen(false))
                }
            }}
            size="medium"
            className={iconButton}
        >
            <StyledIcon icon={<CloseIcon />} size="medium" />
        </IconButton>
    );
}

function OpenSelectUserButton() {
    const { selectUserButton } = useStyles();

    const dispatch = useDispatch();
    const selectedUser = useSelector((state: State) => state.session.user);

    return (
        <ButtonBase
            className={selectUserButton}
            onClick={() => dispatch(setSelectUserDialogOpen(true))}
        >
            <UserAvatar name={selectedUser?.fullName ?? ""} size={"medium"} />
        </ButtonBase>
    );
}

function OpenSelectOrgButton() {
    const { selectOrganizationButton } = useStyles();

    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    return (
        <ButtonBase
            className={selectOrganizationButton}
            onClick={() => dispatch(setSelectOrgDialogOpen(true))}
        >
            <OrganizationAvatar name={selectedOrg?.organization_name ?? ""} size={"medium"} />
        </ButtonBase>
    );
}

function GoBackButton() {
    const { iconButton } = useStyles();
    const history = useHistory();

    const [canGoBack, _setCanGoBack] = useState<boolean>(true);

    return (
        <IconButton
            onClick={() => { history.goBack(); }}
            size="medium"
            className={iconButton}
            style={{ visibility: canGoBack ? "visible" : "hidden" }}
        >
            <StyledIcon icon={<ArrowBackIcon />} size="medium" />
        </IconButton >
    );
}

// TODO (Isu): Will be changed to <RefreshButton /> that force Schedule component to rerender
function MenuButton({ setKey }: { setKey?: React.Dispatch<React.SetStateAction<string>> }) {
    const { iconButton } = useStyles();
    const selectOrgDialogOpen = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const inFlight = useSelector((state: State) => state.communication.inFlight);

    return (
        <IconButton
            onClick={() => setKey && setKey(Math.random().toString(36))}
            size="medium"
            className={iconButton}
            style={{ visibility: selectOrgDialogOpen ? "hidden" : "visible" }}
        >
            <StyledIcon icon={inFlight ? <CircularProgress size={16} /> : <RefreshIcon />} size="medium" />
        </IconButton>
    );
}