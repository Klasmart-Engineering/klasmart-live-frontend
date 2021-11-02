import { types as MediaSoup } from "mediasoup-client";
import React, {
    createContext,
    useContext, useState
} from "react";
import { WebRTCContext } from "../../providers/WebRTCContext";

export interface ScreenShareContextInterface {
    stream: MediaStream | undefined;
    start: () => Promise<void>;
    stop: () => Promise<void>
}

const defaultScreenShareContext = {
    stream: undefined,
    start: async () => {},
    stop: async () => {},
}

export const ScreenShareContext = createContext<ScreenShareContextInterface>(defaultScreenShareContext);

export const ScreenShareProvider = (props: {children: React.ReactNode}) => {
    const [stream, setStream] = useState<MediaStream | undefined>()
    const [producers, setProducers] = useState<MediaSoup.Producer[]>([])
    const [starting, setStarting] = useState<boolean>(false)
    const [stopping, setStopping] = useState<boolean>(false)
    const sfuState = useContext(WebRTCContext);
    
    const start = async () => {
        if(stream) {return;}
        if(starting) {return;}
        try {
            setStarting(true)
            await stop();
            const stream = await ((navigator.mediaDevices as any).getDisplayMedia({audio: true, video: true}) as Promise<MediaStream>);
            setStream(stream)
            const auxStreams= await sfuState.transmitStream("aux", stream, false)
            setProducers(auxStreams)
        } catch(e) {
            console.log(e)
        } finally {
            setStarting(false)
        }
    }

    const stop = async () => {
        if(!stream) {return;}
        if(stopping) {return;}
        try {
            setStopping(true)
            for(const producer of producers) {
                producer.close()
            }
            setProducers([])
            for(const track of stream.getTracks()) {
                track.stop();
            }
            setStream(undefined)
        } finally {
            setStopping(false)
        }
    }
    const value = {
        stream,
        start,
        stop
    }

    return(
        <ScreenShareContext.Provider value={value}>
            {props.children}
        </ScreenShareContext.Provider>
    )
}