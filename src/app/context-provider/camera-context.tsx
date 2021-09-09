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
import { PermissionType, useCordovaSystemContext } from "./cordova-system-context";

export interface ICameraContext {
    selectedAudioDeviceId: string,
    setSelectedAudioDeviceId: React.Dispatch<React.SetStateAction<string>>,
    availableAudioDevices: MediaDeviceInfo[],
    selectedVideoDeviceId: string,
    setSelectedVideoDeviceId: React.Dispatch<React.SetStateAction<string>>,
    availableVideoDevices: MediaDeviceInfo[],
    setAcquireDevices: React.Dispatch<React.SetStateAction<boolean>>,
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

    const [ acquireDevices, setAcquireDevices ] = useState<boolean>(false);
    const [ acquireCameraDevice, setAcquireCameraDevice ] = useState<boolean>(true);

    // TODO: The cordova system context is not available on web.
    const { requestPermissions: requestNativePermissions } = useCordovaSystemContext();

    const requestPermissions = useCallback(async () => {
        console.log(`request media permissions`);

        /* TODO: Can this if statement be abstracted away by replacing `requestPermissions` with a
        ** generic function from interface with different implementations for web and app? */
        if (process.env.IS_CORDOVA_BUILD) {
            const permissionTypes = acquireCameraDevice ? [
                PermissionType.CAMERA,
                PermissionType.MIC,
            ] : [PermissionType.MIC];

            return new Promise<void>((resolve, reject) => {
                requestNativePermissions({
                    permissionTypes, onSuccess: (successful) => {
                        if (successful) resolve();
                        else reject();
                    }, onError: () => {
                        reject();
                    }
                });
            });
        } else {
            return await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: acquireCameraDevice,
            }).then(stream => {
                stream.getTracks().forEach(track => {
                    track.stop();
                })
            });
        }
    }, []);

    const getAvailableDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log(`enumerated ${devices?.length ?? 0} devices`);
            console.log(devices);

            const videoDevices = devices?.filter(d => d.kind === `videoinput`) ?? [];
            const audioDevices = devices?.filter(d => d.kind === `audioinput`) ?? []

            setAvailableVideoDevices(videoDevices);
            setAvailableAudioDevices(audioDevices);

            if (!selectedVideoDeviceId && videoDevices.length > 0) {
                setSelectedVideoDeviceId(videoDevices[0].deviceId);
            }

            if (!selectedAudioDeviceId && audioDevices.length > 0) {
                setSelectedAudioDeviceId(audioDevices[0].deviceId);
            }

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
    }, [ selectedVideoDeviceId, selectedAudioDeviceId ]);

    const releaseCameraStream = useCallback(() => {
        if (!cameraStream) return;

        console.log(`releasing camera: `, cameraStream);
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

        console.log(`acquire camera stream`);
        console.log(`video: ${selectedVideoDeviceId}`);
        console.log(`audio: ${selectedAudioDeviceId}`);

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
    }, [ selectedVideoDeviceId, selectedAudioDeviceId, acquireCameraDevice, highQuality ]);

    const refreshCameras = useCallback(async () => {
        console.log(`refreshing cameras`);
        
        try {
            await requestPermissions();
            setPermissionError(false);

            console.log(`got camera permission; enumerating devices`)
            await getAvailableDevices();

            releaseCameraStream();
            acquireCameraStream();
        } catch(error) {
            console.error(`no camera permissions: ${error}`);
            setPermissionError(true);
        }
    }, []);

    useEffect(() => {
        if (!acquireDevices) { return; }

        if (selectedAudioDeviceId || selectedVideoDeviceId) {
            acquireCameraStream();
        }

        return () => {
            releaseCameraStream();
        };
    }, [ selectedAudioDeviceId, selectedVideoDeviceId, acquireDevices, acquireCameraDevice ]);

    useEffect(() => {
        if (!acquireDevices) { return };

        refreshCameras();
    }, [ acquireDevices ]);

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        if (!acquireDevices) { return; }

        const onDeviceChange = () => {
            refreshCameras();
        };

        navigator.mediaDevices.addEventListener(`devicechange`, onDeviceChange);
        return () => {
            navigator.mediaDevices.removeEventListener(`devicechange`, onDeviceChange);
        };
    }, [ refreshCameras, refreshCameras, acquireDevices ]);

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
            setAcquireDevices,
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
