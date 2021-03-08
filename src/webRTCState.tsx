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

import { Session } from "./pages/room/room";
import StyledIcon from "./components/styled/icon";
import { MoreControlsButton } from "./components/media/camera";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";

import { getRandomKind } from './components/trophies/trophyKind';
import { Star as StarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import { MuteNotification, WebRTCSFUContext } from "./webrtc/sfu";
import { useSynchronizedState } from "./whiteboard/context-providers/SynchronizedStateProvider";
import { LocalSessionContext } from "./entry";
import { isElementInViewport } from "./utils/viewport";

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

    const states = WebRTCSFUContext.Consume()
    const mediaStreams = states.getAllInboundTracks();
    const { roomId, sessionId } = useContext(LocalSessionContext);
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });

    const { actions: { clear } } = useToolbarContext();

    const {
        state: { display },
        actions: { setDisplay },
    } = useSynchronizedState();

    function toggleVideoStates() {
        for (const { sessionId, stream } of mediaStreams) {
            if (stream) {
                let videoTracks = stream.getVideoTracks()
                if (videoTracks && videoTracks.length > 0) {
                    for (const consumerId of videoTracks.map((t) => t.id)) {
                        let notification: MuteNotification = {
                            roomId,
                            sessionId,
                            consumerId,
                            video: !camerasOn
                        }
                        states.sendMute(notification);
                    }
                }
            }
            states.localVideoEnable(sessionId, !camerasOn);
        }
        setCamerasOn(!camerasOn);
    }

    function toggleAudioStates() {
        for (const { sessionId, stream } of mediaStreams) {
            if (stream) {
                let audioTracks = stream.getAudioTracks()
                if (audioTracks && audioTracks.length > 0) {
                    for (const consumerId of audioTracks.map((t) => t.id)) {
                        let notification: MuteNotification = {
                            roomId,
                            sessionId,
                            consumerId,
                            audio: !micsOn
                        }
                        states.sendMute(notification);
                    }
                }
            }
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
            <Grid container item xs={3} md={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={camerasOn
                            ? <FormattedMessage id="set_cameras_off" />
                            : <FormattedMessage id="set_cameras_on" />
                        }
                    >
                        <IconButton
                            color={camerasOn ? "primary" : "secondary"}
                            style={{ backgroundColor: camerasOn ? "#f6fafe" : "#fef5f9" }}
                            onClick={toggleVideoStates}
                        >
                            {camerasOn ? <CameraIcon size="1rem" /> : <CameraOffIcon size="1rem" />}
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} md={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={micsOn
                            ? <FormattedMessage id="mute_all" />
                            : <FormattedMessage id="unmute_all" />
                        }
                    >
                        <IconButton
                            color={micsOn ? "primary" : "secondary"}
                            style={{ backgroundColor: micsOn ? "#f6fafe" : "#fef5f9" }}
                            onClick={toggleAudioStates}
                        >
                            {micsOn ? <MicIcon size="1rem" /> : <MicOffIcon size="1rem" />}
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} md={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={display
                            ? <FormattedMessage id="hide_whiteboard" />
                            : <FormattedMessage id="show_whiteboard" />
                        }
                    >
                        <IconButton
                            color={display ? "primary" : "secondary"}
                            style={{ backgroundColor: display ? "#f6fafe" : "#fef5f9" }}
                            onClick={() => { setDisplay(!display); }}
                        >
                            {display ? <CanvasIcon size="1rem" /> : <CanvasOffIcon size="1rem" />}
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} md={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={<FormattedMessage id="clear_whiteboard" />}
                    >
                        <IconButton
                            color={"primary"}
                            style={{ backgroundColor: "#f6fafe" }}
                            onClick={() => { clear(); }}
                        >
                            <EraserIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={<FormattedMessage id="give_star" />}
                    >
                        <IconButton
                            color={"primary"}
                            style={{ backgroundColor: "#f6fafe" }}
                            onClick={() => { rewardTrophy(sessionId, "star"); }}
                        >
                            <StarIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={<FormattedMessage id="give_trophy" />}
                    >
                        <IconButton
                            color={"primary"}
                            style={{ backgroundColor: "#f6fafe" }}
                            onClick={() => { rewardTrophy(sessionId, "trophy"); }}
                        >
                            <TrophyIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={<FormattedMessage id="give_heart" />}
                    >
                        <IconButton
                            color={"primary"}
                            style={{ backgroundColor: "#f6fafe" }}
                            onClick={() => { rewardTrophy(sessionId, "heart"); }}
                        >
                            <HeartIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container item xs={3} style={{ textAlign: "center" }}>
                <Grid item xs={12}>
                    <Tooltip
                        arrow
                        placement="top"
                        title={<FormattedMessage id="encourage" />}
                    >
                        <IconButton
                            color={"primary"}
                            style={{ backgroundColor: "#f6fafe" }}
                            onClick={() => { rewardTrophy(sessionId, getRandomKind(["awesome", "looks_great", "well_done", "great_job"])); }}
                        >
                            <EncourageIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    );
}
