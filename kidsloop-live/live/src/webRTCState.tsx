import React, { useRef, createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
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

    stream?: {name: string, streamId: string}
}


export type WebRTC = WebRTCIn & { sessionId: string }

export const webRTCContext  = createContext<WebRTCContext>(undefined as any);

export class WebRTCContext {
    public videoTrackEnabled: boolean;
    public audioTrackEnabled: boolean;

    public setVideoStreamState(enabled: boolean) {
        this.videoTrackEnabled = enabled;
        if(this.localCamera) {
            for(const track of this.localCamera.getVideoTracks()) {
                track.enabled = enabled;
            }
        }
        this.rerender();
    }
    public setAudioStreamState(enabled: boolean) {
        this.audioTrackEnabled = enabled;
        if(this.localCamera) {
            for(const track of this.localCamera.getAudioTracks()) {
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
            new WebRTCContext(
                mySessionId,
                (toSessionId: string, webrtc: WebRTCIn) => {
                    setImmediate(() => sendSignal({variables: {roomId,toSessionId,webrtc}}));
                }
            )
        );
        webRTCContextValue.set=setWebRTCContextValue;
        return webRTCContextValue;
    }

    private mySessionId: string
    private set?: React.Dispatch<React.SetStateAction<WebRTCContext>>
    private send: (sessionId:string, webRTC: WebRTCIn) => any
    private states: Map<string, WebRTCState>
    private localCamera?: MediaStream;
    private localAux?: MediaStream

    private constructor(
        mySessionId: string,
        send: (sessionId:string, webRTC: WebRTCIn) => any,
        states = new Map<string, WebRTCState>(),
        videoTrackEnabled = true,
        audioTrackEnabled = true,
        localCamera?: MediaStream,
        localAux?: MediaStream,
    ) {
        this.mySessionId = mySessionId;
        this.send = send;
        this.states = states;
        this.videoTrackEnabled = videoTrackEnabled;
        this.audioTrackEnabled = audioTrackEnabled;
        this.localCamera = localCamera;
        this.localAux = localAux;
    }

    public async notification(webrtc: WebRTC): Promise<void> {
        const sessionId = webrtc.sessionId;
        const state = await this.getOrCreateState(sessionId);
        await state.dispatch(webrtc);
    }

    public async sendOffer(sessionId: string): Promise<void> {
        if(this.mySessionId===sessionId) {return;}
        const state = await this.getOrCreateState(sessionId);        
        return state.sendOffer();
    }
    public getCameraStream(sessionId: string) {
        const state = this.states.get(sessionId);
        if(!state) {return;}
        return state.getStream("camera");
    }

    public getAuxStream(sessionId: string) {
        const state = this.states.get(sessionId);
        if(!state) {return;}
        return state.getStream("aux");
    }

    public getMediaStreams(): Array<{sessionId: string, stream: MediaStream}> {
        const results: Array<{sessionId: string, stream: MediaStream}> = [];
        for(const [sessionId, state] of this.states.entries()) {
            if(state.remoteMediaStreams && state.peer.connectionState === "connected") {
                for(const stream of state.remoteMediaStreams.values()) {
                    results.push({sessionId, stream});
                }
            }
        }
        return results;
    }


    public setCamera(stream: MediaStream) {
        this.localCamera = stream;
        for(const state of this.states.values()) {
            state.attachStream("camera", this.localCamera);
        }
    }
    public getCamera() {return this.localCamera;}

    public setAux(stream: MediaStream) {
        this.localAux = stream;
        for(const state of this.states.values()) {
            state.attachStream("aux", this.localAux);
        }
    }
    public getAux() {return this.localAux;}

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId);
        if(!state) {
            state = new WebRTCState(
                this.mySessionId < sessionId,
                (webRTC: WebRTCIn) => this.send(sessionId, webRTC),
                ()=> this.rerender(),
                this.localCamera,
                this.localAux,
            );
            this.states.set(sessionId, state);
        }
        return state;
    }

    private rerender() {
        if(!this.set) { return; }
        this.set(
            new WebRTCContext(
                this.mySessionId,
                this.send,
                this.states,
                this.videoTrackEnabled,
                this.audioTrackEnabled,
                this.localCamera,
                this.localAux,
            )
        );
    }
}

const iceServers: RTCIceServer[] = [
    {urls: "turn:turn.kidsloop.net", username: "badanamu", credential: "WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh", credentialType: "password"},
];

class WebRTCState {
    public remoteMediaStreams: Map<string,MediaStream> = new Map<string, MediaStream>()
    public peer: RTCPeerConnection;
    private send: (webRTC: WebRTCIn) => any;
    private rerender:() => any;
    private senderMap = new Map<string, RTCRtpSender>()
    private remoteStreamNames = new Map<string, string>()
    private localStreamNames = new Map<string, MediaStream>()

    public constructor(polite: boolean, send: (webRTC: WebRTCIn) => any, rerender:()=>any, cameraStream?: MediaStream, auxStream?: MediaStream) {
        this.polite = polite;
        this.rerender = rerender;
        this.send = send;
        this.peer = new RTCPeerConnection({iceServers});
        this.peer.onicecandidate = async ({candidate}) => {
            if(candidate) {
                const ice = JSON.stringify(candidate);
                this.send({ ice });
            }
        };
        this.peer.ontrack = (e) => {
            const {streams} = e;
            for(const stream of streams) {
                this.remoteMediaStreams.set(stream.id, stream);
            }
            this.rerender();//TODO: Fix capture of old state
        };
        this.peer.onnegotiationneeded = async () => {
            try {
                this.makingOffer = true;
                const offer = await this.peer.createOffer();
                if (this.peer.signalingState != "stable") return;
                await this.peer.setLocalDescription(offer);
                this.send({description: JSON.stringify(this.peer.localDescription)});
            } catch(e) {
                console.error(e);
            } finally {
                this.makingOffer = false;
            }
        };
        if(cameraStream) { this.attachStream("camera", cameraStream); }
        if(auxStream) { this.attachStream("aux", auxStream); }
    }

    public attachStream(name: string, stream: MediaStream) {
        const previousStream = this.localStreamNames.get(name);
        if(previousStream) {
            for(const track of previousStream.getTracks()) {
                const sender = this.senderMap.get(track.id);
                if(sender) { this.peer.removeTrack(sender); }
            }
        }
        if(!previousStream || previousStream.id !== stream.id) {
            this.send({stream: {name, streamId: stream.id}});
        }
        this.localStreamNames.set("name", stream);
        for(const track of stream.getTracks()) {
            const sender = this.peer.addTrack(track, stream);
            this.senderMap.set(track.id, sender);
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
            const {description, ice, stream} = webrtc;
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
            if(stream) {
                this.remoteStreamNames.set(stream.name, stream.streamId);
            }
        } catch(e) {
            console.error(e); 
        }
    }

    public async sendOffer() {
        try {
            this.makingOffer = true;
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            this.send({ description: JSON.stringify(this.peer.localDescription) });
        } catch(e) {
            console.error(e);
        } finally {
            this.makingOffer = false;
        }
    }

    public getStream(name: string) {
        const id = this.remoteStreamNames.get(name);
        if(!id) {return;}
        const stream = this.remoteMediaStreams.get(id);
        return stream;
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
    const camera = states.getCameraStream(id);
    if(camera) {
        return (
            <Grid container item justify="space-around">
                <Camera width={220} height={120} mediaStream={camera} noBackground={noBackground} />
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
        states.setVideoStreamState(!videoState);
    };

    const toggleAudioState = () => {
        const audioState = states.getAudioStreamState();
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

export function Stream(props:{sessionId:string}): JSX.Element {
    const {sessionId} = props;
    const webrtc = useContext(webRTCContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if(!videoRef.current) {return;}
        const stream = webrtc.getAuxStream(sessionId);
        if(!stream) {return;}
        videoRef.current.srcObject = stream;
    }, [videoRef.current,webrtc]);
    return <>
        <video style={{width: "100%"}} ref={videoRef} autoPlay playsInline/>
    </>;

}