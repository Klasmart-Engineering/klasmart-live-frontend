import {
    LayoutMode,
    useLayoutModeValue,
} from "@/app/model/appModel";
import IconLocked from "@/assets/img/icon_locked.svg";
import { ParentalGateCaptchaLogic } from "@/components/parentalGateCaptchaLogic";
import {
    BACKGROUND_PROCESS_GREY,
    LEAVE_CLASS_ERROR_MESSAGE,
    PARENTAL_LOCK_HEADER_TEXT_COLOR,
    SMALL_HEIGHT_DETECT_VALUE,
    TEXT_COLOR_CONSTRAST_DEFAULT,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_LIGHT_BLACK_TEXT,
} from "@/config";
import { useLeaveClassMutation } from "@/data/live/mutations/useLeaveClassMutation";
import { classLeftState } from "@/store/layoutAtoms";
import { useWindowSize } from "@/utils/viewport";
import { useWebrtcCloseCallback } from "@kl-engineering/live-state/ui";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from 'react';
import { FormattedMessage } from "react-intl";
import { useSetRecoilState } from "recoil";

interface Props {
  onCompleted: () => void;
  isWelcomeScreen?: boolean;
  setClosedDialog?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        paddingTop: theme.spacing(4),
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(4, 5, 0),
        },

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
        maxWidth: `50%`,
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
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightMedium as number,
        color: PARENTAL_LOCK_HEADER_TEXT_COLOR,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.25rem`,
        },
    },
    errorText: {
        color: LEAVE_CLASS_ERROR_MESSAGE,
    },
    errorTextSmallHeight: {
        padingTop: theme.spacing(1),
        padingBottom: theme.spacing(2),
        margin: 0,
    },
    wrapperErrorText: {
        minHeight: theme.spacing(6),
        display: `flex`,
        alignItems: `center`,
    },
    wrapperErrorTextNoSpaces: {
        minHeight: theme.spacing(6),
    },
    padding: {
        padding: theme.spacing(2, 0, 0.5),
    },
    paddingSmallHeight: {
        padding: theme.spacing(2, 2, 1),
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
        backgroundColor: BACKGROUND_PROCESS_GREY,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,

        padding: theme.spacing(1, 7.5),
        borderRadius: theme.spacing(4),
    },
    btnCloseText: {
        fontWeight: theme.typography.fontWeightBold as number,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `0.9rem`,
        },
    },
    wrapperBtnClose: {
        minHeight: theme.spacing(5),
        paddingBottom: theme.spacing(2),
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
        "0%": {
            transform: `translate(0)`,
        },
        "20%": {
            transform: `translate(3em)`,
        },
        "40%": {
            transform: `translate(-3em)`,
        },
        "60%": {
            transform: `translate(3em)`,
        },
        "80%": {
            transform: `translate(-3em)`,
        },
        "100%": {
            transform: `translate(0)`,
        },
    },
    description: {
        color: THEME_COLOR_LIGHT_BLACK_TEXT,
        fontSize: `0.75rem`,
        fontWeight: theme.typography.fontWeightRegular as number,
        paddingBottom: theme.spacing(1.5),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1rem`,
        },
    },
}));

export function ParentalGateHorizontal ({
    onCompleted,
    isWelcomeScreen,
    setClosedDialog,
}: Props): JSX.Element {
    const classes = useStyles();
    const { height } = useWindowSize();
    const layoutMode = useLayoutModeValue();

    const ICON_LOCK_WIDTH_SMALL = 28;
    const ICON_LOCK_WIDTH_MEDIUM = 36;
    const SHAKE_ANIMATION_TIME = 500;

    const [ header, setHeader ] = useState<string>(`parentalGate.title`);
    const [ isShowError, setShowError ] = useState<boolean>(false);
    const [ isShowCloseButton, setShowCloseButton ] = useState<boolean>(true);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState<boolean>(true);
    const [ isCaptchaShake, setCaptchaShake ] = useState<boolean>(false);
    const [ isLayoutModeParent, setLayoutModeParent ] = useState<boolean>(layoutMode === LayoutMode.PARENT);
    const [ isSmallHeight ] = useState<boolean>(height <= SMALL_HEIGHT_DETECT_VALUE);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));
    const closeConference = useWebrtcCloseCallback();
    const [ leaveClass ] = useLeaveClassMutation();
    const setClassLeft = useSetRecoilState(classLeftState);
    useEffect(() => {
        setHeader(isWelcomeScreen ? `parentalGate.title` : `forParents.title`);
    }, [ isWelcomeScreen ]);

    useEffect(() => {
        if (!isShowError) return;
        setCaptchaShake(true);
        setTimeout(() => {
            setCaptchaShake(false);
        }, SHAKE_ANIMATION_TIME);
    }, [ isShowError ]);

    useEffect(() => {
        if (!showParentCaptcha) {
            const onLeaveClass = async () => {
                await Promise.allSettled([ leaveClass(), closeConference.execute() ]);
                setClassLeft(true);
            };
            onLeaveClass();
            onCompleted();
            return;
        }
    }, [ onCompleted, showParentCaptcha ]);

    useEffect(() => {
        setLayoutModeParent(layoutMode === LayoutMode.PARENT);
    }, [ layoutMode ]);

    useEffect(() => {
        setShowCloseButton(isShowError);
    }, [ isShowError ]);

    useEffect(() => {
        setShowCloseButton(true);
    }, []);

    return (
        <Box className={classes.container}>
            <img
                alt="lock icon"
                width={isMdUp ? ICON_LOCK_WIDTH_MEDIUM : ICON_LOCK_WIDTH_SMALL}
                src={IconLocked}
            />
            <Typography
                className={clsx(classes.headerText, classes.padding, {
                    [classes.parentText]: !isWelcomeScreen,
                })}
            >
                <FormattedMessage
                    id={header}
                    defaultMessage={`For Parents`}
                />
            </Typography>
            <Typography
                className={clsx(classes.description, {
                    [classes.noLineBreak]: !isLayoutModeParent,
                })}
            >
                <FormattedMessage id="forParents.body" />
            </Typography>
            <Box className={clsx(classes.captchaWidth, {
                [classes.captchaShake]: isCaptchaShake,
            })}
            >
                <ParentalGateCaptchaLogic
                    isUsedForEndClass
                    setError={setShowError}
                    setShowCloseButton={setShowCloseButton}
                    setShowParentCaptcha={setShowParentCaptcha}
                />
            </Box>
            <Box className={classes.wrapperErrorText}>
                {isShowError && (
                    <Typography
                        gutterBottom
                        variant="subtitle1"
                        align="center"
                        className={clsx(classes.errorText, {
                            [classes.paddingBottomWelcomeScreen]: isWelcomeScreen,
                            [classes.paddingTopSmallHeight]: isSmallHeight,
                        })}
                    >
                        <FormattedMessage id="forParents.incorrect" />
                    </Typography>)}
            </Box>
            <Box className={classes.wrapperBtnClose}>
                {isShowCloseButton && (
                    <Button
                        disableElevation
                        className={classes.btnClose}
                        onClick={setClosedDialog}
                    >
                        <Typography className={classes.btnCloseText}>
                            <FormattedMessage
                                id={`button_close`}
                                defaultMessage={`Close`}
                            />
                        </Typography>
                    </Button>)}
            </Box>

        </Box>
    );
}
