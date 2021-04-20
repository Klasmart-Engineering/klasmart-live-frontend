import { pinnedUserState } from "../../states/layoutAtoms";
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
import clsx from "clsx";
import React,
{ useState } from "react";
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
        borderRadius: 10,
        margin: 5,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
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

    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);
    const [ localCamera, setLocalCamera ] = useState(false);
    const [ localMicrophone, setLocalMicrophone ] = useState(true);

    const [ moreEl, setMoreEl ] = useState<null | HTMLElement>(null);
    const handleMoreOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setMoreEl(event.currentTarget); };
    const handleMoreClose = () => { setMoreEl(null); };

    const [ trophyEl, setTrophyEl ] = useState<null | HTMLElement>(null);
    const handleTrophyOpen = (event: React.SyntheticEvent<HTMLAnchorElement>) => { setTrophyEl(event.currentTarget); };
    const handleTrophyClose = () => { setTrophyEl(null); };

    function toggleVideoState (): void {
        setLocalCamera(!localCamera);
        handleMoreClose();
    }

    function toggleAudioState (): void {
        setLocalMicrophone(!localMicrophone);
        handleMoreClose();
    }

    function handlePinnedUser (id: any){
        id === pinnedUser ? setPinnedUser(undefined) : setPinnedUser(id);
    }

    return (
        <div
            className={classes.root}>
            <Grid className={classes.controls}>
                <div className={classes.expand}>
                    <IconButton
                        component="a"
                        aria-label="Expand video"
                        size="small"
                        className={classes.controlsIcon}
                        style={{
                            background: `none`,
                        }}
                    >
                        <ExpandIcon size="0.75em" />
                    </IconButton>
                </div>

                <Grid item>

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
                            disablePadding: true,
                        }}
                        classes={{
                            paper: classes.menuPaper,
                        }}
                        onClose={handleMoreClose}
                    >

                        <MenuItem
                            className={clsx(classes.menuItem, {
                                [classes.menuItemActive]: !localMicrophone,
                            })}
                            onClick={(toggleAudioState)}>
                            {localMicrophone && <><MicFillIcon
                                className={classes.menuItemIcon}
                                size="1rem"/> Disable microphone</> }
                            {!localMicrophone && <><MicDisabledIcon
                                className={classes.menuItemIcon}
                                size="1rem"/> Enable microphone</> }
                        </MenuItem>

                        <MenuItem
                            className={clsx(classes.menuItem, {
                                [classes.menuItemActive]: !localCamera,
                            })}
                            onClick={(toggleVideoState)}>
                            {localCamera && <><CameraVideoFillIcon
                                className={classes.menuItemIcon}
                                size="1rem"/> Disable camera</> }
                            {!localCamera && <><CameraDisabledIcon
                                className={classes.menuItemIcon}
                                size="1rem"/> Enable camera</> }
                        </MenuItem>

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
