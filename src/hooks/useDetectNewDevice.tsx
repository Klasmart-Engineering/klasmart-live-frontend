import { defaultDevicesState } from '@/store/layoutAtoms';
import { useSnackbar } from '@kl-engineering/kidsloop-px';
import { makeStyles } from '@mui/styles';
import { MicFill as MicIcon } from "@styled-icons/bootstrap/MicFill";
import { Video as VideoIcon } from "@styled-icons/boxicons-solid/Video";
import { Speaker2 as SpeakerIcon } from "@styled-icons/fluentui-system-filled/Speaker2";
import React,
{ useEffect } from 'react';
import { useAsync } from "react-async-hook";
import { useRecoilState } from 'recoil';

const deviceIcons = {
    audioinput: MicIcon,
    audiooutput: SpeakerIcon,
    videoinput: VideoIcon,
};

const useStyles = makeStyles((theme) => ({
    icon: {
        height: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
}));

const useDetectNewDevice = () => {
    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles();

    const [ defaultDevices, setDefaultDevices ] = useRecoilState(defaultDevicesState);

    const { execute: notifyDefaultChange } = useAsync(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const newDefaultDevices = devices?.filter(device => device.deviceId === `default`);

        newDefaultDevices.forEach((defaultDevice, index) => {
            if(!defaultDevices.find(d => d.groupId === defaultDevice.groupId && d.label === defaultDevice.label)) {

                if (!defaultDevice?.label || !defaultDevice?.kind ) {
                    return;
                }
                const Icon = deviceIcons?.[defaultDevice?.kind];
                setTimeout(() => {
                    enqueueSnackbar?.((
                        <>
                            <Icon className={classes.icon} />
                            {defaultDevice.label}
                        </>), {
                        key: `${defaultDevice?.kind} ${defaultDevice?.label}`,
                        preventDuplicate: true,
                        autoHideDuration: 2400,
                        disableWindowBlurListener: true,

                    });
                }, index * 3000);
            }
        });

        setDefaultDevices(newDefaultDevices);

    }, []);

    useEffect(() => {
        const listener = () => notifyDefaultChange();
        navigator.mediaDevices.addEventListener(`devicechange`, listener);
    }, [ notifyDefaultChange ]);

    return {
        detectDevices: notifyDefaultChange,
    };
};

export default useDetectNewDevice;
