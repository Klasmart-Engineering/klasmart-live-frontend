import { CircularProgress, Paper } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
import * as React from "react";
import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import OnboardingCard from "./onboardingCard";

import Asset14 from "../../assets/img/background/Asset14.svg";
import Asset16 from "../../assets/img/background/Asset16.svg";

export interface OnboardingScreen {
    title: string,
    subtitle?: string,
    backgroundImg: string
    backgroundPosition?: string,
}

const ONBOARDING_SCREENS: OnboardingScreen[] = [
    {
        title: "Learn anytime, anywhere",
        backgroundImg: Asset14,
        backgroundPosition: "bottom left",
    },
    {
        title: "It's hard to learn from lectures",
        subtitle: "Learn more effective through data-driven, feature-rich activities and videos",
        backgroundImg: Asset16,
        backgroundPosition: "bottom right",
    },
    {
        title: "Stay connected with your teacher",
        subtitle: "Receive instruction at home through a full-featured live classroom and through offline homework activities",
        backgroundImg: Asset14,
        backgroundPosition: "bottom right",
    },
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
        root: {
            height: "100%",
        },
    }),
);

export default function Onboarding() {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(true);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="onboarding-dialog-title"
        >
            {
                ONBOARDING_SCREENS.map((screen) => <OnboardingCard screen={screen} />)
            }
            {/* <OnboardingCard /> */}
        </Dialog>
    );
}
