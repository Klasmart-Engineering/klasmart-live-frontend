import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useState } from "react";
import useCordovaObservePause from "../../cordova-observe-pause";

export enum FacingType {
    User = "user",
    Environment = "environment"
}

export interface ICameraContext {
    stream: MediaStream | undefined,
    facing: FacingType,
    setFacing: React.Dispatch<React.SetStateAction<FacingType>>,
    setAcquire: React.Dispatch<React.SetStateAction<boolean>>,
    toggleFacing: () => void,
    refreshCameras: () => void,
    error: boolean,
}

const CameraContext = createContext<ICameraContext>(undefined as any);

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export const CameraContextProvider = ({ children }: Props) => {
    const [acquire, setAcquire] = useState<boolean>(false);
    const [facing, setFacing] = useState<FacingType>(FacingType.User);
    const [cameraStream, setCameraStream] = useState<MediaStream>();
    const [error, setError] = useState<boolean>(false);

    const toggleFacing = useCallback(() => {
        setFacing(facing === FacingType.User ? FacingType.Environment : FacingType.Environment);
    }, [facing, setFacing]);

    const releaseCameraDevice = useCallback(() => {
        if (!cameraStream) return;

        cameraStream.getTracks()
            .forEach(t => t.stop());
        setCameraStream(undefined);
    }, [cameraStream, setCameraStream]);

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

        const facingMode = facing === FacingType.User ? "user" : "environment";

        navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: true,
        })
            .then((s) => { setError(false); setCameraStream(s); })
            .catch((e) => { setError(true); console.error(e); });

    }, [facing, releaseCameraDevice, acquire]);

    const refreshCameras = useCallback(() => {
        setAcquire(true);
        
        releaseCameraDevice();
        reacquireCameraDevice();
    }, []);

    useEffect(() => {
        reacquireCameraDevice();

        return () => {
            releaseCameraDevice();
        }
    }, [facing, acquire]);

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }

        const onDeviceChange = () => { reacquireCameraDevice(); }

        navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
        return () => {
            navigator.mediaDevices.removeEventListener("devicechange", onDeviceChange);
        };
    }, [reacquireCameraDevice]);

    const onPauseStateChanged = useCallback((paused: boolean) => {
        if (paused) {
            releaseCameraDevice();
        } else {
            reacquireCameraDevice();
        }
    }, [releaseCameraDevice, reacquireCameraDevice]);

    useCordovaObservePause(onPauseStateChanged);

    return (
        <CameraContext.Provider value={{ stream: cameraStream, facing, setFacing, toggleFacing, setAcquire, error, refreshCameras }}>
            {children}
        </CameraContext.Provider >
    )
}

export const useCameraContext = () => {
    return useContext(CameraContext);
}