import React, { 
    createContext,
    useReducer, DispatchWithoutAction, useContext, useRef } from "react";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import {types as MediaSoup} from "mediasoup-client"

const ScreenShareContext = createContext<{ref: React.MutableRefObject<ScreenShare>}>(undefined as any);

export class ScreenShare {
    public static Provide({children}: {children: JSX.Element | JSX.Element[]}) {
        const ref = useRef<ScreenShare>(undefined as any)
        const [value, rerender] = useReducer(() => ({ref}),{ref})
        const sfu = WebRTCSFUContext.Consume()
        if(!ref.current) {ref.current = new ScreenShare(rerender, sfu)}

        return <ScreenShareContext.Provider value={value}>
            {children}
        </ScreenShareContext.Provider>;
    }

    public static Consume() {
        return useContext(ScreenShareContext).ref.current
    }
    
    public getStream() {return this.stream;}
    private setStream(stream?: MediaStream) {
        this.stream = stream;
        this.rerender() 
    }
    
    private starting = false
    public async start() {
        if(this.stream) {return;}
        if(this.starting) {return;}
        try {
            this.starting = true;
            await this.stop();
            const stream = await ((navigator.mediaDevices as any).getDisplayMedia({audio: true, video: true}) as Promise<MediaStream>);
            this.setStream(stream)
            this.producers = await this.sfu.transmitStream("aux", stream, false)
        } finally {
            this.starting = false;
        }
    }

    private stopping = false
    public async stop() {
        if(!this.stream) {return;}
        if(this.stopping) {return;}
        try {
            this.stopping = true;
            if(this.producers) {
                for(const producer of this.producers) {
                    producer.close()
                }
            }
            this.producers = undefined
            for(const track of this.stream.getTracks()) {
                track.stop();
            }
            this.setStream()
        } finally {
            this.stopping = false;
        }
    }


    private stream?: MediaStream
    private producers?: MediaSoup.Producer[]
    private rerender: DispatchWithoutAction
    private sfu: WebRTCSFUContext
    private constructor(rerender: DispatchWithoutAction, sfu: WebRTCSFUContext) {
        this.rerender = rerender
        this.sfu = sfu
    }
}
