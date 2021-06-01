import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../../store/store";
import useVideoLayoutUpdate from "../../utils/video-layout-update";

export default function VideoStream(props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>): JSX.Element {
    const { stream, ...videoProps } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current) { return; }
        if (!stream) { return; }
        videoRef.current.srcObject = stream;
    }, [videoRef.current, stream]);

    // TODO: Will this VideoStream always be used with voice communications?
    const volume = useSelector((state: State) => state.settings.volumeVoice);

    useVideoLayoutUpdate(videoRef.current);

    useEffect(() => {
        if (!videoRef.current) { return; }
        videoRef.current.volume = volume;
    }, [videoRef.current, volume]);

    return <video style={{ width: "100%"}} ref={videoRef} autoPlay playsInline {...videoProps} />;
}
