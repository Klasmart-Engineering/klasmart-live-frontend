import React, { useRef, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Theme, useTheme, createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import { Chalkboard as ChalkboardIcon } from "@styled-icons/boxicons-solid/Chalkboard";
import { Crown as CrownIcon } from "@styled-icons/boxicons-solid/Crown";
import { BoxArrowUpLeft as BoxArrowUpLeftIcon } from "@styled-icons/bootstrap/BoxArrowUpLeft";
import { DotsVerticalRounded as DotsVerticalRoundedIcon } from "@styled-icons/boxicons-regular/DotsVerticalRounded";
import { Video as VideoOnIcon } from "@styled-icons/boxicons-solid/Video";
import { VideoOff as VideoOffIcon } from "@styled-icons/boxicons-solid/VideoOff";
import { Microphone as MicrophoneOnIcon } from "@styled-icons/boxicons-solid/Microphone";
import { MicrophoneOff as MicrophoneOffIcon } from "@styled-icons/boxicons-solid/MicrophoneOff";
import { Circle as CircleIcon } from "@styled-icons/boxicons-solid/Circle"

import { MuteNotification, WebRTCSFUContext } from "../../webrtc/sfu";
import { Session } from "../../pages/room/room";
import StyledIcon from "../styled/icon";
import { LocalSessionContext } from "../../entry";
import { isElementInViewport } from "../../utils/viewport";
import PermissionControls from "../../whiteboard/components/WBPermissionControls";
import TrophyControls from "../trophies/trophyControls";

const PARTICIPANT_INFO_ZINDEX = 1;
const ICON_ZINDEX = 2;
const PRIMARY_COLOR = "#0E78D5";
const SECONDARY_COLOR = "#dc004e";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iconGrid: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: theme.spacing(0.5)
        },
        noHoverIcon: {
            "&:hover": {
                color: "#FFF"
            }
        },
        moreControlsMenuItem: {
            "&:hover": {
                backgroundColor: "transparent"
            }
        }
    })
);

interface CameraProps {
    session?: Session;
    mediaStream?: MediaStream;
    muted?: boolean;
    square?: boolean;
    noBorderRadius?: boolean;
}

export default function Camera({ session, mediaStream, muted, square, noBorderRadius }: CameraProps): JSX.Element {
    const { sessionId: userSelfSessionId } = useContext(LocalSessionContext);
    const isSelf = session
        ? session.id === userSelfSessionId
        : true; // e.g. <Camera /> without session in join.tsx

    const theme = useTheme();
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = mediaStream ? mediaStream : null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream ? mediaStream : null;
        }
    }, [videoRef.current, mediaStream]);

    const cameraRef = useRef<HTMLDivElement>(null);
    return (
        <Paper
            ref={cameraRef}
            component="div"
            elevation={2}
            style={{
                position: "relative",
                width: "100%",
                backgroundColor: "#193d6f",
                borderRadius: noBorderRadius ? 0 : 12,
                height: 0,
                margin: theme.spacing(0.5),
                paddingBottom: square ? "75%" : "56.25%",
            }}
        >
            {session ? <ParticipantInfo session={session} isSelf={isSelf} /> : null}
            {mediaStream ?
                <>
                    {session ? <>
                        <MediaIndicators sessionId={session.id} />
                        <MoreControlsButton sessionId={session.id} isSelf={isSelf} cameraRef={cameraRef} />
                    </> : null}
                    <video
                        id={session ? `camera:${session.id}` : undefined}
                        autoPlay={true}
                        muted={true}
                        playsInline
                        style={{
                            backgroundColor: "#000",
                            borderRadius: 12,
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                        ref={videoRef}
                    />
                    <audio
                        autoPlay={true}
                        muted={muted}
                        ref={audioRef}
                    />
                </> :
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
    );
}

function ParticipantInfo({ session, isSelf }: { session: Session, isSelf: boolean }): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { iconGrid } = useStyles();

    const [name, _] = useState<string | JSX.Element>(session.name ? session.name : <FormattedMessage id="error_unknown_user" />);

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            style={{
                zIndex: PARTICIPANT_INFO_ZINDEX,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                padding: theme.spacing(0.5),
                background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)",
                borderRadius: "12px 12px 0 0",
                textAlign: "center",
            }}
        >
            {/* Participant's Name */}
            <Grid item>
                <Tooltip
                    arrow
                    aria-label="Tooltip for participant's name"
                    placement={"top"}
                    title={name}
                >
                    <Typography
                        component="p"
                        variant={isSmDown ? "caption" : "body1"}
                        noWrap
                        style={{ color: "#FFF" }}
                    >
                        {isSelf ? "You" : name}
                    </Typography>
                </Tooltip>
            </Grid>

            {/* ChalkboardIcon for teacher */}
            {session.isTeacher ?
                <Grid item className={iconGrid}>
                    <StyledIcon
                        icon={<ChalkboardIcon />}
                        size="small"
                        color="#FFF"
                        tooltip={{
                            children: <ChalkboardIcon />,
                            placement: "top",
                            title: <FormattedMessage id="camera_ParticipantInfo_ChalkboardIcon_tooltip" />,
                        }}
                    />
                </Grid> : null
            }

            {/* CrownIcon for host teacher */}
            {/* 
                TODO: Host - teacher who can control the classroom(like toggle classroom mode, grant mic/cam permission, whiteboard permission, etc.)
                As of now, there is no way to know who is the host teacher. Feb 18, 2021
                https://calmisland.atlassian.net/browse/KL-3508
            */}
            {/* 
                {session.isTeacher && session.isHost ?
                    <Grid item className={iconGrid}>
                        <StyledIcon
                            icon={<CrownIcon />}
                            size="small"
                            color="#C9940D"
                            tooltip={{
                                children: <CrownIcon />,
                                placement: "top",
                                title: <FormattedMessage id="camera_ParticipantInfo_CrownIcon_tooltip" />,
                            }}
                        />
                    </Grid> : null
                }
            */}
        </Grid>
    )
}

function MediaIndicators({ sessionId }: { sessionId: string }) {
    const theme = useTheme();

    return (
        <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{
                zIndex: ICON_ZINDEX,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                padding: theme.spacing(0.5),
            }}
        >
            <FullScreenCameraButton sessionId={sessionId} />
            <MicIndicator sessionId={sessionId} />
        </Grid>
    )
}

function FullScreenCameraButton({ sessionId }: { sessionId: string }): JSX.Element {
    const theme = useTheme();
    const toggleBtnId = `toggle-fullscreen-camera-button:${sessionId}`
    const videoId = `camera:${sessionId}`

    const fullScreenCamera = async () => {
        const toggleBtn = document.getElementById(toggleBtnId) as HTMLButtonElement;
        const video = document.getElementById(videoId) as any; // HTMLVideoElement type does not cover webkitRequestFullscreen and msRequestFullScreen
        if (!toggleBtn || !video) return;

        if (video.requestFullscreen)
            video.requestFullscreen();
        else if (video.webkitRequestFullscreen)
            video.webkitRequestFullscreen(); // to support on Safari
        else if (video.msRequestFullScreen)
            video.msRequestFullScreen(); // to support on Edge
    }

    return (
        <IconButton
            id={toggleBtnId}
            aria-label="Full screen camera button"
            size="small"
            onClick={fullScreenCamera}
        >
            <StyledIcon
                icon={<BoxArrowUpLeftIcon />}
                size="small"
                color="#FFF"
                tooltip={{
                    children: <BoxArrowUpLeftIcon />,
                    placement: "top",
                    title: <FormattedMessage id="camera_FullScreenCameraButton_tooltip" />
                }}
            />
        </IconButton>
    )
}


function MicIndicator({ sessionId }: { sessionId: string }) {
    const { iconGrid, noHoverIcon } = useStyles();
    const sfuState = WebRTCSFUContext.Consume();

    const [micOn, setMicOn] = useState<boolean>(false);
    useEffect(() => {
        setMicOn(sfuState.isLocalAudioEnabled(sessionId));
    }, [micOn]);

    return (
        <Grid
            item
            className={iconGrid}
            style={{ padding: 0 }}
        >
            <StyledIcon
                icon={micOn ? <CircleIcon className={noHoverIcon} /> : <MicrophoneOffIcon className={noHoverIcon} />}
                size="small"
                color={micOn ? "#2EE2D8" : "#FFF"}
            />
        </Grid>
    )
}

const MoreControlsPopover = withStyles({
    paper: { width: 250, border: "1px solid lightgrey" }
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        // Anchor reference: https://material-ui.com/components/popover/#anchor-playground
        anchorOrigin={{
            vertical: "center",
            horizontal: "left"
        }}
        transformOrigin={{
            vertical: "bottom",
            horizontal: "right"
        }}
        {...props}
    />
));

export function MoreControlsButton({ sessionId, isSelf, cameraRef }: {
    sessionId: string,
    isSelf: boolean,
    cameraRef: React.RefObject<HTMLElement>
}): JSX.Element {
    const { moreControlsMenuItem } = useStyles();
    const theme = useTheme();

    const { isTeacher } = useContext(LocalSessionContext);
    const sfuState = WebRTCSFUContext.Consume();

    const [moreEl, setMoreEl] = useState<null | HTMLElement>(null);
    const handleMoreOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    return (<>
        <IconButton
            component="a"
            aria-label="More controls button"
            aria-controls="more-controls-popover"
            aria-haspopup="true"
            size="small"
            onClick={handleMoreOpen}
            style={{
                zIndex: ICON_ZINDEX,
                position: "absolute",
                bottom: theme.spacing(0.5),
                left: theme.spacing(0.5)
            }}
        >
            <StyledIcon icon={<DotsVerticalRoundedIcon />} size="small" color="#FFF" />
        </IconButton>
        <MoreControlsPopover
            id="more-controls-popover"
            keepMounted
            anchorEl={moreEl}
            open={Boolean(moreEl)}
            onClose={handleMoreClose}
            MenuListProps={{ onPointerLeave: handleMoreClose }}
        >
            {/* Whiteboard & Trophy permissions
                1. isSelf: User do not have to control user's own permissions.
                2. !teacher: If User are not teacher, user cannot control other's permissions.
            */}
            {isSelf || !isTeacher ? null :
                <List>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader>
                                <FormattedMessage id="camera_MoreControlsButton_ListSubheader_whiteboard" />
                            </ListSubheader>
                        }
                    >
                        <PermissionControls otherUserId={sessionId} />
                    </List>
                    <List
                        disablePadding
                        subheader={
                            <ListSubheader>
                                <FormattedMessage id="camera_MoreControlsButton_ListSubheader_trophy" />
                            </ListSubheader>
                        }
                    >
                        <MenuItem className={moreControlsMenuItem}>
                            <TrophyControls otherUserId={sessionId} />
                        </MenuItem>
                    </List>
                </List>
            }

            {/* Camera & Microphone */}
            <List
                disablePadding
                subheader={
                    <ListSubheader>
                        <FormattedMessage id="camera_MoreControlsButton_ListSubheader_toggleCamMic" />
                    </ListSubheader>
                }
            >
                <ToggleCamera sessionId={sessionId} sfuState={sfuState} cameraRef={cameraRef} />
                <ToggleMic sessionId={sessionId} sfuState={sfuState} />
            </List>
        </MoreControlsPopover>
    </>)
}

/**
 * TODO:
 * 1. Separate local / global
 * 2. Property for UI type - IconButton & MenuItem
 */
function ToggleCamera({ sessionId, sfuState, cameraRef }: {
    sessionId: string,
    sfuState: WebRTCSFUContext,
    cameraRef: React.RefObject<HTMLElement>
}): JSX.Element {
    const { noHoverIcon, moreControlsMenuItem } = useStyles();
    const { roomId } = useContext(LocalSessionContext);

    const [cameraOn, setCameraOn] = useState<boolean>(false);
    const [isVideoManuallyDisabled, setIsVideoManuallyDisabled] = useState<boolean>(false);

    const isCameraVisible = isElementInViewport(cameraRef);
    useEffect(() => {
        if (isCameraVisible !== sfuState.isLocalVideoEnabled(sessionId)) {
            if ((isCameraVisible && !sfuState.isLocalVideoEnabled(sessionId) && !isVideoManuallyDisabled) ||
                (!isCameraVisible && sfuState.isLocalVideoEnabled(sessionId))) {
                toggleVideoState()
            }
        }
    }, [isCameraVisible]);

    useEffect(() => {
        setCameraOn(sfuState.isLocalVideoEnabled(sessionId))
    }, [sfuState.isLocalVideoEnabled(sessionId)])

    const manuallyToggleVideoState = (): void => {
        toggleVideoState()
        setIsVideoManuallyDisabled(!sfuState.isLocalVideoEnabled(sessionId))
    }

    function toggleVideoState() {
        const stream = sfuState.getCameraStream(sessionId)
        if (stream) {
            // Inbound stream
            const tracks = stream.getVideoTracks()
            if (tracks && tracks.length > 0) {
                for (const consumerId of tracks.map((t) => t.id)) {
                    const notification: MuteNotification = {
                        roomId,
                        sessionId,
                        consumerId,
                        video: !cameraOn
                    }
                    sfuState.sendMute(notification);
                    setCameraOn(!cameraOn)
                }
            }
        } else {
            // Outbound stream
            const producers = sfuState.getOutboundCameraStream()
            if (producers) {
                const video = producers.producers.find((a) => a.kind === "video")
                if (video) {
                    const notification: MuteNotification = {
                        roomId,
                        sessionId,
                        producerId: video.id,
                        video: !cameraOn
                    }
                    sfuState.sendMute(notification)
                    setCameraOn(!cameraOn)
                }
            }
        }
        sfuState.localVideoToggle(sessionId);
    }

    return (
        <MenuItem onClick={manuallyToggleVideoState} className={moreControlsMenuItem}>
            <ListItemIcon>
                <StyledIcon icon={cameraOn ? <VideoOnIcon className={noHoverIcon} /> : <VideoOffIcon className={noHoverIcon} />} size="medium" color={cameraOn ? PRIMARY_COLOR : SECONDARY_COLOR} />
            </ListItemIcon>
            {cameraOn ? <FormattedMessage id="turn_off_camera" /> : <FormattedMessage id="turn_on_camera" />}
        </MenuItem>
    )
}

/**
 * TODO:
 * 1. Separate local / global
 * 2. Property for UI type - IconButton & MenuItem
 */
function ToggleMic({ sessionId, sfuState }: {
    sessionId: string,
    sfuState: WebRTCSFUContext
}): JSX.Element {
    const { noHoverIcon, moreControlsMenuItem } = useStyles();
    const { roomId } = useContext(LocalSessionContext);
    const [micOn, setMicOn] = useState<boolean>(false);

    useEffect(() => {
        setMicOn(sfuState.isLocalAudioEnabled(sessionId))
    }, [sfuState.isLocalAudioEnabled(sessionId)])

    function toggleAudioState() {
        const stream = sfuState.getCameraStream(sessionId)
        if (stream) {
            // Inbound stream
            const tracks = stream.getAudioTracks()
            if (tracks && tracks.length > 0) {
                for (const consumerId of tracks.map((t) => t.id)) {
                    const notification: MuteNotification = {
                        roomId,
                        sessionId,
                        consumerId,
                        audio: !micOn
                    }
                    sfuState.sendMute(notification);
                    setMicOn(!micOn)
                }
            }
        } else {
            // Outbound stream
            const producers = sfuState.getOutboundCameraStream()
            if (producers) {
                const audio = producers.producers.find((a) => a.kind === "audio")
                if (audio) {
                    const notification: MuteNotification = {
                        roomId,
                        sessionId,
                        producerId: audio.id,
                        audio: !micOn
                    }
                    sfuState.sendMute(notification)
                    setMicOn(!micOn)
                }
            }
        }
        sfuState.localAudioToggle(sessionId);
    }

    return (
        <MenuItem onClick={toggleAudioState} className={moreControlsMenuItem}>
            <ListItemIcon>
                <StyledIcon icon={micOn ? <MicrophoneOnIcon className={noHoverIcon} /> : <MicrophoneOffIcon className={noHoverIcon} />} size="medium" color={micOn ? PRIMARY_COLOR : SECONDARY_COLOR} />
            </ListItemIcon>
            {micOn ? <FormattedMessage id="turn_off_mic" /> : <FormattedMessage id="turn_on_mic" />}
        </MenuItem>
    )
}
