import { cameraErrorState } from "@/app/model/appModel";
import Camera from "@/components/media/camera";
import { preferedVideoInput } from "@/components/mediaDeviceSelect";
import { useSessionContext } from "@/providers/session-context";
import {
    Grid,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { FormattedMessage } from "react-intl";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `relative`,
            height: 0,
            paddingBottom: `56.25%`, // 16:9
            backgroundColor: theme.palette.common.black,
            borderRadius: theme.spacing(1.5),
        },
        disabledCameraMessage: {
            position: `absolute`,
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            whiteSpace: `pre-line`,
            wordBreak: `break-word`,
            color: theme.palette.common.white,
        },
    }));

export const CameraPreview: VoidFunctionComponent<{
    paused: boolean;
}> = ({ paused }) => {
    const theme = useTheme();
    const classes = useStyles();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const deviceId = useRecoilValue(preferedVideoInput);
    const setCameraError = useSetRecoilState(cameraErrorState);
    const { name } = useSessionContext();
    const camera = useAsync(() => {
        camera?.result?.getTracks()
            .forEach(t => t.stop());
        if(paused || deviceId === undefined) {return Promise.resolve(undefined);}
        return navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
            },
        });
    }, [ deviceId, paused ], {
        onError: () => setCameraError(true),
    });

    //On component unmount stop the camera
    useEffect(() => () => camera?.result?.getTracks()
        .forEach(t => t.stop()), [ camera.result ]);

    if(camera.result) { return <Camera mediaStream={camera.result} />;}
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            className={classes.root}
        >
            <Typography
                variant={isMdDown ? `body1` : `h5`}
                align="center"
                className={classes.disabledCameraMessage}
            >
                {camera.loading ?
                    <FormattedMessage
                        id="live.enter.allowPermission"
                        defaultMessage="Allow permission"
                    />
                    : camera.error ? <FormattedMessage id={cameraErrorMessage(camera.error)} />
                        : process.env.IS_CORDOVA_BUILD ? name : <FormattedMessage id="connect_camera" />}
            </Typography>
        </Grid>
    );
};

export const cameraErrorMessage = (error?: Error) => {
    switch(error?.name) {
    case `NotAllowedError`:
    case `PermissionDeniedError`:
        return `join_cameraPreviewFallback_allowMediaPermissions`;
    case `NotReadableError`:
        return `live.enter.allowPermission`;
    case `NotFoundError`:
    case `DevicesNotFoundError`:
    default:
        return `join_cameraPreviewFallback_cameraUnavailableOnPlatform`;
    }
};
