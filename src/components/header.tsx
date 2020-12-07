import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import KidsloopLogo from "../assets/img/kidsloop_icon.svg";
import DefaultOrganization from "../assets/img/avatars/Avatar_Student_01.jpg";
import { useHistory } from "react-router-dom";

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

export function Header({ isHomeRoute }: { isHomeRoute?: boolean }) {
    const { root, safeArea } = useStyles();
    const theme = useTheme();
    const errCode = useSelector((state: State) => state.communication.errCode);
    const selectOrgDialogOpen = useSelector((state: State) => state.control.selectOrgDialogOpen);

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
                                {selectOrgDialogOpen ? <CloseSelectOrgButton /> : (
                                    isHomeRoute ? <OpenSelectOrgButton /> : <GoBackButton />
                                )}
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

function CloseSelectOrgButton() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();

    return (
        <IconButton
            onClick={() => dispatch(setSelectOrgDialogOpen(false))}
            size="medium"
            className={iconButton}
        >
            <StyledIcon icon={<CloseIcon />} size="medium" />
        </IconButton>
    );
}

function OpenSelectOrgButton() {
    const { iconButton } = useStyles();
    const dispatch = useDispatch();

    return (
        <IconButton
            onClick={() => dispatch(setSelectOrgDialogOpen(true))}
            size="medium"
            className={iconButton}
            style={{ padding: 0 }}
        >
            <Avatar alt="Organization's thumbnail" src={DefaultOrganization} />
        </IconButton>
    );
}

function GoBackButton() {
    const { iconButton } = useStyles();
    const history = useHistory();

    const [canGoBack, _setCanGoBack] = useState<boolean>(true);

    useEffect(() => {
        if (!history) return;

        const unlisten = history.listen(() => {
            // TODO: This history doesn't have any index field, so can't determine
            // if application is on top of the history stack. 
            // setCanGoBack(history.index > 0);
        });

        return () => {
            unlisten();
        }
    }, [history]);

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
function MenuButton() {
    const { iconButton } = useStyles();
    const selectOrgDialogOpen = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const [tootipOpen, setTooltipOpen] = useState(false);

    return (
        <Tooltip placement="bottom" title="Coming soon" open={tootipOpen} onClose={() => setTooltipOpen(false)}>
            <IconButton
                onClick={() => setTooltipOpen(true)}
                size="medium"
                className={iconButton}
                style={{ visibility: selectOrgDialogOpen ? "hidden" : "visible" }}
            >
                <StyledIcon icon={<LockIcon />} size="medium" />
            </IconButton>
        </Tooltip>
    );
}