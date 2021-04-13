import {
    pinnedUserState,
    usersState,
} from "../../states/layoutAtoms";
import {
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
    Typography,
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
import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
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
}));

interface UserCameraDetailsType {
    user: any;
}

function UserCameraDetails (props: UserCameraDetailsType) {
    const { user } = props;
    const classes = useStyles();

    if(user.role === `teacher`){
        return(
            <div className={`${classes.root} ${classes.rootTeacher}`}>
                <div className={classes.topCamera}>
                    <Typography className={classes.name}>{user.name}</Typography>
                    <div className={classes.roles}>
                        <TeacherIcon
                            size="1.25rem"
                            className={classes.roleIcon}/>
                        {user.hasControls && <HasControlsIcon
                            size="1.25rem"
                            className={`${classes.roleIcon} ${classes.roleHasControlsIcon}`}/>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={classes.root}>
            <div className={classes.topCamera}></div>
            <div className={classes.bottomCamera}>
                <Typography className={classes.name}>{user.name}</Typography>
            </div>
        </div>
    );
}

export default UserCameraDetails;
