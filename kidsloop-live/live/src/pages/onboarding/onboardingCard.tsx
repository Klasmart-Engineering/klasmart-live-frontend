import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import FaceIcon from "@material-ui/icons/Face";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import Asset11 from "../../assets/img/background/Asset11.svg"
import { OnboardingScreen } from "./onboarding";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        onboardingCard: {
            height: "calc(100% - 16px)",
            borderRadius: 12, 
            margin: theme.spacing(0),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(1),
            },
        },
        onboardingCardInfo: {
            backgroundSize: "100%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            padding: theme.spacing(4, 5),
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        select: {
            display: "block",
        },
    }),
);

interface Props {
    fullScreen: boolean,
    screen: OnboardingScreen,
}

export default function OnboardingCard(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const { fullScreen, screen } = props;

    return (
        <Paper elevation={fullScreen ? 4 : 0} className={classes.onboardingCard}>
            <Grid
                container
                direction="row"
                style={{ 
                    background: `url(${screen.backgroundImg}) no-repeat`,
                    backgroundPosition: screen.backgroundPosition || "bottom center",
                    backgroundSize: fullScreen ? (screen.backgroundSize || "200%") : "125%",
                }}
                className={classes.onboardingCardInfo}
            >
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" style={{ paddingBottom: theme.spacing(2) }}>{screen.title}</Typography>
                    <Typography variant="subtitle2" align="center">{screen.subtitle}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
