import { TEXT_COLOR_PRIMARY_DEFAULT } from "@/config";
import { usePrevious } from "@/utils/utils";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    Avatar,
    Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
    CameraVideoFill as CameraVideoFillIcon,
    CameraVideoOffFill as CameraDisabledIcon,
    MicFill as MicFillIcon,
    MicMuteFill as MicDisabledIcon,
} from "@styled-icons/bootstrap";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from 'react';
import { useIntl } from "react-intl";

const OVERLAY_TIMEOUT = 2000;

const useStyles = makeStyles((theme) => ({
    avatar: {
        background: `rgba(255,255,255, 0.5)`,
        width: `300px`,
        height: `300px`,
        [theme.breakpoints.down(`md`)]: {
            width: `150px`,
            height: `150px`,
        },
    },
    cornerAvatar: {
        width: `40px`,
        height: `40px`,
        margin: theme.spacing(1, 0.5),
    },
    icon: {
        color: TEXT_COLOR_PRIMARY_DEFAULT,
        width: `50%`,
        height: `50%`,
    },
}));

interface Props {
    isCameraPausedGlobally: boolean;
    isMicrophonePausedGlobally: boolean;
}

export default function GlobalMuteOverlay (props: Props) {
    const classes = useStyles();
    const [ showCameraOverlay, setShowCameraOverlay ] = useState(false);
    const [ showMicrophoneOverlay, setShowMicrophoneOverlay ] = useState(false);
    const [ showCameraDisabledAvatar, setShowCameraDisabledAvatar ] = useState(false);
    const [ showMicrophoneDisabledAvatar, setShowMicrophoneDisabledAvater ] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const intl = useIntl();

    const {
        isCameraPausedGlobally,
        isMicrophonePausedGlobally,
    } = props;

    const prevState = usePrevious({
        isCameraPausedGlobally,
        isMicrophonePausedGlobally,
    });

    useEffect(() => {
        if(!prevState) return;

        if (isCameraPausedGlobally !== prevState.isCameraPausedGlobally) {
            setShowCameraOverlay(true);

            const notificationId = isCameraPausedGlobally ? `globalMute.notification.camOff` : `globalMute.notification.camOn`;
            enqueueSnackbar(intl.formatMessage({
                id: notificationId,
            }));
        }

        const cameraTimerId = setTimeout(() => {
            setShowCameraOverlay(false);
            setShowCameraDisabledAvatar(isCameraPausedGlobally);
        }, OVERLAY_TIMEOUT);

        return (() => {
            clearTimeout(cameraTimerId);
        });
    }, [ isCameraPausedGlobally, prevState ]);

    useEffect(() => {
        if(!prevState) return;

        if (isMicrophonePausedGlobally !== prevState.isMicrophonePausedGlobally) {
            setShowMicrophoneOverlay(true);

            const notificationId = isMicrophonePausedGlobally ? `globalMute.notification.micOff` : `globalMute.notification.micOn`;
            enqueueSnackbar(intl.formatMessage({
                id: notificationId,
            }));
        }

        const microphoneTimerId = setTimeout(() => {
            setShowMicrophoneOverlay(false);
            setShowMicrophoneDisabledAvater(isMicrophonePausedGlobally);
        }, OVERLAY_TIMEOUT);

        return (() => {
            clearTimeout(microphoneTimerId);
        });
    }, [ isMicrophonePausedGlobally, prevState ]);

    return (
        <>
            {showMicrophoneOverlay &&
                <Avatar className={classes.avatar}>
                    {isMicrophonePausedGlobally ? <MicDisabledIcon className={classes.icon} /> : <MicFillIcon className={classes.icon} />}
                </Avatar>
            }
            {showCameraOverlay &&
                <Avatar className={classes.avatar}>
                    {isCameraPausedGlobally ? <CameraDisabledIcon className={classes.icon} /> : <CameraVideoFillIcon className={classes.icon} />}
                </Avatar>
            }
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-evenly"
                position="absolute"
                bottom={0}
                right={0}
                marginRight={0.5}
            >
                {isMicrophonePausedGlobally && !showMicrophoneOverlay && showMicrophoneDisabledAvatar && (
                    <Avatar className={clsx(classes.avatar, classes.cornerAvatar)}>
                        <MicDisabledIcon className={classes.icon} />
                    </Avatar>
                )}
                {isCameraPausedGlobally && !showCameraOverlay && showCameraDisabledAvatar && (
                    <Avatar className={clsx(classes.avatar, classes.cornerAvatar)}>
                        <CameraDisabledIcon className={classes.icon} />
                    </Avatar>
                )}
            </Box>
        </>
    );
}
