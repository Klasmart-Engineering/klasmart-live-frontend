import { completeParentalGate } from "../../model/appModel";
import DialogParentalLock from "@/app/components/ParentalLock";
import { dialogsState } from "@/app/model/appModel";
import KidsloopTextLogo from "@/assets/img/kidsloop_logo.svg";
import BackgroundCloudsBalloon from "@/assets/img/landing/background_clouds_balloon.svg";
import BackgroundGreenGrass from "@/assets/img/landing/background_green_grass.svg";
import {
    Button,
    createStyles,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import React from 'react';
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => createStyles({
    fullHeight: {
        height: `100%`,
    },
    bgTopImage: {
        width: `100%`,
        height: `40%`,
        "& img" : {
            display: `block`,
            width: `100%`,
            height: `100%`,
        },
    },
    bgBottomImage: {
        position: `fixed`,
        bottom: 0,
        "& img" : {
            display: `block`,
            width: `100%`,
            height: `100%`,
        },
    },
    content: {
        height: `60%`,
    },
    btnSignIn: {
        marginTop: theme.spacing(10),
        borderRadius: theme.spacing(2.5),
        width: 189,
        height: 50,
        [theme.breakpoints.up(`sm`)]: {
            width: 343,
            height: 58,
            marginTop: theme.spacing(20),
        },
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    title: {
        marginTop: theme.spacing(4),
        [theme.breakpoints.up(`sm`)]: {
            marginTop: theme.spacing(5),
        },
    },
    text: {
        [theme.breakpoints.up(`sm`)]: {
            fontWeight: theme.typography.fontWeightRegular as number,
        },
    },
    imgLogo: {
        width: 200,
        height: 57,
        [theme.breakpoints.up(`sm`)]: {
            width: 300,
            height: 81,
            marginTop: theme.spacing(4),
        },
    },
}));

export function LandingPage (): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));
    const history = useHistory();
    const setCompletedParentalChallenge = useSetRecoilState(completeParentalGate);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    if(dialogs.isParentalLockOpen){
        return(
            <DialogParentalLock
                isWelcomeScreen
                onCompleted={() => {
                    setCompletedParentalChallenge(true);
                    history.push(`/`);
                }}
            />
        );
    }

    return (
        <Grid
            container
            className={classes.fullHeight}>
            <div className={classes.bgTopImage}>
                <img
                    alt="Balloon Icon"
                    src={BackgroundCloudsBalloon}/>
            </div>
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                className={classes.content}
            >
                <Grid
                    item
                    justifyContent="center">
                    <img
                        src={KidsloopTextLogo}
                        className={classes.imgLogo}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.title}
                >
                    <Typography
                        gutterBottom
                        variant={isSmUp ? `h4` : `subtitle1`}
                        align="center"
                        className={classes.text}
                        color="primary">
                        <FormattedMessage
                            id={`landingPage.title`}
                            defaultMessage={`Education Platform for Students`}/>
                    </Typography>
                </Grid>
                <Grid
                    item>
                    <Button
                        className={classes.btnSignIn}
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={() => {
                            setParentalLock(true);
                        }}>
                        <FormattedMessage
                            id={`landingPage.signIn`}
                            defaultMessage={`Sign In`} />
                    </Button>
                </Grid>
            </Grid>
            <div className={classes.bgBottomImage}>
                <img
                    alt="Grass Icon"
                    src={BackgroundGreenGrass}/>
            </div>

        </Grid>
    );
}
