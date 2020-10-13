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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${Asset11}) no-repeat`,
            backgroundColor: "#f0e6cf",
            backgroundPosition: "center right",
            backgroundSize: "30%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 360,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
            },
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
    screen: OnboardingScreen
}

export default function OnboardingCard(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const { screen } = props;

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">{screen.title}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
