import { LocalSessionContext } from "../../providers/providers";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { Crown as HasControlsIcon } from "@styled-icons/fa-solid/Crown";
import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
import React, { useContext } from "react";

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
        backgroundColor: `rgba(0, 0, 0, 0.25)`,
        borderRadius: `0 12px 0`,
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
    const { sessionId } = useContext(LocalSessionContext);
    const isSelf = user.id === sessionId ? true : false;

    if(user.isTeacher){
        return(
            <div className={`${classes.root} ${classes.rootTeacher}`}>
                <div className={classes.topCamera}>
                    <Typography className={classes.name}>{isSelf ? `You` : user.name}</Typography>
                    <div className={classes.roles}>
                        <TeacherIcon
                            size="1.25rem"
                            className={classes.roleIcon}/>
                        {user.isHost && <HasControlsIcon
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
                <Typography className={classes.name}>
                    {user.name} {!user.hasAudio && <MicDisabledIcon size="0.85rem"/>}
                </Typography>
            </div>
        </div>
    );
}

export default UserCameraDetails;
