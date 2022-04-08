import { PermissionAlertDialog } from "./permissionAlertDialog";
import { microphoneErrorState } from "@/app/model/appModel";
import { preferedAudioInput } from "@/components/mediaDeviceSelect";
import React,
{
    useEffect,
    useState,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const MicrophonePreview: VoidFunctionComponent<{
    paused: boolean;
}> = ({ paused }) => {
    const deviceId = useRecoilValue(preferedAudioInput);
    const setMicrophoneError = useSetRecoilState(microphoneErrorState);
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
        onError: () => {
            setErrorDialogOpen(true) 
            setMicrophoneError(true)
        },
    });

    //On component unmount stop the microphone
    useEffect(() => () => microphone.result?.getTracks().forEach(t => t.stop()), [ microphone.result ]);

    return (
        <>
            <PermissionAlertDialog
                open={errorDialogOpen}
                onClickClose={() => setErrorDialogOpen(false)}
            />
        </>
    );
};
