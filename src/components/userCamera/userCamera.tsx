import {
    pauseAllCamerasState,
    pauseAllMicrophonesState,
} from "../toolbar/toolbarMenus/globalActionsMenu/globalActionsMenu";
import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import UserCameraDetails from "./userCameraDetails";
import { BG_COLOR_CAMERA } from "@/config";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { useStream } from "@kl-engineering/live-state/ui";
import {
    Grid,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { useInViewport } from "react-in-viewport";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const ACTIVE_AUDIO_THRESHOLD = 0.2;

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: BG_COLOR_CAMERA,
        borderRadius: 12,
        transform: `translateZ(0)`, // Apply border-radius for Safari
        width: `100%`,
        minHeight: 96,
        margin: `0 auto`,
        height: `100%`,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        order: 99,
        outline: `0px solid rgba(20,100,200,0.5)`,
        transition: `outline-width 100ms linear`,
        "& video": {
            objectFit: `cover`,
        },
    },
    rootSm:{
        minHeight: 100,
        "& video": {
            objectFit: `contain`,
        },
    },
    rootLarge:{
        fontSize: `1.5rem`,
        "& video": {
            objectFit: `contain`,
        },
    },
    activeAudio: {
        outlineWidth: `3px`,
    },
    video:{
        width: `100% !important`,
        height: `100% !important`,
        position: `absolute`,
        top: 0,
        left: 0,
    },
    self:{
        order: 1,
    },
    videoDisabled:{
        order: 109,
    },
}));

interface UserCameraProps {
    user: Session;
    actions?: boolean;
    variant?: "medium" | "large" | "small";
}

const UserCamera = ({
    user,
    variant,
    actions = true,
}: UserCameraProps) => {
    const classes = useStyles();
    const intl = useIntl();
    const [ isHover, setIsHover ] = useState(false);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const mySession = useSessionContext();
    const isSelf = (user.id === mySession.sessionId);
    const sessions = useSessions();
    const userSession = sessions.get(user.id);
    const {
        audio,
        video,
        stream: mediaStream,
    } = useStream(user.id);

    const mediaRef = useRef<HTMLVideoElement>(null);
    const isAudioActive = false;
    const { inViewport } = useInViewport(mediaRef);

    useEffect(() => {
        if(!mediaRef.current) { return; }
        mediaRef.current.srcObject = mediaStream || null;
    }, [ mediaRef.current, mediaStream ]);

    {
        const sessions = useSessions();
        const localSession = sessions.get(mySession.sessionId);
        const pauseAllMicrophones = useRecoilValue(pauseAllMicrophonesState);
        useEffect(() => {
            if(!localSession?.isHost || !mySession.isTeacher || userSession?.isTeacher) { return; }
            audio.globalPause.execute(pauseAllMicrophones);
        }, [
            localSession?.isHost,
            pauseAllMicrophones,
            audio.track,
        ]);

        const pauseAllCameras = useRecoilValue(pauseAllCamerasState);
        useEffect(() => {
            if(!localSession?.isHost || !mySession.isTeacher || userSession?.isTeacher) { return; }
            video.globalPause.execute(pauseAllCameras);
        }, [
            localSession?.isHost,
            pauseAllCameras,
            video.track,
        ]);
    }

    const pauseCameraTimeout = useRef<NodeJS.Timeout>();
    useEffect(() => {
        if (variant === `large` || isSelf || userSession?.isHost) return;
        if (inViewport) {
            if (pauseCameraTimeout.current) {
                clearTimeout(pauseCameraTimeout.current);
            }
            video.pause.execute(false);
        } else {
            pauseCameraTimeout.current = setTimeout(() => {
                video.pause.execute(true);
            }, 3000);
        }

        return () => {
            if (pauseCameraTimeout.current) {
                clearTimeout(pauseCameraTimeout.current);
            }
        };
    }, [ inViewport, userSession?.isHost ]);

    return (
        <Grid
            container
            className={clsx(classes.root, {
                [classes.self]: isSelf,
                [classes.videoDisabled]: !video.isConsumable,
                [classes.rootSm]: isSmDown,
                [classes.rootLarge]: variant === `large`,
                [classes.activeAudio]: variant !== `large` && isAudioActive,
            })}
            id={`participant:${user.id}`}
            onClick={() => {console.log(`mic`, audio); console.log(`cam`, video);}}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Grid
                item
                xs
            >
                <UserCameraDetails
                    variant={variant}
                    user={user}
                    mic={audio}
                />
                {
                    actions && isHover &&
                    <UserCameraActions
                        user={user}
                        expanded={video.isConsumable && !process.env.IS_CORDOVA_BUILD}
                        mic={audio}
                        camera={video}
                    />
                }
                <video
                    ref={mediaRef}
                    autoPlay
                    playsInline
                    muted={isSelf}
                    id={`camera:${userSession?.id}`}
                    className={classes.video}
                />
                {
                    !video.isConsumable &&
                    <NoCamera
                        name={user.name}
                        variant={variant}
                    />
                }
            </Grid>
        </Grid>
    );
};

export default UserCamera;
