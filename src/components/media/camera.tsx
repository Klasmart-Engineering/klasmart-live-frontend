
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    GLOBAL_MUTE_QUERY,
    MUTE,
    MuteNotification,
    WebRTCContext,
    WebRTCContextInterface,
} from "@/providers/WebRTCContext";
import { State } from "@/store/store";
import PermissionControls from "@/whiteboard/components/WBPermissionControls";
import StyledIcon from "@/styled/icon";
import {
    useMutation,
    useQuery,
} from "@apollo/client";
import Grid,
{ GridProps } from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu,
{ MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
    withStyles,
} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BoxArrowUpLeft as BoxArrowUpLeftIcon } from "@styled-icons/bootstrap/BoxArrowUpLeft";
import { DotsVerticalRounded as DotsVerticalRoundedIcon } from "@styled-icons/boxicons-regular/DotsVerticalRounded";
import { Chalkboard as ChalkboardIcon } from "@styled-icons/boxicons-solid/Chalkboard";
import { Crown as CrownIcon } from "@styled-icons/boxicons-solid/Crown";
import { Microphone as MicrophoneOnIcon } from "@styled-icons/boxicons-solid/Microphone";
import { MicrophoneOff as MicrophoneOffIcon } from "@styled-icons/boxicons-solid/MicrophoneOff";
import { Video as VideoOnIcon } from "@styled-icons/boxicons-solid/Video";
import { VideoOff as VideoOffIcon } from "@styled-icons/boxicons-solid/VideoOff";
import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import React,
{
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

const PARTICIPANT_INFO_ZINDEX = 1;
const ICON_ZINDEX = 2;
const PRIMARY_COLOR = `#0E78D5`;
const SECONDARY_COLOR = `#dc004e`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iconGrid: {
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            paddingLeft: theme.spacing(0.5),
        },
        noHoverIcon: {
            "&:hover": {
                color: `#FFF`,
            },
        },
        moreControlsMenuItem: {
            "&:hover": {
                backgroundColor: `transparent`,
            },
        },
    }));

export enum CameraOrder {
    Default = 0,
    HostTeacher = 1,
    TeacherSelf = 2,
    Teacher = 3,
    // StudentSpeaking = 4, // TODO: https://calmisland.atlassian.net/browse/KL-3907
    StudentSelf = 9,
    Student = 10,
}

export function getCameraOrder (userSession: Session, isLocalUser: boolean): CameraOrder {
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
        order = CameraOrder.Student;
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

export default function Camera ({
    session,
    mediaStream,
    muted,
    square,
    noBorderRadius,
    ...other
}: CameraProps): JSX.Element {
    const theme = useTheme();

    const { sessionId: userSelfSessionId } = useSessionContext();
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
    }, [ videoRef.current, mediaStream ]);

    const cameraRef = useRef<HTMLDivElement>(null);
    return (
        <Grid {...other}>
            <Paper
                ref={cameraRef}
                component="div"
                elevation={2}
                style={{
                    position: `relative`,
                    width: `100%`,
                    backgroundColor: `#193d6f`,
                    borderRadius: noBorderRadius ? 0 : 12,
                    height: 0,
                    paddingBottom: square ? `75%` : `56.25%`,
                }}
            >
                {mediaStream ?
                    <>
                        <video
                            ref={videoRef}
                            playsInline
                            id={session ? `camera:${session.id}` : undefined}
                            autoPlay={true}
                            muted={true}
                            style={{
                                backgroundColor: `#000`,
                                borderRadius: 12,
                                objectFit: `cover`,
                                position: `absolute`,
                                top: 0,
                                left: 0,
                                width: `100%`,
                                height: `100%`,
                            }}
                        />
                        <audio
                            ref={audioRef}
                            autoPlay={true}
                            muted={muted}
                        />
                    </>
                    :
                    <Typography
                        align="center"
                        style={{
                            color: `#FFF`,
                            top: `50%`,
                            left: `50%`,
                            marginRight: `-50%`,
                            position: `absolute`,
                            transform: `translate(-50%, -50%)`,
                        }}
                    >
                        <CameraOffIcon size="1.5rem" />
                    </Typography>
                }
            </Paper>
        </Grid>
    );
}
