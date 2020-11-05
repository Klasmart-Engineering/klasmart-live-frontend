import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import { ArrowBackIos as ArrowBackIcon } from "@styled-icons/material/ArrowBackIos";
import { Lock as LockIcon } from "@styled-icons/material/Lock";

import StyledIcon from "./styled/icon";
import { State } from "../store/store";
import KidsloopLogo from "../assets/img/kidsloop_icon.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
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

function GoBackButton() {
    const { iconButton } = useStyles();
    const history = useSelector((state: State) => state.location.history);
    const idx = history.lastIndexOf(location.hash);
    console.log("idx", idx)
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
            style={{ visibility: lastIdx <= 0 ? "hidden" : "visible" }}
        >
            <StyledIcon icon={<ArrowBackIcon />} size="medium" />
        </IconButton>
    );
}

function MenuButton() {
    const { iconButton } = useStyles();

    return (
        <IconButton
            size="medium"
            className={iconButton}
        >
            <StyledIcon icon={<LockIcon />} size="medium" />
        </IconButton>
    );
}

export function Header() {
    const { root, safeArea } = useStyles();
    const theme = useTheme();

    // useEffect(() => {
    //     // console.log(`header: ${location.pathname}, ${location}`)

    // }, [location])

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
                            <Grid item>
                                <GoBackButton />
                            </Grid>
                            <Grid item>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height={32} />
                            </Grid>
                            <Grid item>
                                <MenuButton />
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}
