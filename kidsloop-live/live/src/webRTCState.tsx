import React, { useRef, createContext, useContext, useEffect, useState, useReducer } from "react";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Theme, useTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

import { Videocam as CameraIcon } from "@styled-icons/material-twotone/Videocam";
import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import { Mic as MicIcon } from "@styled-icons/material-twotone/Mic";
import { MicOff as MicOffIcon } from "@styled-icons/material-twotone/MicOff";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";

import { UserContext } from "./entry";
import { Session } from "./room";
import StyledIcon from "./components/styled/icon";
import NoCamera from "./components/noCamera";
import { useWhiteboard } from "./whiteboard/context-provider/WhiteboardContextProvider";
import MoreControls from "./components/moreControls";

import { getRandomKind } from './components/trophies/trophyKind';
import { Star as StarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";

const SEND_SIGNAL = gql`
  mutation webRTCSignal($roomId: ID!, $toSessionId: ID!, $webrtc: WebRTCIn) {
    webRTCSignal(roomId: $roomId, toSessionId: $toSessionId, webrtc: $webrtc)
  }
`;


export interface WebRTCIn {
    description?: string
    ice?: string

    stream?: { name: string, streamId: string }
}


export type WebRTC = WebRTCIn & { sessionId: string }

export const webRTCContext = createContext<WebRTCContext>(undefined as any);

export class WebRTCContext {
    public videoTrackEnabled: boolean;
    public audioTrackEnabled: boolean;

    public setVideoStreamState(sessionId?: string, enabled?: boolean) {
        if (sessionId && sessionId !== this.mySessionId) {
            const state = this.states.get(sessionId);
            if (!state) { return; }
            state.muteCamera(undefined, typeof enabled === "boolean" ? enabled : !state.videoTrackEnabled);
        } else {
            this.videoTrackEnabled = typeof enabled === "boolean" ? enabled : !this.videoTrackEnabled;
            if (this.localCamera) {
                for (const track of this.localCamera.getVideoTracks()) {
                    track.enabled = this.videoTrackEnabled;
                }
            }
        }
        this.rerender();
    }
    public setAudioStreamState(sessionId?: string, enabled?: boolean) {
        if (sessionId && sessionId !== this.mySessionId) {
            const state = this.states.get(sessionId);
            if (!state) { return; }
            state.muteCamera(typeof enabled === "boolean" ? enabled : !state.audioTrackEnabled, undefined);
        } else {
            this.audioTrackEnabled = typeof enabled === "boolean" ? enabled : !this.audioTrackEnabled;
            if (this.localCamera) {
                for (const track of this.localCamera.getAudioTracks()) {
                    track.enabled = this.audioTrackEnabled;
                }
            }
        }
        this.rerender();
    }

    public getVideoStreamState(sessionId?: string) {
        if (!sessionId || sessionId === this.mySessionId) { return this.videoTrackEnabled; }

        const state = this.states.get(sessionId);
        if (!state) { return; }

        return state.videoTrackEnabled;
    }

    public getAudioStreamState(sessionId?: string) {
        if (!sessionId || sessionId === this.mySessionId) { return this.audioTrackEnabled; }

        const state = this.states.get(sessionId);
        if (!state) { return; }

        return state.audioTrackEnabled;
    }

    public static useWebRTCContext(mySessionId: string, roomId: string): WebRTCContext {
        const [sendSignal] = useMutation(SEND_SIGNAL);
        const [state, rerender] = useReducer(
            ({ value }) => ({ value }),
            {
                value: new WebRTCContext(
                    mySessionId,
                    (toSessionId: string, webrtc: WebRTCIn) => setImmediate(() => sendSignal({ variables: { roomId, toSessionId, webrtc } }))
                )
            }
        );
        state.value._rerender = rerender;
        return state.value;
    }

    private mySessionId: string
    private _rerender?: React.DispatchWithoutAction
    private send: (sessionId: string, webRTC: WebRTCIn) => any
    private states: Map<string, WebRTCState>
    private localCamera?: MediaStream | null;
    private localAux?: MediaStream

    private constructor(
        mySessionId: string,
        send: (sessionId: string, webRTC: WebRTCIn) => any,
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
        if (!state) { return; } //TODO how to handle late connects?
        state.muteCamera(audio, video);
    }

    public async notification(webrtc: WebRTC): Promise<void> {
        const sessionId = webrtc.sessionId;
        const state = await this.getOrCreateState(sessionId);
        await state.dispatch(webrtc);
    }

    public async sendOffer(sessionId: string): Promise<void> {
        if (this.mySessionId === sessionId) { return; }
        const state = await this.getOrCreateState(sessionId);
        return state.sendOffer();
    }

    public getCameraStream(sessionId: string) {
        const state = this.states.get(sessionId);
        if (!state) { return; }
        return state.getStream("camera");
    }

    public getAuxStream(sessionId: string) {
        const state = this.states.get(sessionId);
        if (!state) { return; }
        return state.getStream("aux");
    }

    public getMediaStreams(): Array<{ sessionId: string, stream: MediaStream }> {
        const results: Array<{ sessionId: string, stream: MediaStream }> = [];
        for (const [sessionId, state] of this.states.entries()) {
            if (state.remoteMediaStreams && state.peer.connectionState === "connected") {
                for (const stream of state.remoteMediaStreams.values()) {
                    results.push({ sessionId, stream });
                }
            }
        }
        return results;
    }

    public setCamera(stream: MediaStream | null) {
        this.localCamera = stream;
        if (stream) {
            for (const state of this.states.values()) {
                state.attachStream("camera", stream);
            }
        }
        this.rerender();
    }

    public getCamera() { return this.localCamera; }

    public setAux(stream?: MediaStream) {
        this.localAux = stream;
        if (stream) {
            for (const state of this.states.values()) {
                state.attachStream("aux", stream);
            }
        }
        this.rerender();
    }

    public getAux() { return this.localAux; }

    private async getOrCreateState(sessionId: string): Promise<WebRTCState> {
        let state = this.states.get(sessionId);
        if (!state) {
            state = new WebRTCState(
                this.mySessionId < sessionId,
                (webRTC: WebRTCIn) => this.send(sessionId, webRTC),
                () => this.rerender(),
                this.localCamera || undefined,
                this.localAux,
            );
            this.states.set(sessionId, state);
        }
        return state;
    }

    private rerender() {
        if (this._rerender) { this._rerender(); }
    }
}

const iceServers: RTCIceServer[] = [
    { urls: "turn:turn.kidsloop.net", username: "badanamu", credential: "WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh", credentialType: "password" },
];

class WebRTCState {
    public remoteMediaStreams: Map<string, MediaStream> = new Map<string, MediaStream>()
    public peer: RTCPeerConnection;
    private send: (webRTC: WebRTCIn) => any;
    private rerender: () => any;
    private senderMap = new Map<string, RTCRtpSender>()
    private remoteStreamNames = new Map<string, string>()
    private localStreamNames = new Map<string, MediaStream>()

    public videoTrackEnabled = true;
    public audioTrackEnabled = true;

    public constructor(polite: boolean, send: (webRTC: WebRTCIn) => any, rerender: () => any, cameraStream?: MediaStream, auxStream?: MediaStream) {
        this.polite = polite;
        this.rerender = rerender;
        this.send = send;
        this.peer = new RTCPeerConnection({ iceServers });
        this.peer.onicecandidate = async ({ candidate }) => {
            if (candidate) {
                const ice = JSON.stringify(candidate);
                this.send({ ice });
            }
        };
        this.peer.ontrack = (e) => {
            const { streams } = e;
            for (const stream of streams) {
                for (const track of stream.getTracks()) {
                    track.onunmute = () => this.rerender();
                    track.onmute = () => this.rerender();
                }
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
                this.send({ description: JSON.stringify(this.peer.localDescription) });
            } catch (e) {
                console.error(e);
            } finally {
                this.makingOffer = false;
            }
        };
        if (cameraStream) { this.attachStream("camera", cameraStream); }
        if (auxStream) { this.attachStream("aux", auxStream); }
    }

    public attachStream(name: string, stream: MediaStream) {
        const previousStream = this.localStreamNames.get(name);
        if (previousStream) {
            for (const track of previousStream.getTracks()) {
                const sender = this.senderMap.get(track.id);
                if (sender) { this.peer.removeTrack(sender); }
            }
        }
        if (!previousStream || previousStream.id !== stream.id) {
            this.send({ stream: { name, streamId: stream.id } });
        }
        this.localStreamNames.set(name, stream);
        for (const track of stream.getTracks()) {
            if (track.kind === "video") { track.enabled = this.videoTrackEnabled; }
            if (track.kind === "audio") { track.enabled = this.audioTrackEnabled; }

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
            if (!webrtc) { return; }
            const { description, ice, stream } = webrtc;
            if (description) {
                const remoteDescription = new RTCSessionDescription(JSON.parse(description));
                const collision = (remoteDescription.type == "offer") && (this.peer.signalingState != "stable" || this.makingOffer);
                this.ignoringdOffer = !this.polite && collision;
                if (!this.ignoringdOffer) {
                    await this.peer.setRemoteDescription(remoteDescription);
                    if (remoteDescription.type === "offer") {
                        await this.peer.setLocalDescription(await this.peer.createAnswer());
                        this.send({ description: JSON.stringify(this.peer.localDescription) });
                    }
                }
            }
            if (ice) {
                const candidate = new RTCIceCandidate(JSON.parse(ice));
                try {
                    await this.peer.addIceCandidate(candidate);
                } catch (e) {
                    if (!this.ignoringdOffer) throw e;
                }
            }
            if (stream) {
                this.remoteStreamNames.set(stream.name, stream.streamId);
            }
        } catch (e) {
            console.error(e);
        }
    }


    public async sendOffer() {
        try {
            this.makingOffer = true;
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
            this.send({ description: JSON.stringify(this.peer.localDescription) });
        } catch (e) {
            console.error(e);
        } finally {
            this.makingOffer = false;
        }
    }

    public getStream(name: string) {
        const id = this.remoteStreamNames.get(name);
        if (!id) { return; }
        const stream = this.remoteMediaStreams.get(id);
        return stream;
    }

    public muteCamera(audio?: boolean, video?: boolean) {
        const camera = this.getStream("camera");
        if (!camera) { return; }

        if (typeof audio === "boolean") {
            this.audioTrackEnabled = audio;
            for (const track of camera.getAudioTracks()) {
                track.enabled = audio;
            }
        }
        if (typeof video === "boolean") {
            this.videoTrackEnabled = video;
            for (const track of camera.getVideoTracks()) {
                track.enabled = video;
            }
        }

        this.rerender();
    }
}

export function Camera(props: {
    session?: Session,
    controls?: boolean,
    miniMode?: boolean,
    mediaStream?: MediaStream,
    height?: number | string,
    muted?: boolean,
    backgroundColor?: string,
    square?: boolean,
}): JSX.Element {
    const { session, controls, miniMode, mediaStream, muted, backgroundColor, square } = props;
    const theme = useTheme();
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current || !mediaStream) { return; }
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    return (
        // <CameraOverlay /> needs the parent div that has position: "relative"
        <div style={{ position: "relative", width: "100%" }}>
            <Paper
                component="div"
                elevation={2}
                style={{
                    backgroundColor: "#193d6f",
                    borderRadius: square ? 0 : 12,
                    height: 0,
                    marginBottom: controls ? 0 : theme.spacing(2),
                    position: "relative",
                    paddingBottom: square ? "75%" : "56.25%",
                    margin: "unset"
                }}
            >
                {mediaStream ?
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
                            color: "#FFF",
                            top: "50%",
                            left: "50%",
                            marginRight: "-50%",
                            position: "absolute",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <CameraOffIcon size="1.5rem" />
                    </Typography>
                }
            </Paper>
            {mediaStream && controls && session ? <CameraOverlay session={session} miniMode={miniMode} /> : null}
        </div>
    );
}

export function Stream(props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>): JSX.Element {
    const { stream, ...videoProps } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current) { return; }
        if (!stream) { return; }
        videoRef.current.srcObject = stream;
    }, [videoRef.current, stream]);
    return <video style={{ width: "100%" }} ref={videoRef} autoPlay playsInline  {...videoProps} />;
}

const MUTATION_REWARD_TROPHY = gql`
mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
}
`;

export function GlobalCameraControl(): JSX.Element {
    const theme = useTheme();
    const [camerasOn, setCamerasOn] = useState(true);
    const [micsOn, setMicsOn] = useState(true);

    const [mute, { loading, error }] = useMutation(gql`
        mutation mute($roomId: ID!, $sessionId: ID!, $audio: Boolean, $video: Boolean) {
            mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video)
        }
    `);

    const states = useContext(webRTCContext);
    const mediaStreams = states.getMediaStreams();
    const { roomId, sessionId } = useContext(UserContext);
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });

    const { actions: { clear } } = useWhiteboard();

    function toggleVideoStates() {
        for (const { sessionId } of mediaStreams) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    video: !camerasOn,
                }
            });
            states.setVideoStreamState(sessionId, !camerasOn);
        }
        setCamerasOn(!camerasOn);
    }

    function toggleAudioStates() {
        for (const { sessionId } of mediaStreams) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    audio: !micsOn,
                }
            });
            states.setAudioStreamState(sessionId, !micsOn);
        }
        setMicsOn(!micsOn);
    }

    return (
        <Grid container direction="row" justify="center" alignItems="center" spacing={2} style={{ flexGrow: 0, padding: theme.spacing(2) }}>
            <Grid item xs={12}>
                <Typography variant="caption">
                    <FormattedMessage id="quick_toggles" />
                </Typography>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={camerasOn ? "primary" : "secondary"}
                        style={{ backgroundColor: camerasOn ? "#f6fafe" : "#fef5f9" }}
                        onClick={toggleVideoStates}
                    >
                        {camerasOn ? <CameraIcon size="1.5rem" /> : <CameraOffIcon size="1.5rem" />}
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        {camerasOn
                            ? <FormattedMessage id="set_cameras_off" />
                            : <FormattedMessage id="set_cameras_on" />
                        }
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={micsOn ? "primary" : "secondary"}
                        style={{ backgroundColor: micsOn ? "#f6fafe" : "#fef5f9" }}
                        onClick={toggleAudioStates}
                    >
                        {micsOn ? <MicIcon size="1.5rem" /> : <MicOffIcon size="1.5rem" />}
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        {micsOn
                            ? <FormattedMessage id="mute_all" />
                            : <FormattedMessage id="unmute_all" />
                        }
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { clear(); }}
                    >
                        <EraserIcon size="1.5rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Clear Whiteboard
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "star"); }}
                    >
                        <StarIcon size="1.5rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Reward Star
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "trophy"); }}
                    >
                        <TrophyIcon size="1.5rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Reward Trophy
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "heart"); }}
                    >
                        <HeartIcon size="1.5rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Reward Heart
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} md={4} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, getRandomKind(["awesome", "looks_great", "well_done", "great_job"])); }}
                    >
                        <EncourageIcon size="1.5rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Encourage
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

// TODO: It would be great to integrate with CameraControls in CameraOverlay and reuse as components.
export function CameraControls(props: { global?: boolean, sessionId?: string }): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { global, sessionId } = props;
    const { sessionId: mySessionId } = useContext(UserContext);
    const [mute, { loading, error }] = useMutation(gql`
        mutation mute($roomId: ID!, $sessionId: ID!, $audio: Boolean, $video: Boolean) {
            mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video)
        }
    `);

    const states = useContext(webRTCContext);
    const { roomId } = useContext(UserContext);

    function toggleVideoState() {
        if (global && sessionId !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    video: !states.getVideoStreamState(sessionId),
                }
            });
        } else {
            states.setVideoStreamState(sessionId);
        }
    }
    function toggleAudioState() {
        if (global && sessionId !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    audio: !states.getAudioStreamState(sessionId),
                }
            });
        } else {
            states.setAudioStreamState(sessionId);
        }
    }

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item
            xs={8}
        >
            <Grid item>
                <IconButton
                    aria-label="control camera"
                    component="span"
                    onClick={toggleVideoState}
                    size="small"
                >
                    {states.getVideoStreamState(sessionId)
                        ? <StyledIcon icon={<CameraIcon />} size={isSmDown ? "small" : "medium"} color="#0E78D5" />
                        : <StyledIcon icon={<CameraOffIcon />} size={isSmDown ? "small" : "medium"} color="#F44336" />
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
                    {states.getAudioStreamState(sessionId)
                        ? <StyledIcon icon={<MicIcon />} size={isSmDown ? "small" : "medium"} color="#0E78D5" />
                        : <StyledIcon icon={<MicOffIcon />} size={isSmDown ? "small" : "medium"} color="#F44336" />
                    }
                </IconButton>
            </Grid>
        </Grid>
    );
}

/**
 * CameraOverlay style detail
 *         | Info spacing | Controls spacing | Button |  Icon  |
 * Desktop |       1      |         2        | medium | medium |   
 * Tablet  |      0.5     |         1        | medium | medium |
 * Mobile  |      0.5     |         1        |  small |  small |
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: `linear-gradient(
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0) 16%,
                rgba(0, 0, 0, 0.3))
            `,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            width: "100%",
        },
        iconBtn: {
            border: "1px solid white",
            margin: theme.spacing(0, 2),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        iconOffBtn: {
            border: "1px solid #dc004e",
            margin: theme.spacing(0, 2),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        icon: {
            "&:hover": {
                color: "white"
            }
        },
        iconOff: {
            "&:hover": {
                color: "red"
            }
        },
        infoContainer: {
            textAlign: "center",
            height: "15%",
            padding: theme.spacing(1),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(0.5),
            },
        },
        controlsContainer: {
            height: "85%",
            padding: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1),
            },
            opacity: 0,
            transition: ".3s ease",
            "&:hover": {
                opacity: 1
            }
        },
    })
);

export default function CameraOverlay({ session, miniMode, global }: {
    session: Session;
    miniMode?: boolean;
    global?: boolean;
}) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
    const { root, iconBtn, iconOffBtn, icon, iconOff, infoContainer, controlsContainer } = useStyles();

    const { roomId, teacher, sessionId: mySessionId } = useContext(UserContext);
    const [mute, { loading, error }] = useMutation(gql`
    mutation mute($roomId: ID!, $sessionId: ID!, $audio: Boolean, $video: Boolean) {
        mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video)
    }
    `);
    const states = useContext(webRTCContext);
    const isSelf = session.id === mySessionId;

    function toggleVideoState() {
        if (global && session.id !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    video: !states.getVideoStreamState(session.id),
                }
            });
        } else {
            states.setVideoStreamState(session.id);
        }
    }

    function toggleAudioState() {
        if (global && session.id !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    audio: !states.getAudioStreamState(session.id),
                }
            });
        } else {
            states.setAudioStreamState(session.id);
        }
    }

    return (
        <div className={root}>
            <Grid
                container
                direction="row"
                justify="space-between"
                style={{ height: "100%" }}
            >
                {/* User name */}
                <Grid item xs={12} className={infoContainer}>
                    {miniMode ? null :
                        <Tooltip
                            arrow
                            aria-label="user name tooltip"
                            placement={"top"}
                            title={session.name ? session.name : <FormattedMessage id="error_unknown_user" />}
                        >
                            <Typography
                                component="p"
                                variant={isSmDown ? "caption" : "body1"}
                                noWrap
                                style={{ color: "white" }}
                            >
                                {!session.name ? <FormattedMessage id="error_unknown_user" /> : (
                                    isSelf ? "You" : session.name
                                )}
                            </Typography>
                        </Tooltip>
                    }
                </Grid>

                {/* Camera Controls */}
                <Grid
                    container
                    direction="column"
                    justify={miniMode ? "flex-start" : "flex-end"}
                    item
                    xs={12}
                    className={controlsContainer}
                    style={miniMode ? {
                        padding: theme.spacing(1),
                        paddingTop: theme.spacing(2),
                    } : undefined}
                >
                    <Grid container justify="center" item>
                        <Tooltip
                            arrow
                            aria-label="camera control button tooltip"
                            placement={"top"}
                            title={states.getVideoStreamState(session.id)
                                ? <FormattedMessage id="turn_off_camera" />
                                : <FormattedMessage id="turn_on_camera" />
                            }
                        >
                            <IconButton
                                aria-label="camera control button"
                                onClick={toggleVideoState}
                                size={isSmUp ? "medium" : "small"}
                                className={states.getVideoStreamState(session.id) ? iconBtn : iconOffBtn}
                                style={miniMode ? {
                                    margin: theme.spacing(1),
                                    padding: theme.spacing(0.5)
                                } : undefined}
                            >
                                {states.getVideoStreamState(session.id) ?
                                    <StyledIcon
                                        icon={<CameraIcon className={icon} />}
                                        size={isSmUp ? "medium" : "small"}
                                        color="white"
                                    /> :
                                    <StyledIcon
                                        icon={<CameraOffIcon className={iconOff} />}
                                        size={isSmUp ? "medium" : "small"}
                                        color="red"
                                    />
                                }
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            arrow
                            aria-label="mic control button tooltip"
                            placement="top"
                            title={states.getAudioStreamState(session.id)
                                ? <FormattedMessage id="turn_off_mic" />
                                : <FormattedMessage id="turn_on_mic" />
                            }
                        >
                            <IconButton
                                aria-label="mic control button"
                                onClick={toggleAudioState}
                                size={isSmUp ? "medium" : "small"}
                                className={states.getAudioStreamState(session.id) ? iconBtn : iconOffBtn}
                                style={miniMode ? {
                                    margin: theme.spacing(1),
                                    padding: theme.spacing(0.5)
                                } : undefined}
                            >
                                {states.getAudioStreamState(session.id) ?
                                    <StyledIcon
                                        icon={<MicIcon className={icon} />}
                                        size={isSmUp ? "medium" : "small"}
                                        color="white"
                                    /> :
                                    <StyledIcon
                                        icon={<MicOffIcon className={iconOff} />}
                                        size={isSmUp ? "medium" : "small"}
                                        color="red"
                                    />
                                }
                            </IconButton>
                        </Tooltip>

                        {(!teacher || isSelf || miniMode) ? null :
                            <MoreControls session={session} selfUserId={mySessionId} forOverlay={true} />
                        }
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
