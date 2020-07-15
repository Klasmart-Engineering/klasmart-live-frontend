import React, { useRef, createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicIcon from "@material-ui/icons/Mic";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import EventEmitter from "eventemitter3";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";

const SEND_SIGNAL = gql`
  mutation webRTCSignal($roomId: ID!, $toSessionId: ID!, $webrtc: WebRTCIn) {
    webRTCSignal(roomId: $roomId, toSessionId: $toSessionId, webrtc: $webrtc)
  }
`;


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
    WebRTCContext.streamEmitter.emit("rerender");
}).catch(() => {
    WebRTCContext.stream = null;
});
export class WebRTCContext {
    public static streamEmitter = new EventEmitter()
    public static stream?: MediaStream | null
    public static useWebRTCContext(roomId: string): WebRTCContext {
        const [sendSignal] = useMutation(SEND_SIGNAL);
        const [webRTCContextValue, setWebRTCContextValue] = useState(
            new WebRTCContext((toSessionId: string, webrtc: WebRTCIn) => {
                // console.log("send",toSessionId,webrtc);
                return sendSignal({variables: {roomId,toSessionId,webrtc}});
            })
        );
        webRTCContextValue.set=setWebRTCContextValue;
        return webRTCContextValue;
    }
    private set?: React.Dispatch<React.SetStateAction<WebRTCContext>>
    private send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>
    private states: Map<string, WebRTCState>
    private constructor(
        send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>,
        states = new Map<string, WebRTCState>()
    ) {
        this.send = send;
        this.states = states;
        WebRTCContext.streamEmitter.addListener("rerender", () => this.rerender());
    }
    public async notification(webrtc: WebRTC): Promise<void> {
        // console.log("recv",webrtc);
        const sessionId = webrtc.sessionId;
        const state = await this.getOrCreateState(sessionId);
        await state.dispatch(webrtc);
        this.rerender();
    }

    public async start(sessionId: string): Promise<void> {
        const state = await this.getOrCreateState(sessionId);        
        return state.start();
    }

    public getMediaStreams(): Array<{sessionId: string, stream: MediaStream}> {
        const results: Array<{sessionId: string, stream: MediaStream}> = [];
        for(const [sessionId, state] of this.states.entries()) {
            if(state.remoteMediaStream && state.peer.connectionState === "connected") {
                results.push({sessionId, stream: state.remoteMediaStream});
            }
        }
        return results;
    }

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId);
        if(!state) {
            state = new WebRTCState((webRTC: WebRTCIn) => this.send(sessionId, webRTC), ()=> this.rerender(), WebRTCContext.stream);
            this.states.set(sessionId, state);
        }
        return state;
    }

    private rerender() {
        if(!this.set) { return; }
        this.set(new WebRTCContext(this.send, this.states));
    }
}


export const webRTCContext  = createContext<WebRTCContext|undefined>(undefined);
const iceServers: RTCIceServer[] = [
    {urls: "turn:turn.kidsloop.net", username: "badanamu", credential: "WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh", credentialType: "password"},
];

class WebRTCState {
    public localMediaStream?: MediaStream
    public remoteMediaStream?: MediaStream
    public peer: RTCPeerConnection
    private send: (webRTC: WebRTCIn) => any
    private rerender:()=>any

    public constructor(send: (webRTC: WebRTCIn) => any, rerender:()=>any, stream?: MediaStream) {
        this.rerender = rerender;
        this.send = send;
        this.peer = new RTCPeerConnection({iceServers});
        this.peer.onicegatheringstatechange = async () => {
            if(!this.peer) {return;}
            // console.log("onicegatheringstatechange:", this.peer.iceGatheringState);
        };
        this.peer.onicecandidate = async ({candidate}) => {
            if(candidate) {
                const ice = JSON.stringify(candidate);
                this.send({ ice });
            }
        };
        this.peer.onconnectionstatechange = () => {
            if(!this.peer) {return;}
            // console.log("onconnectionstatechange:", this.peer.connectionState);
            this.rerender();
        };
        this.peer.ontrack = ({streams}) => {
            // console.log(streams);
            this.remoteMediaStream = streams[0];
            this.rerender();
        };
        
        this.localMediaStream = stream;
        if(this.localMediaStream) {
            for(const track of this.localMediaStream.getTracks()) {
                this.peer.addTrack(track, this.localMediaStream);
            }
        }
    }

    private queue: WebRTCIn[] = []
    private pendingIceCandidates: RTCIceCandidate[] = []
    public async dispatch(webrtc: WebRTCIn): Promise<void> {
        try {
            if(!webrtc) { return; }
            const {offer, answer, ice} = webrtc;
            if(offer) {
                await this.peer.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
                // console.log("Set remote offer");

                const localDesc = await this.peer.createAnswer();
                await this.peer.setLocalDescription(localDesc);
                const answer = JSON.stringify(localDesc);
                this.send({ answer });
                // console.log("Set local answer");
                while(this.pendingIceCandidates.length > 0) {
                    const candidate = this.pendingIceCandidates.shift();
                    if(!candidate) { continue; }
                    // console.log("addIceCandidate2: ", this.peer.connectionState, candidate);
                    await this.peer.addIceCandidate(candidate).catch((e) => console.error(e));
                }
                // console.log("pendingIceCandidates Done");

            }
            if(answer) {
                const remoteDesc = new RTCSessionDescription(JSON.parse(answer));
                await this.peer.setRemoteDescription(remoteDesc);
                // console.log("Set remote answer");
            }
            if(ice) {
                const candidate = new RTCIceCandidate(JSON.parse(ice));
                if(!this.peer.remoteDescription) {
                    // console.log("canidate pending");
                    this.pendingIceCandidates.push(candidate);
                } else {
                    // console.log("addIceCandidate1: ", this.peer.connectionState, candidate);
                    await this.peer.addIceCandidate(candidate); 
                }
            }
        } catch(e) {
            console.error(e); 
        }
    }

    public async start() {
        const localDesc = await this.peer.createOffer();
        await this.peer.setLocalDescription(localDesc);
        const offer = JSON.stringify(localDesc);
        // console.log("Set local offer");
        this.send({ offer });
    }
}

export function Start({sessionId}:{sessionId: string}): JSX.Element {
    const states = useContext(webRTCContext);
    if(!states) {
        console.error("RTC Start button created outside context provider");
        return <FormattedMessage id="error_no_rtc_provider" />;
    }
    
    return <Button onClick={() => states?states.start(sessionId):undefined}>
        <FormattedMessage id="button_camera_start" />
    </Button>;
}

export function Cameras({noBackground, id}:{noBackground?: boolean, id?: string}): JSX.Element {
    const states = useContext(webRTCContext);
    if(!states) {return <FormattedMessage id="error_webrtc_unavailable" />;}
    if(id === "" || id === undefined) {
        const cameras = states.getMediaStreams().map(({stream}) => 
            <Grid item key={stream.id}>
                <Camera width={340} height={240} mediaStream={stream} />
            </Grid>
        );
        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                {cameras}
            </Grid>
        );
    } else {
        const camera = states.getMediaStreams().filter(({sessionId}) =>
            sessionId === id
        );
        return (
            camera.length === 0 ? 
                <Grid container justify="space-between" alignItems="center" style={{ width: "100%", height: "100%", backgroundColor: "#193d6f" }}>
                    <Typography style={{ margin: "0 auto", color: "white", padding: 56 }} align="center">Your student does not have a 📷 to display</Typography>
                </Grid> :
                <Grid container item justify="space-around">
                    <Camera width={220} height={120} mediaStream={camera[0].stream} noBackground={noBackground} />
                </Grid>
        );
    }
}

export function Camera({mediaStream, height, width, self, noBackground}:{mediaStream: MediaStream, height: number, width: number, self?: boolean, noBackground?: boolean}): JSX.Element {
    const theme = useTheme();
    const [cameraTurnedOn, setCameraTurnedOn] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if(!videoRef.current) {return;}
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    return (
        <Card elevation={0} square>
            { cameraTurnedOn ?
                <CardMedia
                    autoPlay={true}
                    muted={self}
                    component="video"
                    height={self ? height-32 : height}
                    style={{ backgroundColor: noBackground ? "" : "#193d6f" }}
                    ref={videoRef}
                    width={width}
                /> :
                <Typography style={{ backgroundColor: "#193d6f", height: self ? height-32 : height, margin: "0 auto", color: "white", padding: 56 }} align="center">
                    Your <span role="img" aria-label="camera">📷</span> is off.
                </Typography>
            }
            { self ? 
                <CardActions
                    disableSpacing
                    style={{ padding: theme.spacing(0.5) }}
                >
                    <Grid container justify="space-evenly" alignItems="center">
                        <Grid item>
                            <IconButton
                                aria-label="control camera"
                                component="span"
                                style={{ color: "black", fontSize: 8, padding: 0 }}
                                onClick={()=>setCameraTurnedOn(!cameraTurnedOn)}
                            >
                                {cameraTurnedOn ? <VideocamIcon color="primary" /> : <VideocamOffIcon color="secondary" />}
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Coming soon" aria-label="tooltip control mic">
                                <IconButton
                                    aria-label="control mic"
                                    component="span"
                                    style={{ color: "black", fontSize: 8, padding: 0 }}
                                >
                                    <MicIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardActions> : null }
        </Card>
    );
}

export function MyCamera(): JSX.Element {
    if (WebRTCContext.stream) {   
        return <Camera mediaStream={WebRTCContext.stream} width={340} height={240} self />;
    } else {
        return (
            <Grid container justify="space-between" alignItems="center" style={{ width: "100%", height: 240, backgroundColor: "#193d6f" }}>
                <Typography style={{ margin: "0 auto", color: "white", padding: 56 }} align="center">
                    Sorry! Seems like we can't access your 📷.
                </Typography>
            </Grid>
        );
    }
}