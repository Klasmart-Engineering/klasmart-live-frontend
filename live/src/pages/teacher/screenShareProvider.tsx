import React, { createContext, ReactNode, ReactNodeArray, useReducer, DispatchWithoutAction } from "react";
import { WebRTCContext } from "../../webRTCState";

export const ScreenShareContext = createContext<ScreenShare>(undefined as any);

export class ScreenShare {
    public static Provider(props: {children: ReactNode | ReactNodeArray}) {
        const [state,rerender] = useReducer(({value}:{value:ScreenShare})=>({value}), {value: new ScreenShare()});
        state.value._rerender = rerender;
        return <ScreenShareContext.Provider value={state.value}>
            {props.children}
        </ScreenShareContext.Provider>;
    }

    private stream?: MediaStream
    private _rerender?: DispatchWithoutAction
    private constructor() {}
    
    public getStream() {return this.stream;}
    
    private starting = false
    public async start(webrtc: WebRTCContext) {
        if(this.starting) {return;}
        await this.stop(webrtc);
        try {
            this.starting = true;
            this.stream  = await ((navigator.mediaDevices as any).getDisplayMedia({audio: true, video: true}) as Promise<MediaStream>);
            webrtc.setAux(this.stream);
        } finally {
            this.starting = false;
        }
    }

    private stopping = false
    public async stop(webrtc: WebRTCContext) {
        if(!this.stream) {return;}
        if(this.stopping) {return;}
        try {
            this.stopping = true;
            for(const track of this.stream.getTracks()) {
                track.stop();
            }
            webrtc.setAux();
            this.stream = undefined;
        } finally {
            this.stopping = false;
        }
    }

    private rerender() {
        if(this._rerender) {this._rerender();}
    }

}
