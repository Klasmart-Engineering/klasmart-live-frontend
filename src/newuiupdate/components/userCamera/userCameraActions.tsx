import {
    LIVE_LINK, LocalSessionContext, SFU_LINK,
} from "../../providers/providers";
import { RoomContext } from "../../providers/roomContext";
import {
    GLOBAL_MUTE_QUERY, MUTE, MuteNotification, WebRTCContext,
} from "../../providers/WebRTCContext";
import { hasControlsState, pinnedUserState } from "../../states/layoutAtoms";
import { MUTATION_SET_HOST } from "../utils/graphql";
import { useMutation, useQuery } from "@apollo/client";
import {
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ArrowsAngleExpand as ExpandIcon } from "@styled-icons/bootstrap/ArrowsAngleExpand";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { TrophyFill as TrophyIcon } from "@styled-icons/bootstrap/TrophyFill";
import { DotsVerticalRounded as DotsVerticalRoundedIcon } from "@styled-icons/boxicons-regular/DotsVerticalRounded";
import { Pin as PinIcon } from "@styled-icons/entypo/Pin";
import { Crown as HasControlsIcon } from "@styled-icons/fa-solid/Crown";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: `absolute`,
        zIndex: 9,
        width: `100%`,
        height: `100%`,
        top: 0,
        left: 0,
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
        textAlign:`left`,
    },
    rootTeacher:{
        "& $name":{
            backgroundColor: `rgba(255,255,255,0.3)`,
            padding: `0 10px`,
            marginTop: 4,
            borderRadius: 20,
        },

    },
    topCamera:{
        textAlign: `center`,
    },
    bottomCamera:{
        position: `relative`,
        zIndex: 9,
    },
    name: {
        color: `#fff`,
        display: `inline-block`,
        padding: `4px 6px`,
        fontSize: `0.75rem`,
        lineHeight: `1.2`,
        fontWeight: 600,
    },
    roles:{
        position: `absolute`,
        top: 0,
        right: 0,
        backgroundColor: `#fff`,
        borderRadius: `0 0 0 10px`,
        padding : `0 10px`,
    },
    roleIcon:{
        margin: `2px 4px`,
    },
    roleHasControlsIcon:{
        color: amber[500],
    },
    controls:{
        position: `absolute`,
        width: `100%`,
        height: `100%`,
        display: `flex`,
        justifyContent:`center`,
        alignItems:`center`,
        bottom: 0,
        right: 0,
        opacity: 1,
        transition: `all 100ms ease-in-out`,
        visibility: `visible`,
        backdropFilter: `blur(2px)`,
        backgroundColor: `rgba(0,0,0,0.5)`,
    },
    controlsIcon:{
        margin: `5px`,
        backgroundColor: `rgba(255,255,255,0.3)`,
        padding: 5,
        fontSize: `inherit`,
        color: `#fff`,
        "&:hover":{},
    },
    controlsIconActive:{
        backgroundColor: amber[500],
        "&:hover":{
            backgroundColor: amber[500],
        },
    },
    menuPaper:{
        borderRadius: 10,
    },
    menuPaperTrophies:{
        borderRadius: 30,
        "& $menuItem":{
            padding: 5,
            color: amber[500],
        },
    },
    menuItem:{
        color: theme.palette.grey[800],
        fontWeight: 600,
    },
    menuItemActive:{
        color: red[500],
        backgroundColor: fade(red[100], 0.5),
        "&:hover": {
            backgroundColor: fade(red[100], 0.8),
        },
    },
    menuItemIcon:{
        marginRight: 10,
        padding: 5,
    },
    menuItemIconActive:{
        color: red[500],
    },
    expand:{
        position: `absolute`,
        top: 5,
        left: 5,
        "& svg":{
            color: `#fff`,
        },
    },
    iconButton:{
        fontSize: `inherit`,
    },
}));

interface UserCameraActionsType {
    user: any;
}

function UserCameraActions (props: UserCameraActionsType) {
    const { user } = props;
    const classes = useStyles();

    const {
        roomId, isTeacher, sessionId,
    } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const isSelf = sessionId === user.id;

    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);
    const [ localCamera, setLocalCamera ] = useState(false);
    const [ localMicrophone, setLocalMicrophone ] = useState(true);

    const [ moreEl, setMoreEl ] = useState<null | HTMLElement>(null);
    const handleMoreOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    const [ trophyEl, setTrophyEl ] = useState<null | HTMLElement>(null);
    const handleTrophyOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setTrophyEl(event.currentTarget); };
    const handleTrophyClose = () => { setTrophyEl(null); };

    const [ micOn, setMicOn ] = useState<boolean>(false);

    const [ muteMutation ] = useMutation(MUTE, {
        context: {
            target: SFU_LINK,
        },
    });
    const { refetch } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });

    const [ hostMutation ] = useMutation(MUTATION_SET_HOST, {
        context: {
            target: LIVE_LINK,
        },
    });

    function giveControls (user:any){
        hostMutation({
            variables: {
                roomId,
                hostId: user.id,
            },
        });
    }

    function toggleVideoState (): void {
        setLocalCamera(!localCamera);
        handleMoreClose();
    }

    function toggleAudioStatee (): void {
        setLocalMicrophone(!localMicrophone);
        handleMoreClose();
    }

    function handlePinnedUser (id: any){
        id === pinnedUser ? setPinnedUser(undefined) : setPinnedUser(id);
    }

    useEffect(() => {
        if (webrtc.isLocalAudioEnabled(user.id) !== undefined) {
            setMicOn(webrtc.isLocalAudioEnabled(user.id));
        }
    }, [ webrtc.isLocalAudioEnabled(user.id) ]);

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
            webrtc.localAudioToggle(user.id);
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

    async function toggleAudioState () {
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
        <div
            className={classes.root}>
            <Grid className={classes.controls}>
                <ExpandCamera user={user} />

                <Grid item>
                    {isTeacher && !user.isTeacher &&
                        <IconButton
                            component="a"
                            aria-label="Trophy button"
                            aria-controls="trophy-popover"
                            aria-haspopup="true"
                            size="small"
                            className={classes.controlsIcon}
                            onClick={handleTrophyOpen}
                        >
                            <TrophyIcon size="0.85em"/>
                        </IconButton>
                    }

                    {hasControls &&
                        <IconButton
                            component="a"
                            aria-label="More controls button"
                            aria-controls="more-controls-popover"
                            aria-haspopup="true"
                            size="small"
                            className={clsx(classes.controlsIcon, {
                                [classes.controlsIconActive] : user.id === pinnedUser,
                            })}
                            onClick={() => handlePinnedUser(user.id)}
                        >
                            <PinIcon size="1em"/>
                        </IconButton>
                    }

                    <IconButton
                        component="a"
                        aria-label="More controls button"
                        aria-controls="more-controls-popover"
                        aria-haspopup="true"
                        size="small"
                        className={classes.controlsIcon}
                        onClick={handleMoreOpen}
                    >
                        <DotsVerticalRoundedIcon size="1em"/>
                    </IconButton>

                    <Menu
                        id="control-menu"
                        anchorEl={moreEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: `bottom`,
                            horizontal: `center`,
                        }}
                        transformOrigin={{
                            vertical: `top`,
                            horizontal: `center`,
                        }}
                        open={Boolean(moreEl)}
                        MenuListProps={{
                            onPointerLeave: handleMoreClose,
                        }}
                        onClose={handleMoreClose}
                    >

                        <MenuItem
                            className={classes.menuItem}
                            onClick={(toggleAudioState)}>
                            {localMicrophone && <><MicFillIcon
                                className={classes.menuItemIcon}
                                size="1rem"/><FormattedMessage id="toggle_microphone_off"/></> }
                            {!localMicrophone && <><MicDisabledIcon
                                className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                                size="1rem"/><FormattedMessage id="toggle_microphone_on"/></> }
                        </MenuItem>

                        <ToggleCamera user={user}/>

                        <MenuItem
                            className={classes.menuItem}
                            onClick={(toggleVideoState)}>
                            {localCamera && <><CameraVideoFillIcon
                                className={classes.menuItemIcon}
                                size="1rem"/><FormattedMessage id="toggle_camera_off"/></> }
                            {!localCamera && <>
                                <CameraDisabledIcon
                                    className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                                    size="1rem"/><FormattedMessage id="toggle_camera_on"/></> }
                        </MenuItem>

                        {hasControls && !user.isHost && user.isTeacher &&
                            <MenuItem
                                className={classes.menuItem}
                                onClick={() => giveControls(user)}>
                                <HasControlsIcon className={classes.menuItemIcon} /><FormattedMessage id="toggle_room_controls"/>
                            </MenuItem>
                        }

                    </Menu>

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
                            onClick={handleTrophyClose}><TrophyIcon size="1.2rem"/></MenuItem>
                        <MenuItem
                            className={classes.menuItem}
                            onClick={handleTrophyClose}><HandThumbsUpFillIcon size="1.2rem"/></MenuItem>
                        <MenuItem
                            className={classes.menuItem}
                            onClick={handleTrophyClose}><StarFillIcon size="1.2rem"/></MenuItem>
                        <MenuItem
                            className={classes.menuItem}
                            onClick={handleTrophyClose}><HeartFillIcon size="1.2rem"/></MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </div>
    );
}

export default UserCameraActions;

function ToggleCamera (props:any){
    const { user } = props;
    const classes = useStyles();

    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const isSelf = sessionId === user.id;

    const [ cameraOn, setCameraOn ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isVideoManuallyDisabled, setIsVideoManuallyDisabled ] = useState<boolean>(false);
    const [ muteMutation ] = useMutation(MUTE, {
        context: {
            target: SFU_LINK,
        },
    });
    const { refetch } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });
    const webrtc = useContext(WebRTCContext);
    // NOTE: This is the logic for the frontend performance. If this logic goes well, we will restore it again.
    // const isCameraVisible = useIsElementInViewport(cameraRef);

    useEffect(() => {
        if (isLoading && webrtc.isLocalVideoEnabled(user.id)) {
            setIsLoading(false);
        }
    }, [ webrtc.isLocalVideoEnabled(user.id) ]);

    useEffect(() => {
        if (webrtc.isLocalVideoEnabled(user.id) !== undefined) {
            setCameraOn(webrtc.isLocalVideoEnabled(user.id));
        }
    }, [ webrtc.isLocalVideoEnabled(user.id) ]);

    async function toggleInboundVideoState () {
        const localSession = sessions.get(sessionId);
        if (localSession?.isHost) {
            const notification: MuteNotification = {
                roomId,
                sessionId: user.id,
                video: !cameraOn,
            };
            const muteNotification = await muteMutation({
                variables: notification,
            });
            if (muteNotification?.data?.mute?.video != null) {
                setCameraOn(muteNotification.data.mute.video);
            }
        } else {
            webrtc.localVideoToggle(user.id);
        }
    }

    async function toggleOutboundVideoState () {
        const notification: MuteNotification = {
            roomId,
            sessionId: user.id,
            video: !cameraOn,
        };
        const muteNotification = await muteMutation({
            variables: notification,
        });
        if (muteNotification?.data?.mute?.video != null) {
            setCameraOn(muteNotification.data.mute.video);
        }
    }

    async function toggleVideoState (): Promise<void> {
        const { data } = await refetch();
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
        setIsVideoManuallyDisabled(!webrtc.isLocalVideoEnabled(user.id));
    }

    return (
        <>
            <MenuItem
                className={classes.menuItem}
                onClick={toggleVideoState}>
                {cameraOn && <><CameraVideoFillIcon
                    className={classes.menuItemIcon}
                    size="1rem"/><FormattedMessage id="toggle_camera_off"/></> }
                {!cameraOn && <>
                    <CameraDisabledIcon
                        className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                        size="1rem"/><FormattedMessage id="toggle_camera_on"/></> }
            </MenuItem>
        </>
    );
}

function ExpandCamera (props:any){
    const { user } = props;
    const classes = useStyles();

    function fullScreenCamera () {
        const videoId = `camera:${user.id}`;
        const video = document.getElementById(videoId) as any;
        if (!video) return;

        if (video.requestFullscreen)
            video.requestFullscreen();
        else if (video.webkitRequestFullscreen)
            video.webkitRequestFullscreen(); // to support on Safari
        else if (video.msRequestFullScreen)
            video.msRequestFullScreen(); // to support on Edge
    }

    return(
        <div className={classes.expand}>
            <IconButton
                component="a"
                aria-label="Expand video"
                size="small"
                className={classes.controlsIcon}
                style={{
                    background: `none`,
                }}
                onClick={() => fullScreenCamera()}
            >
                <ExpandIcon size="0.75em" />
            </IconButton>
        </div>

    );
}
