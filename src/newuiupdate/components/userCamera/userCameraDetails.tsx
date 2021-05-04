import { LocalSessionContext } from "../../providers/providers";
import { WebRTCContext } from "../../providers/WebRTCContext";
import {
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { Crown as HasControlsIcon } from "@styled-icons/fa-solid/Crown";
import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
import clsx from "clsx";
import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";

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
    rootSmall:{},
    rootLarge:{
        "& $name":{
            fontSize: `2rem`,
            borderRadius: `8px`,
            margin: `10px`,
            padding: `2px 20px`,
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
        padding: `6px 10px`,
        lineHeight: `1.2`,
        fontSize: `0.8em`,
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
        padding : `0 0.5em`,
    },
    roleIcon:{
        margin: `0.2em`,
    },
    roleHasControlsIcon:{
        color: amber[500],
    },
}));

interface UserCameraDetailsType {
    user: any;
    variant?: "default" | "large" | "small";
}

function UserCameraDetails (props: UserCameraDetailsType) {
    const { user, variant } = props;
    const classes = useStyles();
    const theme = useTheme();

    const { sessionId } = useContext(LocalSessionContext);
    const webrtc = useContext(WebRTCContext);

    const isSelf = user.id === sessionId ? true : false;

    if(user.isTeacher){
        return(
            <div className={clsx(classes.root, classes.rootTeacher, {
                [classes.rootSmall]: variant === `small`,
                [classes.rootLarge]: variant === `large`,
            })}>
                <div className={classes.topCamera}>
                    <Typography className={classes.name}>{isSelf ? <FormattedMessage id="you"/> : user.name} {!webrtc.isLocalAudioEnabled(user.id) && <MicDisabledIcon size="0.85em"/>}</Typography>
                    <div className={classes.roles}>
                        <TeacherIcon
                            size="1em"
                            className={classes.roleIcon}/>
                        {user.isHost && <HasControlsIcon
                            size="1em"
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
                    {isSelf ? <FormattedMessage id="you"/> : user.name} {!webrtc.isLocalAudioEnabled(user.id) && <MicDisabledIcon size="0.85em"/>}
                </Typography>
            </div>
        </div>
    );
}

export default UserCameraDetails;
