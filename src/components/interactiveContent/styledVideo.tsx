import React,
{
    useEffect,
    useRef,
} from "react";

export function StyledVideo (props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>): JSX.Element {
    const { stream, ...videoProps } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current) { return; }
        if (!stream) { return; }
        videoRef.current.srcObject = stream;
    }, [ videoRef.current, stream ]);
    return <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
            position: `absolute`,
            top: `0`,
            left: `0`,
            width: `100%`,
            height: `100%`,
            objectFit: `contain`,
        }}
        {...videoProps} />;
}
