import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import { Business as BusinessIcon } from "@styled-icons/material-rounded/Business";

import StyledIcon from "./styled/icon";
import { State } from "../store/store";
import { setSelectOrgDialogOpen } from "../store/reducers/control";

import KidsloopLogo from "../assets/img/kidsloop_icon.svg";
import { useHistory } from "react-router-dom";
import { utils } from "kidsloop-px";

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

export function Header({ isHomeRoute, setKey }: { isHomeRoute?: boolean, setKey?: React.Dispatch<React.SetStateAction<string>> }) {
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
                                <MenuButton setKey={setKey} />
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
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const selectedOrganizationColor = utils.stringToHslColor(selectedOrg.organization_name ?? "??");
    const selectedOrganizationInitials = utils.nameToInitials(selectedOrg.organization_name ?? "??", 4);

    return (
        <IconButton
            onClick={() => dispatch(setSelectOrgDialogOpen(true))}
            size="medium"
            className={iconButton}
            style={{ padding: 0 }}
        >
            <Avatar
                variant="circle"
                style={{
                    color: "white",
                    backgroundColor: selectedOrganizationColor,
                }}>
                <Typography variant="caption">
                    { selectedOrg.organization_name !== ""
                        ? selectedOrganizationInitials
                        : <BusinessIcon />
                    }
                </Typography>
            </Avatar>
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