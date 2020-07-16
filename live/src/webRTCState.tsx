import React, { useRef, createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
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
    description?: string
    ice?: string
}


export interface WebRTC {
    sessionId: string
    description?: string
    ice?: string
}

export const webRTCContext  = createContext<WebRTCContext>(undefined as any);

export class WebRTCContext {
    private static streamEmitter = new EventEmitter()
    private static stream?: MediaStream | null = navigator.mediaDevices ? undefined : null
    private static streamPromise = navigator.mediaDevices && navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        WebRTCContext.stream = stream;
    }).catch(() => {
        WebRTCContext.stream = null;
    }).finally(() => {
        WebRTCContext.streamEmitter.emit("rerender");
    });
    public videoTrackEnabled: boolean;
    public audioTrackEnabled: boolean;

    public setVideoStreamState(enabled: boolean) {
        this.videoTrackEnabled = enabled;
        for(const state of this.states.values()) {
            if (!state.localMediaStream) { continue; }
            for(const track of state.localMediaStream.getVideoTracks()) {
                track.enabled = enabled;
            }
        }
        this.rerender();
    }
    public setAudioStreamState(enabled: boolean) {
        console.log(`setAudioStreamState: ${enabled}`);
        this.audioTrackEnabled = enabled;
        for(const state of this.states.values()) {
            for(const track of state.audioTracks) {
                track.enabled = enabled;
            }
        }
        this.rerender();
    }

    public getVideoStreamState() {
        return this.videoTrackEnabled;
    }

    public getAudioStreamState() {
        return this.audioTrackEnabled;
    }

    public static useWebRTCContext(mySessionId: string,roomId: string): WebRTCContext {
        const [sendSignal] = useMutation(SEND_SIGNAL);
        const [webRTCContextValue, setWebRTCContextValue] = useState(
            new WebRTCContext(mySessionId, (toSessionId: string, webrtc: WebRTCIn) => {
                return sendSignal({variables: {roomId,toSessionId,webrtc}});
            })
        );
        webRTCContextValue.set=setWebRTCContextValue;
        return webRTCContextValue;
    }

    private mySessionId: string
    private set?: React.Dispatch<React.SetStateAction<WebRTCContext>>
    private send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>
    private states: Map<string, WebRTCState>
    private constructor(
        mySessionId: string,
        send: (sessionId:string, webRTC: WebRTCIn) => Promise<any>,
        states = new Map<string, WebRTCState>(),
        videoTrackEnabled = true,
        audioTrackEnabled = true,
    ) {
        this.mySessionId = mySessionId;
        this.send = send;
        this.states = states;
        this.videoTrackEnabled = videoTrackEnabled;
        this.audioTrackEnabled = audioTrackEnabled;
        WebRTCContext.streamEmitter.addListener("rerender", () => this.rerender());
    }
    public async notification(webrtc: WebRTC): Promise<void> {
        const sessionId = webrtc.sessionId;
        const state = await this.getOrCreateState(sessionId);
        await state.dispatch(webrtc);
        this.rerender();
    }

    public async sendOffer(sessionId: string): Promise<void> {
        const state = await this.getOrCreateState(sessionId);        
        return state.sendOffer();
    }

    public getMediaStream(sessionId: string) {
        const state = this.states.get(sessionId);
        if(!state) { return; }
        return state.remoteMediaStreams;
    }

    public getMediaStreams(): Array<{sessionId: string, stream: MediaStream}> {
        const results: Array<{sessionId: string, stream: MediaStream}> = [];
        for(const [sessionId, state] of this.states.entries()) {
            if(state.remoteMediaStreams && state.peer.connectionState === "connected") {
                for(const stream of state.remoteMediaStreams) {
                    results.push({sessionId, stream});
                }
            }
        }
        return results;
    }

    public getCamera() {return WebRTCContext.stream;}
    public isCameraReady() {return WebRTCContext.stream !== undefined;}

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId);
        if(!state) {
            state = new WebRTCState(this.mySessionId < sessionId, (webRTC: WebRTCIn) => this.send(sessionId, webRTC), ()=> this.rerender(), WebRTCContext.stream||undefined);
            this.states.set(sessionId, state);
        }
        return state;
    }

    private rerender() {
        if(!this.set) { return; }
        this.set(new WebRTCContext(this.mySessionId, this.send, this.states, this.videoTrackEnabled, this.audioTrackEnabled));
    }
}

const iceServers: RTCIceServer[] = [
    {urls: "turn:turn.kidsloop.net", username: "badanamu", credential: "WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh", credentialType: "password"},
];

class WebRTCState {
    public localMediaStream?: MediaStream;
    public remoteMediaStreams?: readonly MediaStream[] = []
    public videoTracks: MediaStreamTrack[] = [];
    public audioTracks: MediaStreamTrack[] = [];
    public peer: RTCPeerConnection;
    private send: (webRTC: WebRTCIn) => any;
    private rerender:() => any;

    public constructor(polite: boolean, send: (webRTC: WebRTCIn) => any, rerender:()=>any, stream?: MediaStream) {
        this.polite = polite;
        this.rerender = rerender;
        this.send = send;
        this.peer = new RTCPeerConnection({iceServers});
        this.peer.onicegatheringstatechange = async () => {
            if(!this.peer) {return;}
        };
        this.peer.onicecandidate = async ({candidate}) => {
            if(candidate) {
                const ice = JSON.stringify(candidate);
                this.send({ ice });
            }
        };
        this.peer.onconnectionstatechange = () => {
            if(!this.peer) {return;}
            this.rerender();
        };
        this.peer.ontrack = ({streams}) => {
            this.remoteMediaStreams = streams;
            this.rerender();
        };
        this.peer.onnegotiationneeded = async () => {
            const offer = await this.peer.createOffer();
            if (this.peer.signalingState != "stable") return;
            await this.peer.setLocalDescription(offer);
            this.send({description: JSON.stringify(offer)});
        };      
        this.localMediaStream = stream;
        if(this.localMediaStream) {
            for(const track of this.localMediaStream.getTracks()) {
                this.peer.addTrack(track, this.localMediaStream);
                if (track.kind === "video") {
                    this.videoTracks.push(track);
                } else if (track.kind === "audio") {
                    this.audioTracks.push(track);
                }
            }
        }
    }

    //https://www.w3.org/TR/webrtc/#perfect-negotiation-example
    //https://blog.mozilla.org/webrtc/perfect-negotiation-in-webrtc/
    //"Perfect" signaling example does not work on safari, due to required argument in setLocalDescription
    //https://caniuse.com/#feat=mdn-api_rtcpeerconnection_setlocaldescription_optional_description
    private polite: boolean
    private makingOffer = false
    private ignoringdOffer = false
    public async dispatch(webrtc: WebRTCIn): Promise<void> {
        try {
            if(!webrtc) { return; }
            const {description, ice} = webrtc;
            if(description) {
                const remoteDescription = new RTCSessionDescription(JSON.parse(description));
                const collision = (remoteDescription.type == "offer") && (this.peer.signalingState != "stable" || this.makingOffer);
                this.ignoringdOffer = !this.polite && collision;
                if(!this.ignoringdOffer)  {
                    await this.peer.setRemoteDescription(remoteDescription);
                    if(remoteDescription.type === "offer") {
                        await this.peer.setLocalDescription(await this.peer.createAnswer());
                        this.send({description: JSON.stringify(this.peer.localDescription)});
                    }
                }
            }
            if(ice) {
                const candidate = new RTCIceCandidate(JSON.parse(ice));
                try {
                    await this.peer.addIceCandidate(candidate); 
                } catch(e) {
                    if (!this.ignoringdOffer) throw e;
                }
            }
        } catch(e) {
            console.error(e); 
        }
    }

    public async sendOffer() {
        try {
            this.makingOffer = true;
            console.log("Sendings offers");
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer); //Incorrect Typescript types
            this.send({ description: JSON.stringify(this.peer.localDescription) });
        } catch(e) {
            console.error(e);
        } finally {
            this.makingOffer = false;
        }
    }
}

export function Cameras({noBackground, id}:{noBackground?: boolean, id?: string}): JSX.Element {
    const states = useContext(webRTCContext);
    if(!states) {return <FormattedMessage id="error_webrtc_unavailable" />;}
    if(!id) {
        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                {states.getMediaStreams().map(({stream}) => 
                    <Grid item key={stream.id}>
                        <Camera width={340} height={240} mediaStream={stream} />
                    </Grid>
                )}
            </Grid>
        );
    } 
    const camera = states.getMediaStream(id);
    if(camera) {
        return (
            <Grid container item justify="space-around">
                <Camera width={220} height={120} mediaStream={camera[0]} noBackground={noBackground} />
            </Grid>
        );
    }
    return (
        <Grid container justify="space-between" alignItems="center" style={{ width: "100%", height: "100%" }}>
            <Typography style={{ margin: "0 auto" }} variant="caption" align="center"><VideocamOffIcon /></Typography>
        </Grid> 
    );

}

export function Camera({mediaStream, height, width, self, noBackground}:{mediaStream: MediaStream, height: number, width: number, self?: boolean, noBackground?: boolean}): JSX.Element {
    const theme = useTheme();
    const states = useContext(webRTCContext);
    if(!states) {
        console.error("RTC Start button created outside context provider");
        return <FormattedMessage id="error_no_rtc_provider" />;
    }

    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleVideoState = () => {
        const videoState = states.getVideoStreamState();
        console.log(videoState);
        console.log("toggled video");
        states.setVideoStreamState(!videoState);
    };

    const toggleAudioState = () => {
        const audioState = states.getAudioStreamState();
        console.log(audioState);
        console.log("toggled audio");
        states.setAudioStreamState(!audioState);
    };

    useEffect(() => {
        if(!videoRef.current) {return;}
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    return (
        <Card elevation={0} square>
            { mediaStream && mediaStream.getVideoTracks().some((t) => t.enabled) ?
                <CardMedia
                    autoPlay={true}
                    muted={self}
                    component="video"
                    height={self ? height-32 : height}
                    style={{ backgroundColor: noBackground ? "" : "#193d6f" }}
                    ref={videoRef}
                    width={width}
                /> :
                <Typography style={{ backgroundColor: "#193d6f", height: self ? height-32 : height, margin: "0 auto", color: "white" }} align="center">
                    <VideocamOffIcon />
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
                                onClick={toggleVideoState}
                            >
                                {mediaStream.getVideoTracks().some((t) => t.enabled) ? <VideocamIcon color="primary" /> : <VideocamOffIcon color="secondary" />}
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Coming soon" aria-label="tooltip control mic">
                                <IconButton
                                    aria-label="control mic"
                                    component="span"
                                    style={{ color: "black", fontSize: 8, padding: 0 }}
                                    onClick={toggleAudioState}
                                >
                                    {mediaStream.getAudioTracks().some((t) => t.enabled) ? <MicIcon color="primary" /> : <MicOffIcon color="secondary" />}
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardActions> : null }
        </Card>
    );
}

export function MyCamera(): JSX.Element {
    const webrtc = useContext(webRTCContext); 
    const stream = webrtc.getCamera();
    if (stream) {   
        return <Camera mediaStream={stream} width={340} height={240} self />;
    } else {
        return (
            <Grid container justify="space-between" alignItems="center" style={{ width: "100%", height: 240, backgroundColor: "#193d6f" }}>
                <Typography style={{ margin: "0 auto", color: "white", padding: 56 }} align="center">
                    <FormattedMessage id="error_camera_unavailable" />
                </Typography>
            </Grid>
        );
    }
}

export function Stream(props:{sessionId:string, index:number}): JSX.Element {
    const {index, sessionId} = props;
    const webrtc = useContext(webRTCContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if(!videoRef.current) {return;}
        const streams = webrtc.getMediaStream(sessionId);
        if(!streams) {return;}
        if(index >= 0 && index < streams.length) {
            videoRef.current.srcObject = streams[index];
        }
    }, [videoRef.current, webrtc]);
    return <video ref={videoRef}/>;

}