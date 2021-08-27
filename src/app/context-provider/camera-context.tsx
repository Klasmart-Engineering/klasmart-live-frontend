import useCordovaObservePause from "../platform/cordova-observe-pause";
import { useSessionContext } from "./session-context";
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

export enum FacingType {
    USER = `user`,
    ENVIRONMENT = `environment`
}

export interface ICameraContext {
    stream: MediaStream | undefined;
    facing: FacingType;
    setFacing: React.Dispatch<React.SetStateAction<FacingType>>;
    setAcquire: React.Dispatch<React.SetStateAction<boolean>>;
    toggleFacing: () => void;
    refreshCameras: () => void;
    error: boolean;
}

const CameraContext = createContext<ICameraContext>(undefined as any);

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export const CameraContextProvider = ({ children }: Props) => {
    const { isTeacher } = useSessionContext();

    const [ acquire, setAcquire ] = useState<boolean>(false);
    const [ facing, setFacing ] = useState<FacingType>(FacingType.USER);
    const [ cameraStream, setCameraStream ] = useState<MediaStream>();
    const [ error, setError ] = useState<boolean>(false);

    const toggleFacing = useCallback(() => {
        setFacing(facing === FacingType.USER ? FacingType.ENVIRONMENT : FacingType.ENVIRONMENT);
    }, [ facing, setFacing ]);

    const releaseCameraDevice = useCallback(() => {
        if (!cameraStream) return;

        cameraStream.getTracks()
            .forEach(t => t.stop());
        setCameraStream(undefined);
    }, [ cameraStream, setCameraStream ]);

    const reacquireCameraDevice = useCallback(() => {
        if (!acquire) {
            setCameraStream(undefined);
            setError(false);
            return;
        }

        if (!navigator.mediaDevices) {
            setCameraStream(undefined);
            setError(true);
            return;
        }

        const facingMode = facing === FacingType.USER ? `user` : `environment`;

        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode,
                width: {
                    max: 720,
                    ideal: isTeacher?720:180,
                },
                height: {
                    max: 540,
                    ideal: isTeacher?540:96,
                },
                frameRate: {
                    max: 15,
                    ideal: isTeacher?15:12,
                },
            },
            audio: true,
        })
            .then((s) => { setError(false); setCameraStream(s); })
            .catch((e) => { setError(true); console.error(e); });

    }, [
        facing,
        releaseCameraDevice,
        acquire,
    ]);

    const refreshCameras = useCallback(() => {
        setAcquire(true);

        releaseCameraDevice();
        reacquireCameraDevice();
    }, []);

    useEffect(() => {
        reacquireCameraDevice();

        return () => {
            releaseCameraDevice();
        };
    }, [ facing, acquire ]);

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }

        const onDeviceChange = () => { reacquireCameraDevice(); };

        navigator.mediaDevices.addEventListener(`devicechange`, onDeviceChange);
        return () => {
            navigator.mediaDevices.removeEventListener(`devicechange`, onDeviceChange);
        };
    }, [ reacquireCameraDevice ]);

    const onPauseStateChanged = useCallback((paused: boolean) => {
        if (paused) {
            releaseCameraDevice();
        } else {
            reacquireCameraDevice();
        }
    }, [ releaseCameraDevice, reacquireCameraDevice ]);

    useCordovaObservePause(onPauseStateChanged);

    return (
        <CameraContext.Provider value={{
            stream: cameraStream,
            facing,
            setFacing,
            toggleFacing,
            setAcquire,
            error,
            refreshCameras,
        }}>
            {children}
        </CameraContext.Provider >
    );
};

export const useCameraContext = () => {
    return useContext(CameraContext);
};
