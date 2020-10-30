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
    toggleFacing: () => void,
    error: boolean,
}

const CameraContext = createContext<ICameraContext>(undefined as any);

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export const CameraContextProvider = ({ children }: Props) => {
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
        const facingMode = facing === FacingType.User ? "user" : "environment";

        navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: true,
        })
            .then((s) => { setError(false); setCameraStream(s); })
            .catch((e) => { setError(true); console.error(e); });

    }, [facing, releaseCameraDevice]);

    useEffect(() => {
        reacquireCameraDevice();

        return () => {
            releaseCameraDevice();
        }
    }, [facing]);

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
        <CameraContext.Provider value={{ stream: cameraStream, facing, setFacing, toggleFacing, error }}>
            {children}
        </CameraContext.Provider >
    )
}

export const useCameraContext = () => {
    return useContext(CameraContext);
}