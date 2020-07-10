import React, { useRef, createContext, useContext, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { Typography, Grid } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import EventEmitter from "eventemitter3"

const SEND_SIGNAL = gql`
  mutation webRTCSignal($roomId: ID!, $toSessionId: ID!, $webrtc: WebRTCIn) {
    webRTCSignal(roomId: $roomId, toSessionId: $toSessionId, webrtc: $webrtc)
  }
`


export interface WebRTCIn {
    offer?: string
    answer?: string
    ice?: string
}


export interface WebRTC {
    sessionId: string
    offer?: string
    answer?: string
    ice?: string
}

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
    WebRTCContext.stream = stream;
    WebRTCContext.streamEmitter.emit("rerender")
});
export class WebRTCContext {
    public static streamEmitter = new EventEmitter()
    public static stream?: MediaStream
    public static useWebRTCContext(roomId: string): WebRTCContext {
        const [sendSignal] = useMutation(SEND_SIGNAL)
        const [webRTCContextValue, setWebRTCContextValue] = useState(
            new WebRTCContext((toSessionId: string, webrtc: WebRTCIn) => {
                console.log('send',toSessionId,webrtc)
                return sendSignal({variables: {roomId,toSessionId,webrtc}})
            })
        )
        webRTCContextValue.set=setWebRTCContextValue
        return webRTCContextValue
    }
    private set?: React.Dispatch<React.SetStateAction<WebRTCContext>>
    private send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>
    private states: Map<string, WebRTCState>
    private constructor(
        send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>,
        states = new Map<string, WebRTCState>()
    ) {
        this.send = send
        this.states = states
        WebRTCContext.streamEmitter.addListener("rerender", () => this.rerender())
    }
    public async notification(webrtc: WebRTC): Promise<void> {
        console.log('recv',webrtc)
        const sessionId = webrtc.sessionId
        const state = await this.getOrCreateState(sessionId)
        await state.dispatch(webrtc)
        this.rerender()
    }

    public async start(sessionId: string): Promise<void> {
        const state = await this.getOrCreateState(sessionId)        
        return state.start()
    }

    public getMediaStreams(): Array<{sessionId: string, stream: MediaStream}> {
        const results: Array<{sessionId: string, stream: MediaStream}> = []
        for(const [sessionId, state] of this.states.entries()) {
            if(state.remoteMediaStream && state.peer.connectionState === 'connected') {
                results.push({sessionId, stream: state.remoteMediaStream})
            }
        }
        return results
    }

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId)
        if(!state) {
            state = new WebRTCState((webRTC: WebRTCIn) => this.send(sessionId, webRTC), ()=> this.rerender(), WebRTCContext.stream)
            this.states.set(sessionId, state)
        }
        return state
    }

    private rerender() {
        if(!this.set) { return }
        this.set(new WebRTCContext(this.send, this.states))
    }
}


export const webRTCContext  = createContext<WebRTCContext|undefined>(undefined)
const iceServers: RTCIceServer[] = [
    {urls: 'turn:turn.kidsloop.net', username: 'badanamu', credential: 'WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh', credentialType: 'password'},
]

class WebRTCState {
    public localMediaStream?: MediaStream
    public remoteMediaStream?: MediaStream
    public peer: RTCPeerConnection
    private send: (webRTC: WebRTCIn) => any
    private rerender:()=>any

    public constructor(send: (webRTC: WebRTCIn) => any, rerender:()=>any, stream?: MediaStream) {
        this.rerender = rerender
        this.send = send
        this.peer = new RTCPeerConnection({iceServers})
        this.peer.onicegatheringstatechange = async () => {
            if(!this.peer) {return}
            console.log('onicegatheringstatechange:', this.peer.iceGatheringState)
        }
        this.peer.onicecandidate = async ({candidate}) => {
            if(candidate) {
                const ice = JSON.stringify(candidate)
                this.send({ ice })
            }
        }
        this.peer.onconnectionstatechange = () => {
            if(!this.peer) {return}
            console.log('onconnectionstatechange:', this.peer.connectionState)
            this.rerender()
        }
        this.peer.ontrack = ({streams}) => {
            console.log(streams)
            this.remoteMediaStream = streams[0]
            this.rerender()
        }
        
        this.localMediaStream = stream
        if(this.localMediaStream) {
            for(const track of this.localMediaStream.getTracks()) {
                this.peer.addTrack(track, this.localMediaStream)
            }
        }
    }

    private queue: WebRTCIn[] = []
    private pendingIceCandidates: RTCIceCandidate[] = []
    public async dispatch(webrtc: WebRTCIn): Promise<void> {
        try {
            if(!webrtc) { return }
            const {offer, answer, ice} = webrtc
            if(offer) {
                await this.peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)))
                console.log('Set remote offer')

                const localDesc = await this.peer.createAnswer()
                await this.peer.setLocalDescription(localDesc)
                const answer = JSON.stringify(localDesc)
                this.send({ answer })
                console.log('Set local answer')
                while(this.pendingIceCandidates.length > 0) {
                    const candidate = this.pendingIceCandidates.shift()
                    if(!candidate) { continue }
                    console.log('addIceCandidate2: ', this.peer.connectionState, candidate)
                    await this.peer.addIceCandidate(candidate).catch((e) => console.error(e))
                }
                console.log('pendingIceCandidates Done')

            }
            if(answer) {
                const remoteDesc = new RTCSessionDescription(JSON.parse(answer))
                await this.peer.setRemoteDescription(remoteDesc)
                console.log('Set remote answer')
            }
            if(ice) {
                const candidate = new RTCIceCandidate(JSON.parse(ice))
                if(!this.peer.remoteDescription) {
                    console.log('canidate pending')
                    this.pendingIceCandidates.push(candidate)
                } else {
                    console.log('addIceCandidate1: ', this.peer.connectionState, candidate)
                    await this.peer.addIceCandidate(candidate) 
                }
            }
        } catch(e) {
            console.error(e) 
        }
    }

    public async start() {
        const localDesc = await this.peer.createOffer()
        await this.peer.setLocalDescription(localDesc)
        const offer = JSON.stringify(localDesc)
        console.log('Set local offer')
        this.send({ offer })
    }
}

export function Start({sessionId}:{sessionId: string}): JSX.Element {
    const states = useContext(webRTCContext)
    if(!states) {
        console.error('RTC Start button created outside context provider')
        return <FormattedMessage id="error_no_rtc_provider" />
    }
    
    return <Button onClick={() => states?states.start(sessionId):undefined}>
        <FormattedMessage id="button_camera_start" />
    </Button>
}

export function Cameras(): JSX.Element {
    const states = useContext(webRTCContext)
    if(!states) {return <FormattedMessage id="error_webrtc_unavailable" />}
    const cameras = states.getMediaStreams().map(({sessionId,stream}) => 
        <Grid item key={stream.id}>
            <Camera mediaStream={stream} />
        </Grid>
    )
    return (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
        >
            {cameras}
        </Grid>
    )
}

export function Camera({mediaStream}:{mediaStream: MediaStream}): JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if(!videoRef.current) {return}
        videoRef.current.srcObject = mediaStream
        console.log(videoRef.current.videoHeight);
    }, [videoRef.current, mediaStream])
    return <video ref={videoRef} autoPlay={true} style={{width: 340, height: 240 }}/>
}

export function MyCamera(): JSX.Element {
    if (WebRTCContext.stream) {   
        return <Camera mediaStream={WebRTCContext.stream} />;
    } else {
        return (
            <Grid container justify="space-between" alignItems="center" style={{ width: '100%', height: 240, backgroundColor: '#193d6f' }}>
                <Typography style={{ margin: '0 auto', color: 'white', padding: 56 }} align="center">Your camera turned off 📷</Typography>
            </Grid>
        )
    }
}