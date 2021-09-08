import useCordovaObservePause from "../platform/cordova-observe-pause";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export interface ICameraContext {
    selectedAudioDeviceId: string,
    setSelectedAudioDeviceId: React.Dispatch<React.SetStateAction<string>>,
    availableAudioDevices: MediaDeviceInfo[],
    selectedVideoDeviceId: string,
    setSelectedVideoDeviceId: React.Dispatch<React.SetStateAction<string>>,
    availableVideoDevices: MediaDeviceInfo[],
    setAcquireCameraDevice: React.Dispatch<React.SetStateAction<boolean>>,
    setHighQuality: React.Dispatch<React.SetStateAction<boolean>>,
    cameraStream: MediaStream | undefined;
    refreshCameras: () => void;
    deviceStatus: string;
    permissionError: boolean;
    notFoundError: boolean;
}

const CameraContext = createContext<ICameraContext>(undefined as any);

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export enum DeviceStatus {
    MIC_ERROR = `mic_error`,
    MIC_NOT_FOUND = `mic_not_found`,
    MIC_NOT_ALLOWED = `mic_not_allowed`
}

function isMediaNotFoundError(error: any) {
    return error.name === `NotFoundError` || error.name === `DevicesNotFoundError`;
}

function isMediaNotAllowedError(error: any) {
    return error.name === `NotAllowedError` || error.name === `PermissionDeniedError`;
}

export const CameraContextProvider = ({ children }: Props) => {
    const [ highQuality, setHighQuality ] = useState<boolean>(false);
    const [ cameraStream, setCameraStream ] = useState<MediaStream>();

    const [ notFoundError, setNotFoundError ] = useState<boolean>(false);
    const [ permissionError, setPermissionError ] = useState<boolean>(false);

    const [ selectedAudioDeviceId, setSelectedAudioDeviceId ] = useState<string>(``);
    const [ selectedVideoDeviceId, setSelectedVideoDeviceId ] = useState<string>(``);

    const [ availableAudioDevices, setAvailableAudioDevices ] = useState<MediaDeviceInfo[]>([]);
    const [ availableVideoDevices, setAvailableVideoDevices ] = useState<MediaDeviceInfo[]>([]);

    const [ deviceStatus, setDeviceStatus ] = useState<string>(``);

    const [ acquireCameraDevice, setAcquireCameraDevice ] = useState<boolean>(true);

    const requestPermissions = useCallback(async () => {
        console.log(`request media permissions`);
        return await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        }).then(stream => {
            stream.getTracks().forEach(track => {
                track.stop();
            })
        });
    }, []);

    const getAvailableDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log(`enumerated ${devices?.length} devices`);

            setAvailableVideoDevices(devices?.filter(d => d.kind === `videoinput`) ?? []);
            setAvailableAudioDevices(devices?.filter(d => d.kind === `audioinput`) ?? []);

            setPermissionError(false);
            setNotFoundError(false);
        } catch (error) {
            console.error(`error enumerating media devices: ${error}`);

            if (isMediaNotAllowedError(error)) {
                setPermissionError(true);
            } else {
                setNotFoundError(true);
            }
        }
    }, []);

    const releaseCameraStream = useCallback(() => {
        if (!cameraStream) return;

        cameraStream.getTracks()
            .forEach(t => t.stop());
        setCameraStream(undefined);
    }, [ cameraStream, setCameraStream ]);

    const acquireCameraStream = useCallback(() => {
        if (!navigator.mediaDevices) {
            setCameraStream(undefined);
            setNotFoundError(true);
            return;
        }

        console.log(`acquire camera stream: videoDevice ${selectedVideoDeviceId}, audioDevice ${selectedAudioDeviceId}`);

        const audioConstraints: MediaTrackConstraints | boolean = {
            deviceId: selectedAudioDeviceId,
        };

        const videoConstraints: MediaTrackConstraints | boolean = acquireCameraDevice ? {
            deviceId: selectedVideoDeviceId,
            width: {
                max: 720,
                ideal: highQuality ? 720 : 180,
            },
            height: {
                max: 540,
                ideal: highQuality ? 540 : 96,
            },
            frameRate: {
                max: 15,
                ideal: highQuality ? 15 : 12,
            },
        } : false;

        navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
            video: videoConstraints,
        }).then(stream => {
            setDeviceStatus(``);
            setNotFoundError(false);
            setPermissionError(false);
            setCameraStream(stream);
        }).catch(error => {
            console.error(`getUserMedia error: ${error}`);

            if (selectedVideoDeviceId) {
                setPermissionError(true);
            } else {
                if (isMediaNotFoundError(error)) {
                    setDeviceStatus(DeviceStatus.MIC_NOT_FOUND);
                    setPermissionError(false);
                    setNotFoundError(true);
                } else if (isMediaNotAllowedError(error)) {
                    setDeviceStatus(DeviceStatus.MIC_NOT_ALLOWED);
                    setPermissionError(true);
                    setNotFoundError(false);
                } else {
                    setDeviceStatus(DeviceStatus.MIC_ERROR);
                }
            }
        });
    }, []);

    const refreshCameras = useCallback(async () => {
        console.log(`refreshing cameras`);
        
        try {
            await requestPermissions();
            await getAvailableDevices();

            releaseCameraStream();
            acquireCameraStream();
        } catch(error) {
            console.error(`no camera permissions: ${error}`);
            setPermissionError(true);
        }
    }, []);

    useEffect(() => {
        acquireCameraStream();

        return () => {
            releaseCameraStream();
        };
    }, [ selectedAudioDeviceId, selectedVideoDeviceId, acquireCameraDevice ]);

    useEffect(() => {
        refreshCameras();
    }, []);

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }

        const onDeviceChange = () => {
            refreshCameras();
        };

        navigator.mediaDevices.addEventListener(`devicechange`, onDeviceChange);
        return () => {
            navigator.mediaDevices.removeEventListener(`devicechange`, onDeviceChange);
        };
    }, [ refreshCameras, refreshCameras ]);

    const onPauseStateChanged = useCallback((paused: boolean) => {
        if (paused) {
            releaseCameraStream();
        } else {
            acquireCameraStream();
        }
    }, [ releaseCameraStream, acquireCameraStream ]);

    useCordovaObservePause(onPauseStateChanged);

    return (
        <CameraContext.Provider value={{
            selectedVideoDeviceId,
            setSelectedVideoDeviceId,
            availableVideoDevices,
            selectedAudioDeviceId,
            setSelectedAudioDeviceId,
            availableAudioDevices,
            setAcquireCameraDevice,
            setHighQuality,
            cameraStream,
            notFoundError,
            permissionError,
            deviceStatus,
            refreshCameras,
        }}>
            {children}
        </CameraContext.Provider >
    );
};

export const useCameraContext = () => {
    return useContext(CameraContext);
};
