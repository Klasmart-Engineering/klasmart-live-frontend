import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse"
import Paper from "@material-ui/core/Paper"
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
import SwipeableViews from "react-swipeable-views";
import Hidden from "@material-ui/core/Hidden/Hidden";
import MobileStepper from "@material-ui/core/MobileStepper";

import Asset14 from "../../assets/img/background/Asset14.svg";
import Asset16 from "../../assets/img/background/Asset16.svg";
import Asset17 from "../../assets/img/background/Asset17.svg";
import KidsloopLogoFull from "../../assets/img/kidsloop.svg";
import StyledFAB from "../../components/styled/fabButton";

export interface OnboardingScreen {
    title: string,
    subtitle?: string,
    backgroundImg: string
    backgroundPosition?: string,
    backgroundSize?: string,
}

const ONBOARDING_SCREENS: OnboardingScreen[] = [
    {
        title: "Learn anytime, anywhere",
        backgroundImg: Asset14,
        backgroundPosition: "left 105%",
    },
    {
        title: "It's hard to learn from lectures",
        subtitle: "Learn more effective through data-driven, feature-rich activities and videos",
        backgroundImg: Asset16,
        backgroundPosition: "right bottom",
    },
    {
        title: "Stay connected with your teacher",
        subtitle: "Receive instruction at home through a full-featured live classroom and through offline homework activities",
        backgroundImg: Asset17,
        backgroundPosition: "right 105%",
        backgroundSize: "250%",
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
        stepper: {
            flexGrow: 1,
            margin: "0 auto",
            padding: theme.spacing(2, 0),
        }
    }),
);

export default function Onboarding() {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (step: number) => { setActiveStep(step); }

    return (
        <Dialog
            aria-labelledby="onboarding-dialog-title"
            disableBackdropClick
            disableEscapeKeyDown
            fullScreen={fullScreen}
            maxWidth="sm"
            open={open}
            onClose={() => setOpen(false)}
            BackdropProps={{ invisible: fullScreen ? true : false }}
            PaperProps={{ style: { borderRadius: 12 } }}
        >
            <Hidden mdUp>
                <img src={KidsloopLogoFull} height={36} style={{ margin: theme.spacing(2, 0) }} />
            </Hidden>
            <SwipeableViews
                axis={"x"}
                index={activeStep}
                containerStyle={{ minHeight: 350, height: "100%" }}
                onChangeIndex={(activeStep) => handleStepChange(activeStep)}
                enableMouseEvents
                style={{ backgroundColor: "white", height: "100%" }}
            >
                {
                    ONBOARDING_SCREENS.map((screen) => <OnboardingCard fullScreen={fullScreen} screen={screen} />)
                }
            </SwipeableViews>
            <Collapse in={activeStep === ONBOARDING_SCREENS.length-1}>
                <Grid container direction="row">
                    <Grid item xs />
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                        <StyledFAB extendedOnly size="small" onClick={() => setOpen(false)}>
                            Get Started
                        </StyledFAB>
                    </Grid>
                    <Grid item xs />
                </Grid> 
            </Collapse>
            <MobileStepper
                variant="dots"
                steps={ONBOARDING_SCREENS.length}
                position="static"
                activeStep={activeStep}
                className={classes.stepper}
                nextButton={null}
                backButton={null}
            />
        </Dialog>
    );
}
