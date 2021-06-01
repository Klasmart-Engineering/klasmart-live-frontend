import { gql, useMutation, useQuery } from "@apollo/client";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { getRandomKind } from './components/trophies/trophyKind';
import { Session } from "./pages/room/room";
import { GlobalMuteNotification, GLOBAL_MUTE_MUTATION, GLOBAL_MUTE_QUERY, WebRTCContext } from "./providers/WebRTCContext";
import { useSynchronizedState } from "./whiteboard/context-providers/SynchronizedStateProvider";
import { SESSION_LINK_LIVE } from "./context-provider/live-session-link-context";

import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { GridOff as CanvasOffIcon } from "@styled-icons/material-twotone/GridOff";
import { GridOn as CanvasIcon } from "@styled-icons/material-twotone/GridOn";
import { Mic as MicIcon } from "@styled-icons/material-twotone/Mic";
import { MicOff as MicOffIcon } from "@styled-icons/material-twotone/MicOff";
import { Videocam as CameraIcon } from "@styled-icons/material-twotone/Videocam";
import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { Star as StarIcon } from "@styled-icons/material/Star";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import { useSessionContext } from "./context-provider/session-context";
import useVideoLayoutUpdate from "./utils/video-layout-update";

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

    useVideoLayoutUpdate(videoRef.current);

    return <video style={{zIndex: -1, width: "100%" }} ref={videoRef} autoPlay playsInline  {...videoProps} />;
}

export const MUTATION_REWARD_TROPHY = gql`
mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
}
`;

export function GlobalCameraControl(props: {localSession: Session }): JSX.Element {
    const theme = useTheme();
    const { localSession } = props;
    const [camerasOn, setCamerasOn] = useState(true);
    const [micsOn, setMicsOn] = useState(true);
    const { roomId } = useSessionContext();
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY, {context: {target: SESSION_LINK_LIVE}});
    const [globalMuteMutation] = useMutation(GLOBAL_MUTE_MUTATION, { context: { target: SESSION_LINK_LIVE}});
    const { refetch } = useQuery(GLOBAL_MUTE_QUERY, { variables: { roomId }, context: { target: SESSION_LINK_LIVE}});
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });
    const states = useContext(WebRTCContext);

    const { actions: { clear } } = useToolbarContext();
    const {
        state: { display },
        actions: { setDisplay },
    } = useSynchronizedState();

    const enforceGlobalMute = async () => {
        const { data }= await refetch();
        const videoGloballyDisabled = data?.retrieveGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled) {
            toggleVideoStates(videoGloballyDisabled);
        }
        const audioGloballyMuted = data?.retrieveGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted) {
            toggleAudioStates(audioGloballyMuted);
        }
    }

    useEffect(() => {
        enforceGlobalMute()
    }, [roomId, localSession.isHost, states.inboundStreams.size])
    
    async function toggleVideoStates(isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: undefined,
            videoGloballyDisabled: isOn ?? camerasOn,
        }
        const data = await globalMuteMutation({ variables: notification })
        const videoGloballyDisabled = data?.data?.updateGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled != null) {
            setCamerasOn(!videoGloballyDisabled);
        }
    }

    async function toggleAudioStates(isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: isOn ?? micsOn,
            videoGloballyDisabled: undefined,
        }
        const data = await globalMuteMutation({ variables: notification })
        const audioGloballyMuted = data?.data?.updateGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted != null) {
            setMicsOn(!audioGloballyMuted);
        }
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
                            onClick={() => toggleVideoStates()}
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
                            onClick={() => toggleAudioStates()}
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
                            onClick={() => { rewardTrophy(localSession.id, "star"); }}
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
                            onClick={() => { rewardTrophy(localSession.id, "trophy"); }}
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
                            onClick={() => { rewardTrophy(localSession.id, "heart"); }}
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
                            onClick={() => { rewardTrophy(localSession.id, getRandomKind(["awesome", "looks_great", "well_done", "great_job"])); }}
                        >
                            <EncourageIcon size="1rem" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    );
}
