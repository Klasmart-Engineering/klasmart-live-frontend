import {
    hasControlsState,
    pinnedUserState,
} from "../../../store/layoutAtoms";
import { useSynchronizedState } from "../../../whiteboard/context-providers/SynchronizedStateProvider";
import {
    LIVE_LINK,
    LocalSessionContext,
    SFU_LINK,
} from "../../providers/providers";
import { RoomContext } from "../../providers/roomContext";
import {
    GLOBAL_MUTE_QUERY,
    MUTE,
    MuteNotification,
    WebRTCContext,
} from "../../providers/WebRTCContext";
import {
    MUTATION_REWARD_TROPHY,
    MUTATION_SET_HOST,
} from "../utils/graphql";
import { fullScreenById } from "../utils/utils";
import {
    useMutation,
    useQuery,
} from "@apollo/client";
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
import { InvertColors as InvertColors } from "@styled-icons/material/InvertColors";
import { InvertColorsOff as InvertColorsOff } from "@styled-icons/material/InvertColorsOff";
import clsx from "clsx";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React,
{
    useCallback,
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
    },
    controlsTeacher:{
        backdropFilter: `blur(2px)`,
        backgroundColor: `rgba(0,0,0,0.3)`,
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
    menuItemIcon:{
        marginRight: 10,
        padding: 5,
        color: `#0c78d5`,
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
    expanded: boolean;
}

function UserCameraActions (props: UserCameraActionsType) {
    const { user, expanded } = props;
    const classes = useStyles();

    const { isTeacher, roomId } = useContext(LocalSessionContext);

    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);

    const [ moreEl, setMoreEl ] = useState<null | HTMLElement>(null);
    const handleMoreOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    const [ trophyEl, setTrophyEl ] = useState<null | HTMLElement>(null);
    const handleTrophyOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setTrophyEl(event.currentTarget); };
    const handleTrophyClose = () => { setTrophyEl(null); };

    const [ rewardTrophyMutation ] = useMutation(MUTATION_REWARD_TROPHY, {
        context: {
            target: LIVE_LINK,
        },
    });
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({
        variables: {
            roomId,
            user,
            kind,
        },
    });

    function handlePinnedUser (id: any){
        id === pinnedUser ? setPinnedUser(undefined) : setPinnedUser(id);
    }

    return (
        <div
            className={classes.root}>
            <Grid className={clsx(classes.controls, {
                [classes.controlsTeacher] : isTeacher,
            })}>
                { expanded &&
                    <ExpandCamera user={user} />
                }

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

                    {/* TODO: Pin user
                    hasControls &&
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
                        */}

                    {isTeacher &&
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
                    }

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

                        <ToggleMic user={user} />
                        <ToggleCamera user={user} />

                        {hasControls && <ToggleCanvas user={user} />}

                        {hasControls && !user.isHost && user.isTeacher &&
                            <ToggleControls user={user} />
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
    const webrtc = useContext(WebRTCContext);

    const [ camOn, setCamOn ] = useState<boolean>(true);

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
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
        <MenuItem
            className={classes.menuItem}
            onClick={toggleVideoState}>
            {camOn ?
                <>
                    <CameraVideoFillIcon
                        className={classes.menuItemIcon}
                        size="1rem"/>
                    <FormattedMessage id="toggle_camera_off"/>
                </> :
                <>
                    <CameraDisabledIcon
                        className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                        size="1rem"/>
                    <FormattedMessage id="toggle_camera_on"/>
                </>
            }
        </MenuItem>
    );
}

function ToggleMic (props:any){
    const { user } = props;
    const classes = useStyles();

    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const isSelf = sessionId === user.id;

    const [ micOn, setMicOn ] = useState<boolean>(true);

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
        <MenuItem
            className={classes.menuItem}
            onClick={toggleAudioState}>
            {micOn ?
                <>
                    <MicFillIcon
                        className={classes.menuItemIcon}
                        size="1rem"/>
                    <FormattedMessage id="toggle_microphone_off"/>
                </> :
                <>
                    <MicDisabledIcon
                        className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                        size="1rem"/>
                    <FormattedMessage id="toggle_microphone_on"/>
                </>
            }
        </MenuItem>
    );
}

function ToggleControls (props:any){
    const { user } = props;
    const classes = useStyles();

    const { roomId } = useContext(LocalSessionContext);

    const [ hostMutation ] = useMutation(MUTATION_SET_HOST, {
        context: {
            target: LIVE_LINK,
        },
    });

    function giveControls (user:any){
        hostMutation({
            variables: {
                roomId,
                nextHostId: user.id,
            },
        });
    }

    return (
        <>
            <MenuItem
                className={classes.menuItem}
                onClick={() => giveControls(user)}>
                <HasControlsIcon
                    className={classes.menuItemIcon}
                    size="1rem" /><FormattedMessage id="toggle_room_controls"/>
            </MenuItem>
        </>
    );
}

function ToggleCanvas (props:any){
    const { user } = props;
    const classes = useStyles();

    const { actions: { setPermissions, getPermissions } } = useSynchronizedState();
    const { actions: { clear } } = useToolbarContext();

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
        <>
            <MenuItem
                className={classes.menuItem}
                onClick={toggleAllowCreateShapes}>

                {permissions.allowCreateShapes ?
                    <>
                        <InvertColors
                            className={classes.menuItemIcon}
                            size="1rem"/>
                        <FormattedMessage id="whiteboard_permissionControls_listItemText_disallow"/>
                    </> :
                    <>
                        <InvertColorsOff
                            className={clsx(classes.menuItemIcon, classes.menuItemIconActive)}
                            size="1rem"/>
                        <FormattedMessage id="whiteboard_permissionControls_listItemText_allow"/>
                    </>
                }
            </MenuItem>
        </>
    );
}

function ExpandCamera (props:any){
    const { user } = props;
    const classes = useStyles();

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
                onClick={() => fullScreenById(`camera:${user.id}`)}
            >
                <ExpandIcon size="0.75em" />
            </IconButton>
        </div>

    );
}
