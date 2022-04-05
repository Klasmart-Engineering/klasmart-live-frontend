import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import {
    isShowOnBoardingState,
    shouldClearCookieState,
} from "@/app/model/appModel";
import {
    BG_COLOR_SIGN_IN_BUTTON,
    THEME_COLOR_BACKGROUND_ON_BOARDING,
} from "@/config";
import {
    Button,
    Dialog,
    Grid,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullWidth: {
        width: `100%`,
        textAlign: `center`,
    },
    container: {
        padding: theme.spacing(0, 2, 6),
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_ON_BOARDING,
    },
    content: {
        height: `60%`,
        [theme.breakpoints.up(`sm`)]: {
            height: `50%`,
        },
    },
    bodyContainer: {
        width: `85%`,
    },
    img: {
        width: 170,
        [theme.breakpoints.up(`sm`)]: {
            width: 230,
        },
    },
    title: {
        fontWeight: theme.typography.fontWeightBold as number,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1.5),

        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1.25rem`,
        },
    },
    goBackButton: {
        maxWidth: 330,
        width: `100%`,
        fontSize: `1.15rem`,
        lineHeight: 1.334,
        fontWeight: theme.typography.fontWeightBold as number,
        backgroundColor: BG_COLOR_SIGN_IN_BUTTON,
        color: theme.palette.common.white,
        padding: theme.spacing(2),
        borderRadius: theme.spacing(3, 1, 3, 3),
        "&:hover": {
            backgroundColor: BG_COLOR_SIGN_IN_BUTTON,
        },
    },
}));

interface Props {
    open: boolean;
    title: string;
    body: string;
    imgSrc: string;
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined;
}

export function NoPageFoundDialog ({
    open, title, body, imgSrc, onClose,
}: Props): JSX.Element {
    const { actions } = useAuthenticationContext();
    const classes = useStyles();
    const theme = useTheme();
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
        >
            <Grid
                container
                className={classes.container}
                direction="column"
                justifyContent={isSmUp ? `space-around` : `space-between`}
                alignItems="center"
            >
                <Grid
                    container
                    alignItems="center"
                    direction="column"
                    justifyContent="flex-end"
                    className={classes.content}
                >
                    <Grid item>
                        <img
                            className={classes.img}
                            alt=""
                            src={imgSrc}
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.title}
                            variant="h4"
                        >
                            <FormattedMessage id={title} />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={classes.bodyContainer}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                        >
                            <FormattedMessage id={body} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    className={classes.fullWidth}
                >
                    <Button
                        disableElevation
                        className={classes.goBackButton}
                        variant="contained"
                        onClick={() => {
                            actions?.signOut();
                            setShouldClearCookie(true);
                            setShowOnBoarding(true);
                        }}
                    >
                        <FormattedMessage id="common.goBack" />
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
}
