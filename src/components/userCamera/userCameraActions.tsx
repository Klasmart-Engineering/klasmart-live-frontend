import PencilIconOff from "@/assets/img/canvas/pencil_icon_off.svg";
import PencilIconOn from "@/assets/img/canvas/pencil_icon_on.svg";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useSetHostMutation } from "@/data/live/mutations/useSetHostMutation";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { hasControlsState } from "@/store/layoutAtoms";
import {
    toggleFullScreenById,
    TooltipIntl,
} from "@/utils/utils";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Box,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
    Tooltip,
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
import { Track } from "@kl-engineering/live-state/ui";
import React,
{
    useCallback,
    useState,
    VoidFunctionComponent,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";
import { StyledIconProps } from "styled-icons/types";

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
    camera: Track;
    mic: Track;
}

const UserCameraActions = ({
    user,
    expanded,
    camera,
    mic,
}: UserCameraActionsProps) => {
    const classes = useStyles();

    const {
        isTeacher,
        roomId,
        sessionId,
    } = useSessionContext();

    const hasControls = useRecoilValue(hasControlsState);

    const isSelf = sessionId === user.id;
    const subTeacher = !user.isHost && user.isTeacher;
    const hasPermission = isTeacher || !user.isTeacher;

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
                {
                    <Box
                        display="flex"
                        className={classes.iconsContainer}>
                        { mic.hasLocation && hasPermission && (isSelf || isTeacher) && <ToggleMic
                            track={mic}
                            local={!isTeacher || isSelf}
                        />
                        }
                        { camera.hasLocation && hasPermission && (isSelf || isTeacher) && <ToggleCamera
                            track={camera}
                            local={!isTeacher || isSelf}
                        />
                        }
                        {!isSelf && isTeacher && (
                            <TooltipIntl id="live.class.stickers">
                                <IconButton
                                    aria-label="Trophy"
                                    className={classes.iconButton}
                                    onClick={handleTrophyOpen}>
                                    <TrophyIcon size="0.7em"/>
                                </IconButton>
                            </TooltipIntl>
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
                }
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
                <ToolTipMenuItem
                    id="give_trophy"
                    icon={<TrophyIcon size="1.2rem"/>}
                    onClick={() => rewardTrophy(user.id, `trophy`)} />
                <ToolTipMenuItem
                    id="encourage"
                    icon={<HandThumbsUpFillIcon size="1.2rem"/>}
                    onClick={() => rewardTrophy(user.id, `awesome`)} />
                <ToolTipMenuItem
                    id="give_star"
                    icon={<StarFillIcon size="1.2rem"/>}
                    onClick={() => rewardTrophy(user.id, `star`)} />
                <ToolTipMenuItem
                    id="give_heart"
                    icon={<HeartFillIcon size="1.2rem"/>}
                    onClick={() => rewardTrophy(user.id, `heart`)} />
            </Menu>
        </>
    );
};

export default UserCameraActions;

const ToggleCamera: VoidFunctionComponent<{
    track: Track;
    local: boolean;
}> = ({ track, local }) => {
    const intl = useIntl();
    const classes = useStyles();
    const isPaused = (local ? track.isPausedLocally : track.isPausedGlobally);
    const everyone = !local || track.isMine;
    const toggleVideoState = () => local ? toggleTrackLocally(track) : toggleTrackGlobally(track);
    const title = intl.formatMessage({
        id: `camera.${everyone?`global`:`local`}.${isPaused?`enable`:`disable`}`,
    });

    return (
        <Tooltip title={title}>
            <IconButton
                aria-label="Camera"
                className={classes.iconButton}
                onClick={toggleVideoState}
            >
                {!isPaused ? <CameraVideoFillIcon size="0.7em"/> : <CameraDisabledIcon size="0.7em"/>}
            </IconButton>
        </Tooltip>
    );
};

const ToggleMic: VoidFunctionComponent<{
    local: boolean;
    track: Track;
}> = ({ local, track }) => {
    const intl = useIntl();
    const classes = useStyles();
    const isPaused = (local ? track.isPausedLocally : track.isPausedGlobally);
    const everyone = !local || track.isMine;
    const toggleAudioState = () => local ? toggleTrackLocally(track) : toggleTrackGlobally(track);
    const title = intl.formatMessage({
        id: `microphone.${everyone?`global`:`local`}.${isPaused?`enable`:`disable`}`,
    });
    return (
        <Tooltip title={title}>
            <IconButton
                aria-label="Microphone"
                className={classes.iconButton}
                onClick={toggleAudioState}
            >
                {!isPaused ? <MicFillIcon size="0.7em"/> : <MicDisabledIcon size="0.7em"/>}
            </IconButton>
        </Tooltip>
    );
};

const toggleTrackLocally = (track: Track) => track.pause.execute(!track.isPausedLocally);
const toggleTrackGlobally = (track: Track) => track.globalPause.execute(!track.isPausedGlobally);

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
        <TooltipIntl id="toggle_room_controls">
            <IconButton
                aria-label="Give controls"
                className={classes.iconButton}
                onClick={() => giveControls(user)}
            >
                <HasControlsIcon size="0.7em"/>
            </IconButton>
        </TooltipIntl>
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
        <TooltipIntl id={permissions.allowCreateShapes ? `canvas.turnOn` : `canvas.turnOff`}>
            <IconButton
                aria-label="Canvas"
                className={classes.iconButton}
                onClick={toggleAllowCreateShapes}>
                <img
                    src={permissions.allowCreateShapes ? PencilIconOn : PencilIconOff}
                    width="15px"
                    height="15px" />
            </IconButton>
        </TooltipIntl>
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
                onClick={() => toggleFullScreenById(`camera:${user.id}`)}
            >
                <ExpandIcon size="0.75em" />
            </IconButton>
        </div>
    );
}

interface MenuProps {
    id: string;
    icon: StyledIconProps;
    onClick: () => void;
}

function ToolTipMenuItem ({
    id,
    icon,
    onClick,
}: MenuProps) {
    const classes = useStyles();
    const intl = useIntl();

    return(
        <Tooltip title={intl.formatMessage({
            id: id,
        })}>
            <MenuItem
                className={classes.menuItem}
                onClick={onClick}>
                {icon}</MenuItem>
        </Tooltip>
    );
}
