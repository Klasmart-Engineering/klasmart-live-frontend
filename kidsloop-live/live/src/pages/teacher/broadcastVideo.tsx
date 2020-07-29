import React, { useContext, useRef } from "react";
import { webRTCContext } from "../../webRTCState";

export function BroadcastVideo(props: {src: string}) {
    const {src} = props;
    const webrtc = useContext(webRTCContext);

    return <video
        src={src}
        width="100%"
        controls
        preload="auto"
        onLoadedData={(e) => {
            webrtc.setAux((e.target as any).captureStream());
        }}
        onContextMenu={() => {return false;}}
    />;
}