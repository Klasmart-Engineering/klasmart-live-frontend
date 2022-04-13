import {
    LayoutMode,
    useLayoutModeValue,
} from "@/app/model/appModel";
import IconLocked from "@/assets/img/icon_locked.svg";
import TopBackground from "@/assets/img/parental_lock_bg.svg";
import { ParentalGateCaptchaLogic } from "@/components/parentalGateCaptchaLogic";
import {
    BUTTON_CLOSE_PARENTAL_LOCK_BACKGROUND_COLOR,
    PARENTAL_LOCK_HEADER_TEXT_COLOR,
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_BACKGROUND_PAPER,
} from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    Button,
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from 'react';
import { FormattedMessage } from "react-intl";

interface Props {
    onCompleted: () => void;
    isWelcomeScreen?: boolean;
    setClosedDialog?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        flex: 1,
        width: `100%`,
        height: `100%`,
        alignItems: `center`,
        bottom: 0,
        display: `flex`,
        justifyContent: `center`,
        position: `absolute`,
        top: 0,
    },
    bgImage: {
        width: `100%`,
        position: `absolute`,
        top: `0`,
    },
    contentWrapper: {
        position: `relative`,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
    },
    contentWrapperWelcomeScreen: {
        position: `absolute`,
        top: `35%`,
        bottom: 0,

        [theme.breakpoints.up(`sm`)]: {
            top: `45%`,
        },
    },
    contentWrapperWelcomeSmallHeight: {
        top: `30%`,
    },
    content: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    contentWelcomeScreen: {
        top: 0,
        position: `relative`,
        paddingTop: theme.spacing(3),
    },
    contentStudyMode: {
        position: `relative`,
        bottom: 0,
        zIndex: 5,
        top: 0,
        padding: theme.spacing(3),
    },
    classroomLayout: {
        padding: 0,
        [theme.breakpoints.up(`md`)]: {
            justifyContent: `center`,
        },
    },
    contentWidth: {
        width: `40%`,
    },
    captchaWidth: {
        width: theme.spacing(50),
        maxWidth: `100%`,
    },
    captchaWidthWelcomeScreen: {
        width: theme.spacing(45),
        margin: `0 auto`,
    },
    contentWidthStudyMode: {
        width: `85%`,

        [theme.breakpoints.up(`sm`)]: {
            width: `50%`,
        },
    },
    captchaWidthStudyMode: {
        width: `85%`,

        [theme.breakpoints.up(`sm`)]: {
            width: `40%`,
        },
    },
    characterImg: {
        zIndex: 10,
    },
    headerText: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: PARENTAL_LOCK_HEADER_TEXT_COLOR,
    },
    errorText: {
        color: red[500],
    },
    errorTextSmallHeight: {
        padingTop: theme.spacing(1),
        padingBottom: theme.spacing(2),
        margin: 0,
    },
    wrapperErrorText: {
        minHeight: theme.spacing(12),
    },
    wrapperErrorTextNoSpaces: {
        minHeight: theme.spacing(6),
    },
    padding: {
        padding: theme.spacing(3),
    },
    paddingSmallHeight: {
        padding: theme.spacing(2),
    },
    paddingTopSmallHeight: {
        padding: theme.spacing(1.2),
        top: 0,
    },
    paddingBottomWelcomeScreen: {
        paddingBottom: theme.spacing(5),
    },
    parentText: {
        color: PARENTAL_LOCK_HEADER_TEXT_COLOR,
    },
    btnClose: {
        backgroundColor: BUTTON_CLOSE_PARENTAL_LOCK_BACKGROUND_COLOR,
        color: TEXT_COLOR_SECONDARY_DEFAULT,
        padding: theme.spacing(1, 6),
        borderRadius: theme.spacing(4),
    },
    wrapperBtnClose: {
        height:  theme.spacing(8),
        minHeight: theme.spacing(4),
        paddingBottom: theme.spacing(3),
        boxSizing: `border-box`,
    },
    noLineBreak: {
        whiteSpace: `nowrap`,
    },
    forParentBodyWidth: {
        width: `50%`,
    },
    captchaShake: {
        animation: `$shake 0.5s infinite`,
    },
    "@keyframes shake": {
        "0%":{
            transform: `translate(0)`,
        },
        "20%":{
            transform: `translate(3em)`,
        },
        "40%": {
            transform: `translate(-3em)`,
        },
        "60%" :{
            transform: `translate(3em)`,
        },
        "80%":{
            transform: `translate(-3em)`,
        },
        "100%": {
            transform: `translate(0)`,
        },
    },
}));

export function ParentalGate({
    onCompleted,
    isWelcomeScreen,
    setClosedDialog,
}: Props): JSX.Element {
    const classes = useStyles();
    const { height } = useWindowSize();
    const layoutMode = useLayoutModeValue();

    const [header, setHeader] = useState<string>(`parentalGate.title`);
    const [isShowError, setShowError] = useState<boolean>(false);
    const [isShowCloseButton, setShowCloseButton] = useState<boolean>(true);
    const [showParentCaptcha, setShowParentCaptcha] = useState<boolean>(true);
    const [ isCaptchaShake, setCaptchaShake ] = useState<boolean>(false);
    const [isLayoutModeStudy, setLayoutModeStudy] = useState<boolean>(layoutMode === LayoutMode.DEFAULT);
    const [isSmallHeight] = useState<boolean>(height <= 680);
    const ICON_LOCK_WIDTH = 50;
    const SHAKE_ANIMATION_TIME = 500;

    useEffect(() => {
        setHeader(isWelcomeScreen ? `parentalGate.title` : `forParents.title`);
    }, [isWelcomeScreen]);

    useEffect(() => {
        if(!isShowError) return;
        setCaptchaShake(true);
        setTimeout(() => {
            setCaptchaShake(false);
        }, SHAKE_ANIMATION_TIME);
    }, [ isShowError ]);

    useEffect(() => {
        if (!showParentCaptcha) {
            onCompleted();
            return;
        }
    }, [showParentCaptcha]);

    useEffect(() => {
        if (layoutMode === LayoutMode.CLASSROOM) {
            setLayoutModeStudy(false);
        } else {
            setLayoutModeStudy(true);
        }
    }, [layoutMode]);

    useEffect(() => {
        setShowCloseButton(isShowError);
    }, [isShowError]);

    useEffect(() => {
        setShowCloseButton(true);
    }, []);

    return (
        <Grid
            container
            item
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            className={classes.container}>
            {isWelcomeScreen && (
                <Grid
                    item
                    className={classes.bgImage}>
                    <img
                        src={TopBackground}
                        width="100%"
                        height="100%" />
                </Grid>)}
            <Grid
                container
                item
                direction="column"
                alignItems="center"
                className={clsx(classes.contentWrapper, {
                    [classes.contentWrapperWelcomeScreen]: isWelcomeScreen,
                    [classes.contentWrapperWelcomeSmallHeight]: isWelcomeScreen && isSmallHeight,
                }, classes)}>
                <Grid
                    container
                    item
                    direction="column"
                    justifyContent={isWelcomeScreen ? `flex-start` : `center`}
                    alignItems="center"
                    className={clsx(classes.content, {
                        [classes.contentWelcomeScreen]: isWelcomeScreen,
                        [classes.contentStudyMode]: isLayoutModeStudy,
                        [classes.classroomLayout]: !isLayoutModeStudy,
                        [classes.paddingTopSmallHeight]: isSmallHeight,
                    })}>
                    <Grid item>
                        <img
                            width={ICON_LOCK_WIDTH}
                            src={IconLocked}
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="h5"
                            align="center"
                            color="primary"
                            className={clsx(classes.headerText, classes.padding, {
                                [classes.paddingSmallHeight]: isSmallHeight,
                                [classes.parentText]: !isWelcomeScreen,
                            })}>
                            <FormattedMessage
                                id={header}
                                defaultMessage={`For Parents`} />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.contentWidth, {
                            [classes.contentWidthStudyMode]: isLayoutModeStudy,
                        })}>
                        <Typography
                            gutterBottom
                            color="primary"
                            variant="subtitle1"
                            align="center"
                            className={clsx({
                                [classes.noLineBreak]: !isLayoutModeStudy,
                            })}>
                            <FormattedMessage id="forParents.body" />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.captchaWidth, {
                            [classes.captchaWidthWelcomeScreen]: isWelcomeScreen,
                            [classes.paddingSmallHeight]: !isSmallHeight && isLayoutModeStudy,
                            [classes.captchaShake]: isCaptchaShake,
                        })}>
                        <ParentalGateCaptchaLogic
                            setError={setShowError}
                            setShowCloseButton={setShowCloseButton}
                            setShowParentCaptcha={setShowParentCaptcha} />
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.wrapperErrorText, {
                            [classes.wrapperErrorTextNoSpaces]: isSmallHeight,
                        })}>
                        {isShowError && (
                            <Typography
                                gutterBottom
                                variant="subtitle1"
                                align="center"
                                className={clsx(classes.errorText, {
                                    [classes.paddingBottomWelcomeScreen]: isWelcomeScreen,
                                    [classes.paddingTopSmallHeight]: isSmallHeight,
                                })}>
                                <FormattedMessage id="forParents.incorrect" />
                            </Typography>)}
                    </Grid>
                    <Grid
                        item
                        className={classes.wrapperBtnClose}>
                        {isShowCloseButton && (
                            <Button
                                disableElevation
                                variant="contained"
                                size="large"
                                color="secondary"
                                className={classes.btnClose}
                                onClick={setClosedDialog}>
                                <Typography variant="h5">
                                    <FormattedMessage
                                        id={`button_close`}
                                        defaultMessage={`Close`} />
                                </Typography>
                            </Button>)}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
