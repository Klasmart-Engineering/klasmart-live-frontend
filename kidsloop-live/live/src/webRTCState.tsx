import React, { useRef, createContext, useContext, useEffect, useState, useReducer } from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import NoCamera from "./components/noCamera";
import Paper from "@material-ui/core/Paper";

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

    public setVideoStreamState(enabled?: boolean) {
        this.videoTrackEnabled = enabled !== undefined ? enabled : !this.videoTrackEnabled;
        if(this.localCamera) {
            for(const track of this.localCamera.getVideoTracks()) {
                track.enabled = this.videoTrackEnabled;
            }
        }
        this.rerender();
    }
    public setAudioStreamState(enabled?: boolean) {
        this.audioTrackEnabled = enabled !== undefined ? enabled : !this.audioTrackEnabled;
        if(this.localCamera) {
            for(const track of this.localCamera.getAudioTracks()) {
                track.enabled = this.audioTrackEnabled;
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
        const [state, rerender] = useReducer(
            ({value}) => ({value}),
            {
                value: new WebRTCContext(
                    mySessionId,
                    (toSessionId: string, webrtc: WebRTCIn) => setImmediate(() => sendSignal({variables: {roomId,toSessionId,webrtc}}))
                )
            }
        );
        state.value._rerender=rerender;
        return state.value;
    }

    private mySessionId: string
    private _rerender?: React.DispatchWithoutAction
    private send: (sessionId:string, webRTC: WebRTCIn) => any
    private states: Map<string, WebRTCState>
    private localCamera?: MediaStream | null;
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

    public mute(sessionId: string, audio?: boolean, video?: boolean) {
        const state = this.states.get(sessionId);
        if(!state) {return;} //TODO how to handle late connects?
        state.muteStream("camera",audio,video); 
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

    public setCamera(stream: MediaStream | null) {
        this.localCamera = stream;
        if(stream) {
            for(const state of this.states.values()) {
                state.attachStream("camera", stream);
            }
        }
        this.rerender();
    }

    public getCamera() {return this.localCamera;}

    public setAux(stream: MediaStream) {
        this.localAux = stream;
        for(const state of this.states.values()) {
            state.attachStream("aux", this.localAux);
        }
        this.rerender();
    }

    public getAux() {return this.localAux;}

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId);
        if(!state) {
            state = new WebRTCState(
                this.mySessionId < sessionId,
                (webRTC: WebRTCIn) => this.send(sessionId, webRTC),
                ()=> this.rerender(),
                this.localCamera||undefined,
                this.localAux,
            );
            this.states.set(sessionId, state);
        }
        return state;
    }

    private rerender() {
        if(this._rerender) { this._rerender(); }
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
    
    public muteStream(streamName: string,audio?: boolean, video?: boolean) {
        const camera = this.getStream(streamName);
        if(!camera) {return;} //TODO: How to handle late camera
        if(audio !== undefined) {
            for(const track of camera.getAudioTracks()) {
                track.enabled = audio;
            }
        }
        if(video !== undefined) {
            for(const track of camera.getVideoTracks()) {
                track.enabled = video;
            }
        }
    }
}

export function Cameras({backgroundColor, id}:{backgroundColor?: string, id?: string}): JSX.Element {
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
                        <Camera height={240} mediaStream={stream} />
                    </Grid>
                )}
            </Grid>
        );
    } 
    const camera = states.getCameraStream(id);
    if(camera) {
        return (
            <Grid container item justify="space-around">
                <Camera height={120} mediaStream={camera} backgroundColor={backgroundColor} />
            </Grid>
        );
    }
    return (
        <Grid container justify="space-between" alignItems="center" style={{ width: "100%", height: "100%" }}>
            <Typography style={{ margin: "0 auto" }} variant="caption" align="center"><VideocamOffIcon /></Typography>
        </Grid> 
    );

}

export function Camera(props: {
    mediaStream?: MediaStream,
    height?: number | string,
    controls?: boolean,
    muted?: boolean,
    backgroundColor?: string,
    square?: boolean,
}): JSX.Element {
    const { mediaStream, controls, muted, backgroundColor, square } = props;
    const theme = useTheme();
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if(!videoRef.current || !mediaStream) {return;}
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    return (
        <Paper 
            component="div" 
            elevation={2} 
            style={{
                backgroundColor: "#193d6f",
                borderRadius: square ? 0 : 12, 
                height: 0,
                marginBottom: controls ? 0 : theme.spacing(2),
                position: "relative", 
                paddingBottom: square ? "75%" : "56.25%" 
            }}
        >
            { mediaStream && mediaStream.getVideoTracks().some((t) => t.enabled) ?
                <video 
                    autoPlay={true} 
                    muted={muted}
                    playsInline
                    style={{
                        backgroundColor: backgroundColor || "#193d6f", 
                        borderRadius: square ? 0 : 12, 
                        objectFit: "cover", 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        height: "100%",
                        width: "100%", 
                    }} 
                    ref={videoRef} 
                /> :
                <Typography 
                    align="center"
                    style={{ 
                        color: "white",
                        top: "50%",
                        left: "50%",
                        marginRight: "-50%",
                        position: "absolute",
                        transform: "translate(-50%, -50%)",
                    }} 
                >
                    <VideocamOffIcon />
                </Typography>
            }
        </Paper>
    );
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

export function CameraControls(): JSX.Element {
    const states = useContext(webRTCContext);

    const toggleVideoState = () => states.setVideoStreamState();

    const toggleAudioState = () =>  states.setAudioStreamState();

    return (
        <Grid container justify="space-evenly" alignItems="center">
            <Grid item>
                <IconButton
                    aria-label="control camera"
                    component="span"
                    onClick={toggleVideoState}
                    size="small"
                >
                    {states.getVideoStreamState()
                        ? <VideocamIcon color="primary" />
                        : <VideocamOffIcon color="secondary" />
                    }
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control mic"
                    component="span"
                    onClick={toggleAudioState}
                    size="small"
                >
                    {states.getAudioStreamState()
                        ? <MicIcon color="primary" />
                        : <MicOffIcon color="secondary" />
                    }
                </IconButton>
            </Grid>
        </Grid>
    );
}

export function MyCamera({ height }: {
    height?: number
}): JSX.Element {
    const HEIGHT = 120;
    const webrtc = useContext(webRTCContext);
    const stream = webrtc.getCamera();
    if (stream) {   
        return (
            <Camera
                muted
                controls
                mediaStream={stream}
                height={height ? height : HEIGHT}
                square
            />
        );
    } else {
        return <NoCamera messageId="error_camera_unavailable" />;
    }
}
