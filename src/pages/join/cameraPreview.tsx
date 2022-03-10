import Loading from "@/components/loading";
import Camera from "@/components/media/camera";
import { preferedVideoInput } from "@/components/mediaDeviceSelect";
import {
    Grid,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React,
{
    useEffect,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { FormattedMessage } from "react-intl";
import { useRecoilValue } from "recoil";

export const CameraPreview: VoidFunctionComponent<{
    paused: boolean;
}> = ({ paused }) => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const deviceId = useRecoilValue(preferedVideoInput);
    const camera = useAsync(() => {
        if(paused) {return Promise.resolve(undefined);}
        return navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
            },
        });
    }, [ deviceId, paused ]);

    //On component unmount stop the camera
    useEffect(() => () => camera.result?.getTracks().forEach(t => t.stop()), [ camera.result ]);

    if(camera.loading) { return <Loading messageId="allow_media_permission" />; }
    if(camera.result) { return <Camera mediaStream={camera.result} /> ;}
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            style={{
                position: `relative`,
                height: 0,
                paddingBottom: `56.25%`, // 16:9
                backgroundColor: `#000`,
                borderRadius: 12,
            }}
        >
            <Typography
                variant={isSmDown ? `caption` : `body1`}
                align="center"
                style={{
                    position: `absolute`,
                    top: `50%`,
                    left: `50%`,
                    transform: `translate(-50%, -50%)`,
                    whiteSpace: `pre-line`,
                    wordBreak: `break-word`,
                    color: `#FFF`,
                }}
            >
                <FormattedMessage id={cameraErrorMessage(camera.error)} />
            </Typography>
        </Grid>
    );
};

export const cameraErrorMessage = (error?: Error) => {
    if(!error) { return `connect_camera`; }
    switch(error.name) {
    case `NotAllowedError`:
    case `PermissionDeniedError`:
        return `join_cameraPreviewFallback_allowMediaPermissions`;
    case `NotFoundError`:
    case `DevicesNotFoundError`:
    default:
        return `join_cameraPreviewFallback_cameraUnavailableOnPlatform`;
    }
};
