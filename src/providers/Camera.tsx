import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import useCordovaObservePause from "@/app/platform/cordova-observe-pause";
import React,
{
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { isSafari } from "react-device-detect";

export interface ICameraContext {
    selectedAudioDeviceId: string;
    setSelectedAudioDeviceId: React.Dispatch<React.SetStateAction<string>>;
    availableNamedAudioConstraints: NamedDeviceConstraints[];
    selectedVideoDeviceId: string;
    setSelectedVideoDeviceId: React.Dispatch<React.SetStateAction<string>>;
    availableNamedVideoConstraints: NamedDeviceConstraints[];
    setAcquireDevices: React.Dispatch<React.SetStateAction<boolean>>;
    setAcquireCameraDevice: React.Dispatch<React.SetStateAction<boolean>>;
    setHighQuality: React.Dispatch<React.SetStateAction<boolean>>;
    cameraStream: MediaStream | undefined;
    refreshCameras: () => void;
    deviceStatus: DeviceStatus | undefined;
    cameraError: CameraError | undefined;
    setIsListeningOnDeviceChange: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AvaliableDevices {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
}

const CameraContext = createContext<ICameraContext>(undefined as any);

type Props = {
    children: ReactNode;
};

export enum FacingType {
    USER = `user`,
    ENVIRONMENT = `environment`
}

export enum DeviceStatus {
    MIC_ERROR = `mic_error`,
    MIC_NOT_FOUND = `mic_not_found`,
    MIC_NOT_ALLOWED = `mic_not_allowed`
}

export enum CameraError {
    CAMERA_UNAVAILABLE_ERROR = `camera_unavailable_error`,
    CAMERA_PERMISSION_ERROR = `camera_permission_error`,
    CAMERA_NOT_FOUND_ERROR = `camera_not_found_error`
}

export enum ErrorNameLookup {
    NOT_FOUND = `NotFoundError`,
    DEVICES_NOT_FOUND = `DevicesNotFoundError`,
    NOT_ALLOWED = `NotAllowedError`,
    PERMISSION_DENIED = `PermissionDeniedError`,
    UNDEFINED = `TypeError`,
}

function isDeviceNotFoundError (error: any) {
    return error.name === ErrorNameLookup.NOT_FOUND || error.name === ErrorNameLookup.DEVICES_NOT_FOUND;
}

function isDeviceNotAllowedError (error: any) {
    return error.name === ErrorNameLookup.NOT_ALLOWED || error.name === ErrorNameLookup.PERMISSION_DENIED;
}

function isUndefinedError (error: any) {
    return error.name === ErrorNameLookup.UNDEFINED;
}

export interface NamedDeviceConstraints {
    deviceId: string;
    name: string;
    constraints: MediaTrackConstraints;
}

interface AudioConstraintsOptions {
    deviceId: string;
}

const getAudioContraints = (options: AudioConstraintsOptions): MediaTrackConstraints => {
    const { deviceId } = options;
    return {
        deviceId,
    };
};

const HIGH_QUALITY_WIDTH = 720;
const HIGH_QUALITY_HEIGHT = 540;
const HIGH_QUALITY_FRAME_RATE = 15;
const LOW_QUALITY_WIDTH = 180;
const LOW_QUALITY_HEIGHT = 96;
const LOW_QUALITY_FRAME_RATE = 15;

interface VideoConstraintsOptions {
    facingMode?: FacingType;
    deviceId?: string;
    highQuality?: boolean;
}

const getVideoContraints = (options: VideoConstraintsOptions): MediaTrackConstraints => {
    const {
        facingMode,
        deviceId,
        highQuality,
    } = options;
    return {
        facingMode,
        deviceId,
        width: {
            max: HIGH_QUALITY_WIDTH,
            ideal: highQuality ? HIGH_QUALITY_WIDTH : LOW_QUALITY_WIDTH,
        },
        height: {
            max: HIGH_QUALITY_HEIGHT,
            ideal: highQuality ? HIGH_QUALITY_HEIGHT : LOW_QUALITY_HEIGHT,
        },
        frameRate: {
            max: HIGH_QUALITY_FRAME_RATE,
            ideal: highQuality ? HIGH_QUALITY_FRAME_RATE : LOW_QUALITY_FRAME_RATE,
        },
    };
};

export const CameraContextProvider = (props: Props) => {
    const { children } = props;
    const [ highQuality, setHighQuality ] = useState(false);
    const [ cameraStream, setCameraStream ] = useState<MediaStream>();
    const [ cameraError, setCameraError ] = useState<CameraError>();

    const [ availableNamedAudioConstraints, setAvailableNamedAudioConstraints ] = useState<NamedDeviceConstraints[]>([]);
    const [ availableNamedVideoConstraints, setAvailableNamedVideoConstraints ] = useState<NamedDeviceConstraints[]>([]);

    const [ selectedVideoDeviceId, setSelectedVideoDeviceId ] = useState(``);
    const [ selectedAudioDeviceId, setSelectedAudioDeviceId ] = useState(``);

    const [ deviceStatus, setDeviceStatus ] = useState<DeviceStatus>();

    const [ acquireDevices, setAcquireDevices ] = useState(false);
    const [ acquireCameraDevice, setAcquireCameraDevice ] = useState(true);

    const [ isListeningOnDeviceChange, setIsListeningOnDeviceChange ] = useState(false);

    // WARNING: The cordova system context is not available on web.
    const { requestPermissions: requestNativePermissions, isIOS } = useCordovaSystemContext();

    const requestAppPermissions = () => {
        if (!process.env.IS_CORDOVA_BUILD) return;
        const permissionTypes = acquireCameraDevice ? [ PermissionType.CAMERA, PermissionType.MIC ] : [ PermissionType.MIC ];
        return new Promise<void>((resolve, reject) => {
            requestNativePermissions({
                permissionTypes,
                onSuccess: (successful) => {
                    if (successful) resolve();
                    else reject();
                },
                onError: () => {
                    reject();
                },
            });
        });
    };

    const requestPermissions = useCallback(async () => {
        // NOTE: iOS 14.3 and above supports WebRTC in web view, so for iOS we
        // don't have to use the native permission request function anymore.
        if (process.env.IS_CORDOVA_BUILD && !isIOS) {
            return requestAppPermissions();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: acquireCameraDevice,
        });
        stream.getTracks().forEach((track) => track.stop());
    }, [ acquireCameraDevice ]);

    const resetAllErrors = () => {
        setCameraError(undefined);
    };

    const handleError = (error: any) => {
        console.error(error);

        if (isUndefinedError(error)) {
            setCameraError(CameraError.CAMERA_UNAVAILABLE_ERROR);
        } else if (isDeviceNotAllowedError(error)) {
            setCameraError(CameraError.CAMERA_PERMISSION_ERROR);
        } else {
            setCameraError(CameraError.CAMERA_NOT_FOUND_ERROR);
        }
    };

    const getAvailableDevices = async (): Promise<AvaliableDevices> => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === `videoinput`) ?? [];
            const audioDevices = devices.filter((device) => device.kind === `audioinput`) ?? [];
            resetAllErrors();

            return {
                videoDevices,
                audioDevices,
            };
        } catch (error) {
            handleError(error);
            return {
                videoDevices: [],
                audioDevices: [],
            };
        }
    };

    const getAllAppVideoConstraints = (): NamedDeviceConstraints[] => [
        {
            deviceId: FacingType.USER,
            name: `Front Camera`, // TODO: translate
            constraints: getVideoContraints({
                facingMode: FacingType.USER,
                highQuality,
            }),
        },
        {
            deviceId: FacingType.ENVIRONMENT,
            name: `Back Camera`, // TODO: translate
            constraints: getVideoContraints({
                facingMode: FacingType.ENVIRONMENT,
                highQuality,
            }),
        },
    ];

    const getAllVideoConstraints = async (): Promise<NamedDeviceConstraints[]> => {
        const { videoDevices } = await getAvailableDevices();
        return videoDevices.map((device) => ({
            deviceId: device.deviceId,
            name: device.label,
            constraints: getVideoContraints({
                deviceId: device.deviceId,
                highQuality,
            }),
        }));
    };

    const getAllAudioConstraints = async (): Promise<NamedDeviceConstraints[]> => {
        const { audioDevices } = await getAvailableDevices();
        return audioDevices.map((device) => ({
            deviceId: device.deviceId,
            name: device.label,
            constraints: getAudioContraints({
                deviceId: device.deviceId,
            }),
        }));
    };

    const loadAllDeviceConstraints = async () => {
        const videoConstraints = process.env.IS_CORDOVA_BUILD ? getAllAppVideoConstraints() : await getAllVideoConstraints();
        setAvailableNamedVideoConstraints(videoConstraints);

        const audioConstraints = await getAllAudioConstraints();
        setAvailableNamedAudioConstraints(audioConstraints);

        if (!selectedVideoDeviceId && videoConstraints.length > 0) setSelectedVideoDeviceId(videoConstraints[0].deviceId);
        if (!selectedAudioDeviceId && audioConstraints.length > 0) setSelectedAudioDeviceId(audioConstraints[0].deviceId);
    };

    const releaseCameraStream = useCallback(() => {
        if (!cameraStream) return;
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(undefined);
    }, [ cameraStream, setCameraStream ]);

    const acquireCameraStream = useCallback(async () => {
        if (!selectedAudioDeviceId || !selectedVideoDeviceId) {
            setCameraStream(undefined);
            setCameraError(CameraError.CAMERA_NOT_FOUND_ERROR);
            return;
        }

        const audioConstraints = availableNamedAudioConstraints.find((constraints) => constraints.deviceId === selectedAudioDeviceId);
        const videoConstraints = availableNamedVideoConstraints.find((constraints) => constraints.deviceId === selectedVideoDeviceId);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: audioConstraints?.constraints,
                video: acquireCameraDevice ? videoConstraints?.constraints : false,
            });
            setDeviceStatus(undefined);
            resetAllErrors();
            setCameraStream(stream);
        } catch (error) {
            console.error(error);
            if (selectedVideoDeviceId) {
                if (isUndefinedError(error)) {
                    setCameraError(CameraError.CAMERA_UNAVAILABLE_ERROR);
                } else {
                    setCameraError(CameraError.CAMERA_PERMISSION_ERROR);
                }
            } else {
                handleError(error);
                if (isDeviceNotFoundError(error)) {
                    setDeviceStatus(DeviceStatus.MIC_NOT_FOUND);
                } else if (isDeviceNotAllowedError(error)) {
                    setDeviceStatus(DeviceStatus.MIC_NOT_ALLOWED);
                } else {
                    setDeviceStatus(DeviceStatus.MIC_ERROR);
                }
            }
        }
    }, [
        selectedVideoDeviceId,
        selectedAudioDeviceId,
        acquireCameraDevice,
        highQuality,
    ]);

    const refreshCameras = useCallback(async () => {
        try {
            await requestPermissions();
            setCameraError(undefined);

            await loadAllDeviceConstraints();

            releaseCameraStream();
            acquireCameraStream();
        } catch (error) {
            console.error(error);
            if (isUndefinedError(error)) {
                setCameraError(CameraError.CAMERA_UNAVAILABLE_ERROR);
            } else {
                setCameraError(CameraError.CAMERA_PERMISSION_ERROR);
            }
        }
    }, [
        requestPermissions,
        releaseCameraStream,
        acquireCameraStream,
    ]);

    useEffect(() => {
        if (!acquireDevices) return;
        acquireCameraStream();

        return () => {
            releaseCameraStream();
        };
    }, [
        selectedAudioDeviceId,
        selectedVideoDeviceId,
        acquireDevices,
        acquireCameraDevice,
    ]);

    useEffect(() => {
        if (!acquireDevices) return;
        refreshCameras();
    }, [ acquireDevices, selectedVideoDeviceId ]);

    useEffect(() => {
        if (!isListeningOnDeviceChange) return;
        if (!navigator.mediaDevices) return;
        if (!acquireDevices) return;

        // TODO: On iOS and Safari the devicechange event keep being called when the camera
        // device is retrieved. Doing refreshCameras at that point puts the app
        // in an endless loop of refreshing cameras. We'll have to investigate
        // this behaviour further.
        if(isSafari || isIOS) return;

        const onDeviceChange = () => {
            refreshCameras();
        };

        navigator.mediaDevices.addEventListener(`devicechange`, onDeviceChange);
        return () => {
            navigator.mediaDevices.removeEventListener(`devicechange`, onDeviceChange);
        };
    }, [
        refreshCameras,
        acquireDevices,
        isListeningOnDeviceChange,
    ]);

    const onPauseStateChanged = useCallback((isPaused: boolean) => {
        if (!isPaused) {
            acquireCameraStream();
            return;
        }
        releaseCameraStream();
    }, [ releaseCameraStream, acquireCameraStream ]);

    useCordovaObservePause(onPauseStateChanged);

    return (
        <CameraContext.Provider value={{
            selectedAudioDeviceId,
            setSelectedAudioDeviceId,
            availableNamedAudioConstraints,
            selectedVideoDeviceId,
            setSelectedVideoDeviceId,
            availableNamedVideoConstraints,
            setAcquireDevices,
            setAcquireCameraDevice,
            setHighQuality,
            cameraStream,
            cameraError,
            deviceStatus,
            refreshCameras,
            setIsListeningOnDeviceChange,
        }}>
            {children}
        </CameraContext.Provider >
    );
};

export const useCameraContext = () => {
    return useContext(CameraContext);
};
