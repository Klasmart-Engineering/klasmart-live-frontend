import { useDeviceOrientationValue } from "@/app/model/appModel";
import TopBackground from "@/assets/img/background_parental_lock.svg";
import BadaCharacter from "@/assets/img/bada_character.svg";
import { CaptchaLogic } from "@/components/captchaLogic";
import StyledIcon from "@/components/styled/icon";
import {
    THEME_COLOR_BACKGROUND_ICON_PARENTAL_LOCK,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_BACKGROUND_PARENTAL_LOCK,
    THEME_COLOR_ICON_PARENTAL_LOCK,
} from "@/config";
import { useWindowSize } from "@/utils/viewport";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import { LockClosed as ParentLockIcon } from "@styled-icons/heroicons-solid/LockClosed";
import { Close as CloseIcon } from "@styled-icons/material/Close";
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
    parentLockIcon:{
        display: `inline-block`,
        background: THEME_COLOR_BACKGROUND_ICON_PARENTAL_LOCK,
        borderRadius: `50%`,
        padding: 10,
        color: THEME_COLOR_ICON_PARENTAL_LOCK,
    },
    container: {
        flex: 1,
        width: `100%`,
        height: `100%`,
        position: `relative`,
        backgroundColor: THEME_COLOR_BACKGROUND_PARENTAL_LOCK,
        background: `linear-gradient(180deg, ${THEME_COLOR_BACKGROUND_PAPER} 0%, ${THEME_COLOR_BACKGROUND_PARENTAL_LOCK} 25%)`,
    },
    bgImage: {
        width: `100%`,
    },
    contentWrapper:{
        position: `relative`,
        height: `100%`,
    },
    contentWrapperPortraitMode: {
        position: `absolute`,
        top: `27%`,
        bottom: 0,

        [theme.breakpoints.up(`sm`)]: {
            top: `45%`,
        },
    },
    contentWrapperSmallHeight: {
        top: `30%`,
    },
    content: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    contentPortraitMode:{
        position: `absolute`,
        bottom: 0,
        zIndex: 5,
        top: 67,
        padding: theme.spacing(3),
    },
    landscapeLayout: {
        padding: 0,
        [theme.breakpoints.up(`md`)]: {
            justifyContent: `center`,
        },
    },
    contentWidth:{
        width: `40%`,
    },
    contentWidthPortraitMode:{
        width: `85%`,
    },
    characterImg: {
        zIndex: 10,
    },
    headerText: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    errorText: {
        color: red[500],
    },
    dialogCloseIconButton:{
        borderRadius: `50%`,
        width: `2rem`,
        height: `2rem`,
        background: theme.palette.common.white,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        position: `fixed`,
        top: 0,
        left: 0,
        margin: theme.spacing(2),
        zIndex: 10,
    },
    padding: {
        padding: theme.spacing(3),
    },
    paddingSmallHeight: {
        padding: theme.spacing(2),
    },
    paddingTopSmallHeight: {
        padding: 0,
        paddingTop: theme.spacing(2),
    },
}));

export function ParentalGate ({
    onCompleted,
    isWelcomeScreen,
    setClosedDialog,
}: Props): JSX.Element {
    const classes = useStyles();
    const { height } = useWindowSize();
    const deviceOrientation = useDeviceOrientationValue();

    const [ header, setHeader ] = useState<string>(`parentalGate.title`);
    const [ isShowError, setShowError ]  = useState<boolean>(false);
    const [ showParentCaptcha, setShowParentCaptcha ] = useState<boolean>(true);
    const [ isPortrait, setPortrait ] = useState<boolean>(deviceOrientation.includes(`portrait`));
    const [ isSmallHeight ] = useState<boolean>(height <= 680);

    useEffect(() => {
        setHeader(isWelcomeScreen ? `parentalGate.title` : `forParents.title`);
    }, [ isWelcomeScreen ]);

    useEffect(() => {
        if(!showParentCaptcha){
            onCompleted();
            return;
        }
    }, [ showParentCaptcha ]);

    useEffect(() => {
        setPortrait(deviceOrientation.includes(`portrait`));
    }, [ deviceOrientation ]);

    return (
        <Grid
            container
            item
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            className={classes.container}>
            {!isWelcomeScreen && (
                <Grid
                    item
                    onClick={setClosedDialog}>
                    <div className={classes.dialogCloseIconButton}>
                        <StyledIcon
                            icon={<CloseIcon />}
                            size={`large`}
                        />
                    </div>
                </Grid>)}
            {isPortrait && (
                <Grid
                    item
                    className={classes.bgImage}>
                    <img
                        src={TopBackground}
                        width="100%"
                        height="100%"/>
                </Grid>)}
            <Grid
                container
                item
                direction="column"
                alignItems="center"
                className={clsx(classes.contentWrapper, {
                    [classes.contentWrapperPortraitMode] : isPortrait,
                    [classes.contentWrapperSmallHeight]: isPortrait && isSmallHeight,
                })}>
                {isPortrait && (
                    <Grid
                        item
                        className={classes.characterImg}
                    >
                        <img
                            src={BadaCharacter} />
                    </Grid>)}
                <Grid
                    container
                    item
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    className={clsx(classes.content, {
                        [classes.contentPortraitMode] : isPortrait,
                        [classes.landscapeLayout]: !isPortrait,
                        [classes.paddingTopSmallHeight] : isSmallHeight && isPortrait,
                    })}>
                    <Grid
                        item
                        className={classes.parentLockIcon}>
                        <ParentLockIcon size="4rem"  />
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="h5"
                            align="center"
                            color="primary"
                            className={clsx(classes.headerText, classes.padding, {
                                [classes.paddingSmallHeight] : isSmallHeight,
                            })}>
                            <FormattedMessage id={header} />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.contentWidth, {
                            [classes.contentWidthPortraitMode] : isPortrait,
                        })}>
                        <Typography
                            gutterBottom
                            color="primary"
                            variant="subtitle1"
                            align="center">
                            <FormattedMessage id="forParents.body" />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.contentWidth, {
                            [classes.paddingSmallHeight] : !isSmallHeight && isPortrait,
                            [classes.contentWidthPortraitMode] : isPortrait,
                        })}>
                        <CaptchaLogic
                            setError={setShowError}
                            setShowParentCaptcha={setShowParentCaptcha} />
                    </Grid>
                    <Grid item>
                        {isShowError && (
                            <Typography
                                gutterBottom
                                variant="subtitle1"
                                align="center"
                                className={clsx(classes.errorText, classes.padding, {
                                    [classes.paddingTopSmallHeight] : isSmallHeight,
                                })}>
                                <FormattedMessage id="forParents.incorrect" />
                            </Typography>)}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
