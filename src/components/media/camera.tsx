import React, { useRef, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { Theme, useTheme, createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid, { GridProps } from "@material-ui/core/Grid";
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
import { useIsElementInViewport } from "../../utils/viewport";
import PermissionControls from "../../whiteboard/components/WBPermissionControls";
import TrophyControls from "../trophies/trophyControls";
import { State } from "../../store/store";

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

export enum CameraOrder {
    Default = 0,
    HostTeacher = 1,
    TeacherSelf = 2,
    Teacher = 3,
    // StudentSpeaking = 4, // TODO: https://calmisland.atlassian.net/browse/KL-3907
    StudentSelf = 9,
    Student = 10,
}

export function getCameraOrder(userSession: Session, isLocalUser: boolean): CameraOrder {
    let order: CameraOrder;
    if (userSession.isHost)
        order = CameraOrder.HostTeacher;
    else if (userSession.isTeacher && isLocalUser)
        order = CameraOrder.TeacherSelf;
    else if (userSession.isTeacher)
        order = CameraOrder.Teacher;
    else if (isLocalUser)
        order = CameraOrder.StudentSelf;
    else
        order = CameraOrder.Student
    return order;
}

interface CameraProps extends GridProps {
    session?: Session;
    mediaStream?: MediaStream;
    muted?: boolean;
    square?: boolean;
    noBorderRadius?: boolean;
    hidden?: boolean; // Maybe this prop will be deleted after classroom layout renewal.
}

export default function Camera({
    session,
    mediaStream,
    muted,
    square,
    noBorderRadius,
    ...other
}: CameraProps): JSX.Element {
    const theme = useTheme();

    const { sessionId: userSelfSessionId } = useContext(LocalSessionContext);
    const isSelf = session
        ? session.id === userSelfSessionId
        : true; // e.g. <Camera /> without session in join.tsx

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
        <Grid {...other}>
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
                    paddingBottom: square ? "75%" : "56.25%",
                }}
            >
                {session && <ParticipantInfo session={session} isSelf={isSelf} />}
                {mediaStream ?
                    <>
                        {session && <>
                            <MediaIndicators sessionId={session.id} />
                            <MoreControlsButton sessionId={session.id} isSelf={isSelf} cameraRef={cameraRef} />
                        </>}
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
                    </>
                    :
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
        </Grid>
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
                        // TODO: https://calmisland.atlassian.net/browse/KL-4029
                        tooltip={{
                            children: <ChalkboardIcon />,
                            placement: "top",
                            title: <FormattedMessage id="camera_participantInfo_chalkboardIcon_tooltip" values={{ name }} />,
                        }}
                    />
                </Grid> : null
            }

            {/* CrownIcon for host teacher */}
            {/* host: teacher who can control the classroom(like toggle classroom mode, grant mic/cam permission, whiteboard permission, etc.) */}
            {session.isTeacher && session.isHost ?
                <Grid item className={iconGrid}>
                    <StyledIcon
                        icon={<CrownIcon />}
                        size="small"
                        color="#C9940D"
                        // TODO: https://calmisland.atlassian.net/browse/KL-4029
                        tooltip={{
                            children: <CrownIcon />,
                            placement: "top",
                            title: <FormattedMessage id="camera_participantInfo_crownIcon_tooltip" values={{ name }} />
                        }}
                    />
                </Grid> : null
            }
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
                    title: <FormattedMessage id="camera_fullScreenCameraButton_tooltip" />
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
        setMicOn(sfuState.isLocalAudioEnabled(sessionId))
    }, [sfuState.isLocalAudioEnabled(sessionId)])

    return (micOn ? <></> :
        <Grid
            item
            className={iconGrid}
            style={{ padding: 0 }}
        >
            <StyledIcon
                icon={micOn ?
                    // <CircleIcon className={noHoverIcon} /> : TODO: https://calmisland.atlassian.net/browse/KL-3509
                    <></> :
                    <MicrophoneOffIcon className={noHoverIcon} />
                }
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

    return (
        <Grid
            container
            justify="flex-start"
            alignItems="center"
            style={{
                zIndex: ICON_ZINDEX,
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: theme.spacing(0.5),
                background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)",
                borderRadius: "0 0 12px 12px",
            }}
        >
            <IconButton
                component="a"
                aria-label="More controls button"
                aria-controls="more-controls-popover"
                aria-haspopup="true"
                size="small"
                onClick={handleMoreOpen}
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
                                    <FormattedMessage id="camera_moreControlsButton_listSubheader_whiteboard" />
                                </ListSubheader>
                            }
                        >
                            <PermissionControls otherUserId={sessionId} />
                        </List>
                        <List
                            disablePadding
                            subheader={
                                <ListSubheader>
                                    <FormattedMessage id="camera_moreControlsButton_listSubheader_trophy" />
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
                            <FormattedMessage id="camera_moreControlsButton_listSubheader_toggleCamMic" />
                        </ListSubheader>
                    }
                >
                    <ToggleCamera sessionId={sessionId} sfuState={sfuState} cameraRef={cameraRef} />
                    <ToggleMic sessionId={sessionId} sfuState={sfuState} />
                </List>
            </MoreControlsPopover>
        </Grid>
    )
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

    const drawerTabIndex = useSelector((state: State) => state.control.drawerTabIndex);

    const [cameraOn, setCameraOn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVideoManuallyDisabled, setIsVideoManuallyDisabled] = useState<boolean>(false);

    // NOTE: This is the logic for the frontend performance. If this logic goes well, we will restore it again.
    // const isCameraVisible = useIsElementInViewport(cameraRef);

    useEffect(() => {
        if (isLoading && sfuState.isLocalVideoEnabled(sessionId)) {
            setIsLoading(false)
        }
    }, [sfuState.isLocalVideoEnabled(sessionId)])

    // NOTE: This is the logic for the frontend performance. If this logic goes well, we will restore it again.
    // useEffect(() => {
    //     if (isLoading) { return; }
    //     const isVisible = drawerTabIndex !== 0 || isCameraVisible;
    //     if ((isVisible && !sfuState.isLocalVideoEnabled(sessionId) && !isVideoManuallyDisabled) ||
    //         (!isCameraVisible && sfuState.isLocalVideoEnabled(sessionId))) {
    //         const stream = sfuState.getCameraStream(sessionId);
    //         toggleInboundVideoState(stream);
    //     }
    // }, [isCameraVisible, drawerTabIndex]);

    useEffect(() => {
        setCameraOn(sfuState.isLocalVideoEnabled(sessionId));
    }, [sfuState.isLocalVideoEnabled(sessionId)])

    function toggleInboundVideoState(stream: MediaStream | undefined) {
        const tracks = stream?.getVideoTracks() ?? [];
        for (const track of tracks) {
            const consumerId = track.id;
            const notification: MuteNotification = {
                roomId,
                sessionId,
                consumerId,
                video: !cameraOn
            }
            sfuState.sendMute(notification);
        }
        sfuState.localVideoToggle(sessionId);
    }

    function toggleOutboundVideoState() {
        const producers = sfuState.getOutboundCameraStream()
        const video = producers?.producers?.find((a) => a.kind === "video")
        if (video) {
            const notification: MuteNotification = {
                roomId,
                sessionId,
                producerId: video.id,
                video: !cameraOn
            }
            sfuState.sendMute(notification)
        }
        sfuState.localVideoToggle(sessionId);
    }

    function toggleVideoState() {
        const stream = sfuState.getCameraStream(sessionId)
        if (stream) {
            toggleInboundVideoState(stream);
        } else {
            toggleOutboundVideoState();
        }
    }

    function manuallyToggleVideoState(): void {
        toggleVideoState();
        setIsVideoManuallyDisabled(!sfuState.isLocalVideoEnabled(sessionId));
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
            const tracks = stream.getAudioTracks();
            for (const track of tracks) {
                const consumerId = track.id;
                const notification: MuteNotification = {
                    roomId,
                    sessionId,
                    consumerId,
                    audio: !micOn
                }
                sfuState.sendMute(notification);
                setMicOn(!micOn)
            }
        } else {
            // Outbound stream
            const producers = sfuState.getOutboundCameraStream();
            const audio = producers?.producers?.find((a) => a.kind === "audio")
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
