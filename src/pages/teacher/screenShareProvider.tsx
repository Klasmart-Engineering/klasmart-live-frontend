import React, { 
    createContext,
    useReducer, DispatchWithoutAction, useContext, useRef, useState } from "react";
import {types as MediaSoup} from "mediasoup-client"
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
            const auxStreams= await transmitStream("aux", stream, false)
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

    const transmitStream = async (id: string, stream: MediaStream, simulcast = true) => {
        console.log(`Transmit ${id}`)
        const transport = await initProducerTransport()
        console.log(`Transport`)
        const tracks = stream.getTracks()
        const producers = []
        let producer: Producer
        for (const track of tracks) {
            const params = {track} as ProducerOptions
            if (track.kind === "video") {
                const scalabilityMode = getSvcScalabilityMode()
                const codecs = (await initDevice()).rtpCapabilities?.codecs
                const vp9support = codecs?.find((c) => c.mimeType.toLowerCase() === 'video/vp9');
                if(scalabilityMode && !vp9support) { console.log(`Can not use scalability mode '${scalabilityMode}' as vp9 codec does not seem to be supported`) } 
                if(scalabilityMode && vp9support) {
                    params.codec = {
                        kind: 'video',
                        mimeType: 'video/VP9',
                        clockRate: 90000,
                        parameters: {
                            'profile-id': 2
                        },
                    };
                    params.encodings = [ { scalabilityMode, dtx: true } ];
                } else if(simulcast) {
                    // These should be ordered from lowest bitrate to highest bitrate
                    // rid will be automatically assigned in the order of this array from "r0" to "rN-1"
                    params.encodings = [
                        { maxBitrate: 1000000, scaleResolutionDownBy: 4, scalabilityMode: 'S1T1', dtx: true },
                        { maxBitrate: 2000000, scaleResolutionDownBy: 2, scalabilityMode: 'S1T1', dtx: true },
                        { maxBitrate: 4000000, scaleResolutionDownBy: 1, scalabilityMode: 'S1T1', dtx: true },
                    ];
                } else {
                    params.encodings = [
                        { dtx: true },
                    ];
                }
                console.log(`Wait for video producer`)
                producer = await transport.produce(params)
                if(simulcast && !scalabilityMode) { await producer.setMaxSpatialLayer(2) }
            } else {
                console.log(`Wait for audio producer`)
                params.encodings = [{ dtx: true }]
                producer = await transport.produce(params)
            }
            destructors.set(producer.id, () => producer.close())
            producers.push(producer)
        }
        console.log(`Got producers`)
        console.log(producers)
        outboundStreams.set(id, {
            id,
            producers,
            audioEnabled: true,
            videoEnabled: true,
        })
        const producerIds = []
        for (const producer of producers) {
            if (producer) {
                producerIds.push(producer.id)
            }
        }
        if (producers.length === 0) {
            throw new Error("No producers")
        }
        console.log(`Stream()(${producerIds})`)
        const { errors } = await streamMutation({ variables: { id, producerIds } })
        if (errors) {
            throw errors
        }
        console.log(`Got stream`)
        return producers
    }