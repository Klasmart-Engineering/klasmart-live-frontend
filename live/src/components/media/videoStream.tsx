import React, { useRef, useEffect } from "react";

export default function VideoStream(props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>): JSX.Element {
    const { stream, ...videoProps } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current) { return; }
        if (!stream) { return; }
        videoRef.current.srcObject = stream;
    }, [videoRef.current, stream]);
    return <video style={{ width: "100%" }} ref={videoRef} autoPlay playsInline  {...videoProps} />;
}
