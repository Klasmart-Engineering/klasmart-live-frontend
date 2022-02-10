import PencilIconOff from "@/assets/img/canvas/pencil_icon_off.svg";
import PencilIconOn from "@/assets/img/canvas/pencil_icon_on.svg";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useSetHostMutation } from "@/data/live/mutations/useSetHostMutation";
import { useSessions } from "@/data/live/state/useSessions";
import { useMuteMutation } from "@/data/sfu/mutations/useMuteMutation";
import { useGlobalMuteQuery } from "@/data/sfu/queries/useGlobalMuteQuery";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    MuteNotification,
    WebRTCContext,
} from "@/providers/WebRTCContext";
import { hasControlsState } from "@/store/layoutAtoms";
import { fullScreenById } from "@/utils/utils";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Box,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { ArrowsAngleExpand as ExpandIcon } from "@styled-icons/bootstrap/ArrowsAngleExpand";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { TrophyFill as TrophyIcon } from "@styled-icons/bootstrap/TrophyFill";
import { Crown as HasControlsIcon } from "@styled-icons/fa-solid/Crown";
import clsx from "clsx";
import React,
{
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        position: `absolute`,
        zIndex: 9,
        width: `100%`,
        height: `100%`,
        bottom: 0,
        right: 0,
        opacity: 1,
        transition: `all 100ms ease-in-out`,
        visibility: `visible`,
    },
    backdropOverlay:{
        backdropFilter: `blur(2px)`,
        backgroundColor: `rgba(0,0,0,0.3)`,
    },
    controlsIcon:{
        padding: theme.spacing(1),
        color: theme.palette.common.white,
    },
    menuPaperTrophies:{
        borderRadius: 30,
        "& $menuItem":{
            padding: theme.spacing(0.75),
            color: amber[500],
        },
    },
    menuItem:{
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightBold as number,
    },
    expand:{
        position: `absolute`,
        top: theme.spacing(1),
        left: theme.spacing(1),
    },
    iconButton:{
        color: theme.palette.common.white,
        margin: theme.spacing(0, -0.5),
        padding: theme.spacing(1, 1.25),
    },
    iconsContainer: {
        borderRadius: 40,
        background: `rgba(0,0,0,0.5)`,
        padding: theme.spacing(0, 0.75),
    },
}));

interface UserCameraActionsProps {
    user: Session;
    expanded: boolean;
}

const UserCameraActions = ({ user, expanded }: UserCameraActionsProps) => {
    const classes = useStyles();

    const {
        isTeacher,
        roomId,
        sessionId,
    } = useSessionContext();

    const hasControls = useRecoilValue(hasControlsState);

    const isSelf = sessionId === user.id;
    const subTeacher = !user.isHost && user.isTeacher;

    const [ trophyEl, setTrophyEl ] = useState<null | HTMLElement>(null);
    const handleTrophyOpen = (event: React.MouseEvent<HTMLElement>) => { setTrophyEl(event.currentTarget); };
    const handleTrophyClose = () => { setTrophyEl(null); };

    const [ rewardTrophyMutation ] = useRewardTrophyMutation();
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({
        variables: {
            roomId,
            user,
            kind,
        },
    });

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={clsx(classes.root, {
                    [classes.backdropOverlay] : isTeacher,
                })}>
                {expanded && (<ExpandCamera user={user} />) }
                {isTeacher && (
                    <Box
                        display="flex"
                        className={classes.iconsContainer}>
                        <ToggleMic user={user} />
                        <ToggleCamera user={user} />
                        {!isSelf && (
                            <IconButton
                                aria-label="Trophy"
                                className={classes.iconButton}
                                onClick={handleTrophyOpen}>
                                <TrophyIcon size="0.7em"/>
                            </IconButton>
                        )}
                        {hasControls && (
                            <>
                                {!isSelf && (
                                    <ToggleCanvas user={user} />
                                )}
                                {subTeacher && (
                                    <ToggleControls user={user} />
                                )}
                            </>
                        )}
                    </Box>
                )}
            </Box>
            <Menu
                id="trophy-menu"
                anchorEl={trophyEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: `bottom`,
                    horizontal: `center`,
                }}
                transformOrigin={{
                    vertical: `top`,
                    horizontal: `center`,
                }}
                open={Boolean(trophyEl)}
                MenuListProps={{
                    onPointerLeave: handleTrophyClose,
                    disablePadding: true,
                }}
                classes={{
                    paper: classes.menuPaperTrophies,
                }}
                onClose={handleTrophyClose}
            >
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => rewardTrophy(user.id, `trophy`)}><TrophyIcon size="1.2rem"/></MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => rewardTrophy(user.id, `awesome`)}><HandThumbsUpFillIcon size="1.2rem"/></MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => rewardTrophy(user.id, `star`)}><StarFillIcon size="1.2rem"/></MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    onClick={() => rewardTrophy(user.id, `heart`)}><HeartFillIcon size="1.2rem"/></MenuItem>
            </Menu>
        </>
    );
};

export default UserCameraActions;

interface ToggleCameraProps {
    user: Session;
}

const ToggleCamera = ({ user }: ToggleCameraProps) => {
    const classes = useStyles();

    const { roomId, sessionId } = useSessionContext();

    const sessions = useSessions();
    const webrtc = useContext(WebRTCContext);

    const [ camOn, setCamOn ] = useState<boolean>(true);

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ muteMutation ] = useMuteMutation();
    const { refetch } = useGlobalMuteQuery({
        variables: {
            roomId,
        },
    });

    const isSelf = sessionId === user.id;

    useEffect(() => {
        if (isLoading && webrtc.isVideoEnabledByProducer(user.id)) {
            setIsLoading(false);
        }
    }, [ webrtc.isVideoEnabledByProducer(user.id) ]);

    useEffect(() => {
        setCamOn(webrtc.isVideoEnabledByProducer(user.id) && !webrtc.isVideoDisabledLocally(user.id));
    }, [ webrtc.isVideoEnabledByProducer(user.id), webrtc.isVideoDisabledLocally(user.id) ]);

    async function toggleInboundVideoState () {
        const localSession = sessions.get(sessionId);
        if (localSession?.isHost) {
            const notification: MuteNotification = {
                roomId,
                sessionId: user.id,
                video: !camOn,
            };
            const muteNotification = await muteMutation({
                variables: notification,
            });
            if (muteNotification?.data?.mute?.video != null) {
                setCamOn(muteNotification.data.mute.video);
            }
        } else {
            webrtc.toggleLocalVideo(user.id);
        }
    }

    async function toggleOutboundVideoState () {
        const notification: MuteNotification = {
            roomId,
            sessionId: user.id,
            video: !camOn,
        };
        const muteNotification = await muteMutation({
            variables: notification,
        });
        if (muteNotification?.data?.mute?.video != null) {
            setCamOn(muteNotification.data.mute.video);
        }
    }

    async function toggleVideoState (): Promise<void> {
        const { data }= await refetch();
        const videoGloballyDisabled = data?.retrieveGlobalMute?.videoGloballyDisabled;
        if (isSelf) {
            const localSession = sessions.get(sessionId);
            if (videoGloballyDisabled && !localSession?.isTeacher) {
                return;
            }
            await toggleOutboundVideoState();
        } else {
            if (videoGloballyDisabled && !user?.isTeacher) {
                return;
            }
            await toggleInboundVideoState();
        }
    }

    return (
        <IconButton
            aria-label="Camera"
            className={classes.iconButton}
            onClick={toggleVideoState}
        >
            {camOn ? <CameraVideoFillIcon size="0.7em"/> : <CameraDisabledIcon size="0.7em"/>}
        </IconButton>
    );
};

interface ToggleMicProps {
    user: Session;
}

function ToggleMic ({ user }: ToggleMicProps){
    const classes = useStyles();

    const { roomId, sessionId } = useSessionContext();
    const sessions = useSessions();
    const isSelf = sessionId === user.id;

    const [ micOn, setMicOn ] = useState<boolean>(true);

    const [ muteMutation ] = useMuteMutation();
    const { refetch } = useGlobalMuteQuery({
        variables: {
            roomId,
        },
    });

    const webrtc = useContext(WebRTCContext);

    useEffect(() => {
        setMicOn(webrtc.isAudioEnabledByProducer(user.id) && !webrtc.isAudioDisabledLocally(user.id));
    }, [ webrtc.isAudioEnabledByProducer(user.id), webrtc.isAudioDisabledLocally(user.id) ]);

    async function toggleInboundAudioState () {
        const localSession = sessions.get(sessionId);
        if (localSession?.isHost) {
            const notification: MuteNotification = {
                roomId,
                sessionId: user.id,
                audio: !micOn,
            };
            const muteNotification = await muteMutation({
                variables: notification,
            });
            if (muteNotification?.data?.mute?.audio != null) {
                setMicOn(muteNotification.data.mute.audio);
            }
        } else {
            webrtc.toggleLocalAudio(user.id);
        }
    }

    async function toggleOutboundAudioState () {
        const notification: MuteNotification = {
            roomId,
            sessionId: user.id,
            audio: !micOn,
        };
        const muteNotification = await muteMutation({
            variables: notification,
        });
        if (muteNotification?.data?.mute?.audio != null) {
            setMicOn(muteNotification.data.mute.audio);
        }
    }

    async function toggleAudioState (): Promise<void> {
        const { data }= await refetch();
        const audioGloballyMuted = data?.retrieveGlobalMute?.audioGloballyMuted;
        if (isSelf) {
            const localSession = sessions.get(sessionId);
            if (audioGloballyMuted && !localSession?.isTeacher) {
                return;
            }
            await toggleOutboundAudioState();
        } else {
            if (audioGloballyMuted && !user.isTeacher) {
                return;
            }
            await toggleInboundAudioState();
        }
    }

    return (
        <IconButton
            aria-label="Microphone"
            className={classes.iconButton}
            onClick={toggleAudioState}
        >
            {micOn ? <MicFillIcon size="0.7em"/> : <MicDisabledIcon size="0.7em"/>}
        </IconButton>
    );
}

interface ToggleControlsProps {
    user: Session;
}

function ToggleControls ({ user }: ToggleControlsProps){
    const classes = useStyles();

    const { roomId } = useSessionContext();

    const [ hostMutation ] = useSetHostMutation();

    function giveControls (user: Session){
        hostMutation({
            variables: {
                roomId,
                nextHostId: user.id,
            },
        });
    }

    return (
        <IconButton
            aria-label="Give controls"
            className={classes.iconButton}
            onClick={() => giveControls(user)}
        >
            <HasControlsIcon size="0.7em"/>
        </IconButton>
    );
}

interface ToggleCanvasProps {
    user: Session;
}

function ToggleCanvas ({ user }:ToggleCanvasProps) {
    const classes = useStyles();

    const { actions: { setPermissions, getPermissions } } = useSynchronizedState();

    const permissions = getPermissions(user.id);

    const toggleAllowCreateShapes = useCallback(() => {
        const newPermissions = {
            ...permissions,
            allowCreateShapes: !permissions.allowCreateShapes,
        };
        setPermissions(user.id, newPermissions);

    }, [
        permissions,
        setPermissions,
        user.id,
    ]);

    return (
        <IconButton
            aria-label="Canvas"
            className={classes.iconButton}
            onClick={toggleAllowCreateShapes}>
            <img
                src={permissions.allowCreateShapes ? PencilIconOn : PencilIconOff}
                width="15px"
                height="15px" />
        </IconButton>
    );
}

interface ExpandCameraProps {
    user: Session;
}

function ExpandCamera ({ user }:ExpandCameraProps){
    const classes = useStyles();

    return(
        <div className={classes.expand}>
            <IconButton
                component="a"
                aria-label="Expand video"
                size="small"
                className={classes.controlsIcon}
                onClick={() => fullScreenById(`camera:${user.id}`)}
            >
                <ExpandIcon size="0.75em" />
            </IconButton>
        </div>
    );
}
