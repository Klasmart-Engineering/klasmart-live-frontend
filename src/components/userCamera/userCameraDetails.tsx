import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { Microphone as MicIcon } from '@styled-icons/boxicons-solid/Microphone';
import { Crown as HasControlsIcon } from "@styled-icons/fa-solid/Crown";
import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
import { SpeakerOff } from '@styled-icons/fluentui-system-filled/SpeakerOff';
import clsx from "clsx";
import { Track } from "@kl-engineering/live-state/ui";
import React,
{ VoidFunctionComponent } from "react";
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
        pointerEvents: `none`,
    },
    rootTeacher:{},
    rootSmall:{},
    rootLarge:{
        "& $nameContainer":{
            position: `static`,
            textAlign: `center`,
        },
        "& $name":{
            position: `relative`,
            backgroundColor: `rgba(255,255,255,0.3)`,
            fontSize: `1em`,
            borderRadius: `8px`,
            margin: `10px 100px 10px 80px`,
            padding: `2px 20px`,
            display: `inline-flex`,
            alignItems: `center`,
            maxWidth: `calc(100% - 230px)`,

            "& span": {
                maxWidth: `none`,

                "& + svg": {
                    minWidth: `20px`,
                },
            },

            "&:after":{
                content: `inherit`,
            },
        },
    },
    nameContainer:{
        position: `absolute`,
        left: 0,
        bottom: 0,
        width: `100%`,
    },
    name: {
        color: `#fff`,
        verticalAlign: `bottom`,
        padding: `6px 10px`,
        fontSize: `0.8em`,
        fontWeight: theme.typography.fontWeightBold as number,
        position: `relative`,

        "& > span": {
            marginRight: `5px`,

            "& + svg": {
                minWidth: `11px`,
            },
        },

        "&:after":{
            content: `''`,
            position: `absolute`,
            bottom: 0,
            left: 0,
            height: `100%`,
            width: `35%`,
            background: `linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)`,
            zIndex: `-1`,
        },
    },
    textOverflow: {
        display: `inline-block`,
        verticalAlign: `middle`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        whiteSpace: `nowrap`,
        maxWidth: `calc(100% - 20px)`,
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
        color: theme.palette.text.primary,
        margin: `0.2em`,
    },
    roleHasControlsIcon:{
        color: amber[500],
    },
    speakingActivity:{
        display: `flex`,
        height: 10,
        alignItems: `center`,
        marginLeft: 5,

        "& div":{
            width: 4,
            height: 0,
            minHeight: 4,
            borderRadius: 10,
            background: `#fff`,
            margin: 1,
        },
    },
    gridItem: {
        display: `block`,
        width: `100%`,
    },
    iconRootLarge: {
        minWidth: `20px`,
    },
}));

interface UserCameraDetailsType {
    user: Session;
    variant?: "medium" | "large" | "small";
    mic: Track;
}

function UserCameraDetails (props: UserCameraDetailsType) {
    const {
        user,
        variant,
        mic,
    } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, {
            [classes.rootTeacher]: user.isTeacher,
            [classes.rootSmall]: variant === `small`,
            [classes.rootLarge]: variant === `large`,
        })}>
            {user.isTeacher && <UserRoles user={user} />}
            <UserName
                user={user}
                mic={mic}
            />
        </div>
    );
}

export default UserCameraDetails;

interface UserRolesType {
    user: Session;
}

function UserRoles (props: UserRolesType){
    const { user } = props;
    const classes = useStyles();

    return(
        <div className={classes.roles}>
            <TeacherIcon
                size="1em"
                className={classes.roleIcon} />
            {user.isHost && <HasControlsIcon
                size="1em"
                className={`${classes.roleIcon} ${classes.roleHasControlsIcon}`} />}
        </div>
    );
}

const UserName: VoidFunctionComponent<{
    user: Session;
    mic: Track;
}> = ({ user, mic }) => {
    const classes = useStyles();

    const { sessionId } = useSessionContext();
    const isSelf = user.id === sessionId;

    return(
        <div className={classes.nameContainer}>
            <Typography className={classes.name}>
                <span className={classes.textOverflow}>
                    {isSelf ? <FormattedMessage id="you"/> : user.name}
                </span>
                {
                    mic.isMine !== undefined && <>
                        {mic.isPausedAtSource ? <MicDisabledIcon size="0.85em"/> : <MicIcon size="0.85em"/>}
                        {((mic.isPausedLocally && mic.isMine === false) || mic.isPausedGlobally) && <SpeakerOff size="1em" />}
                    </>
                }
            </Typography>
        </div>
    );
};
