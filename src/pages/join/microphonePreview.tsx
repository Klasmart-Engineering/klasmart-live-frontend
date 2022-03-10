import { PermissionAlertDialog } from "./permissionAlertDialog";
import { preferedAudioInput } from "@/components/mediaDeviceSelect";
import { Typography } from "@material-ui/core";
import React,
{
    useEffect,
    useState,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { FormattedMessage } from "react-intl";
import { useRecoilValue } from "recoil";

export const MicrophonePreview: VoidFunctionComponent<{
    paused: boolean;
}> = ({ paused }) => {
    const deviceId = useRecoilValue(preferedAudioInput);
    const [ errorDialogOpen, setErrorDialogOpen ] = useState(false);
    const microphone = useAsync(() => {
        microphone?.result?.getTracks().forEach(t => t.stop());
        if(paused) { return Promise.resolve(undefined); }
        return navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId,
            },
        });
    }, [ deviceId, paused ], {
        onError: () => setErrorDialogOpen(true),
    });

    //On component unmount stop the microphone
    useEffect(() => () => microphone.result?.getTracks().forEach(t => t.stop()), [ microphone.result ]);

    if(microphone.loading) {
        return (
            <Typography variant="subtitle2">
                <FormattedMessage id="allow_media_permission" />
            </Typography>
        );
    }

    return (
        <>
            <PermissionAlertDialog
                open={errorDialogOpen}
                onClickClose={() => setErrorDialogOpen(false)}
            />
        </>
    );
};
