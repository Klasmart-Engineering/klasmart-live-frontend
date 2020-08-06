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
import { GridOn as CanvasIcon } from "@styled-icons/material-twotone/GridOn";
import { GridOff as CanvasOffIcon } from "@styled-icons/material-twotone/GridOff";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";

import { UserContext } from "./entry";
import { Session } from "./room";
import StyledIcon from "./components/styled/icon";
import NoCamera from "./components/noCamera";
import MoreControls from "./components/moreControls";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";

import { getRandomKind } from './components/trophies/trophyKind';
import { Star as StarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import { WebRTCSFUContext } from "./webrtc/sfu";
import { useSynchronizedState } from "./whiteboard/context-providers/SynchronizedStateProvider";

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

const iceServers: RTCIceServer[] = [
    { urls: "turn:turn.kidsloop.net", username: "badanamu", credential: "WFVZ4myAi3ywy4q0BpPJWTAm8gHOfPRh", credentialType: "password" },
];


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
            {controls && session ? <CameraOverlay mediaStream={mediaStream} session={session} miniMode={miniMode} /> : null}
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

    const states = WebRTCSFUContext.Consume()
    const mediaStreams = states.getAllInboundTracks();
    const { roomId, sessionId } = useContext(UserContext);
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });

    const { actions: { clear } } = useToolbarContext();

    const {
        state: { display },
        actions: { setDisplay },
    } = useSynchronizedState();

    function toggleVideoStates() {
        for (const { sessionId } of mediaStreams) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    video: !camerasOn,
                }
            });
            states.localVideoEnable(sessionId, !camerasOn);
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
            states.localAudioEnable(sessionId, !micsOn);
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
                        color={display ? "primary" : "secondary"}
                        style={{ backgroundColor: display ? "#f6fafe" : "#fef5f9" }}
                        onClick={() => { setDisplay(!display); }}
                    >
                        {display ? <CanvasIcon size="1.5rem" /> : <CanvasOffIcon size="1.5rem" />}
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        {display
                            ? "Hide Whiteboard"
                            : "Show Whiteboard"
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
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "star"); }}
                    >
                        <StarIcon size="1rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Give Star
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "trophy"); }}
                    >
                        <TrophyIcon size="1rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Give Trophy
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, "heart"); }}
                    >
                        <HeartIcon size="1rem" />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        Give Heart
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <IconButton
                        color={"primary"}
                        style={{ backgroundColor: "#f6fafe" }}
                        onClick={() => { rewardTrophy(sessionId, getRandomKind(["awesome", "looks_great", "well_done", "great_job"])); }}
                    >
                        <EncourageIcon size="1rem" />
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

    const states = WebRTCSFUContext.Consume();
    const { roomId } = useContext(UserContext);

    function toggleVideoState() {
        if (global && sessionId && sessionId !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    video: !states.isLocalVideoEnabled(sessionId),
                }
            });
        } else {
            states.localVideoToggle(sessionId);
        }
    }
    function toggleAudioState() {
        if (global && sessionId && sessionId !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId,
                    audio: !states.isLocalAudioEnabled(sessionId),
                }
            });
        } else {
            states.localAudioToggle(sessionId);
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
                    {states.isLocalVideoEnabled(sessionId)
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
                    {states.isLocalAudioEnabled(sessionId)
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

export default function CameraOverlay({ mediaStream, session, miniMode, global }: {
    mediaStream: MediaStream | undefined;
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
    const states = WebRTCSFUContext.Consume()
    const isSelf = session.id === mySessionId;

    function toggleVideoState() {
        if (global && session.id !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    video: !states.isLocalVideoEnabled(session.id),
                }
            });
        } else {
            states.localVideoToggle(session.id);
        }
    }

    function toggleAudioState() {
        if (global && session.id !== mySessionId) {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    audio: !states.isLocalAudioEnabled(session.id),
                }
            });
        } else {
            states.localAudioToggle(session.id);
        }
    }

    return (
        <div className={root} style={!mediaStream ? { background: "transparent" } : undefined}>
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
                        {mediaStream ? <>
                            <Tooltip
                                arrow
                                aria-label="camera control button tooltip"
                                placement={"top"}
                                title={states.isLocalVideoEnabled(session.id)
                                    ? <FormattedMessage id="turn_off_camera" />
                                    : <FormattedMessage id="turn_on_camera" />
                                }
                            >
                                <IconButton
                                    aria-label="camera control button"
                                    onClick={toggleVideoState}
                                    size={isSmUp ? "medium" : "small"}
                                    className={states.isLocalVideoEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={miniMode ? {
                                        margin: theme.spacing(1),
                                        padding: theme.spacing(0.5)
                                    } : undefined}
                                >
                                    {states.isLocalVideoEnabled(session.id) ?
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
                                title={states.isLocalAudioEnabled(session.id)
                                    ? <FormattedMessage id="turn_off_mic" />
                                    : <FormattedMessage id="turn_on_mic" />
                                }
                            >
                                <IconButton
                                    aria-label="mic control button"
                                    onClick={toggleAudioState}
                                    size={isSmUp ? "medium" : "small"}
                                    className={states.isLocalAudioEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={miniMode ? {
                                        margin: theme.spacing(1),
                                        padding: theme.spacing(0.5)
                                    } : undefined}
                                >
                                    {states.isLocalAudioEnabled(session.id) ?
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
                        </> : null}

                    </Grid>
                </Grid>
                {(!teacher || isSelf || miniMode) ? null :
                    <MoreControls session={session} selfUserId={mySessionId} forOverlay={true} />}
            </Grid>
        </div>
    )
}
