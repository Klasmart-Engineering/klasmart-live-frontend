import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import UserCameraDetails from "./userCameraDetails";
import ReactPlayer from "@/components/react-player";
import { BG_COLOR_CAMERA } from "@/config";
import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useCameraContext } from "@/providers/Camera";
import { useSessionContext } from "@/providers/session-context";
import { WebRTCContext } from "@/providers/WebRTCContext";
import {
    isActiveGlobalMuteAudioState,
    isActiveGlobalMuteVideoState,
} from "@/store/layoutAtoms";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
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

const UserCamera =  ({
    user,
    variant,
    actions = true,
}: UserCameraProps) => {
    const classes = useStyles();
    const intl = useIntl();
    const [ isHover, setIsHover ] = useState(false);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const camMuteCurrent = useRecoilValue(isActiveGlobalMuteVideoState);

    const [ camOn, setCamOn ] = useState(true);
    const [ micOn, setMicOn ] = useState(true);
    const micMuteCurrent = useRecoilValue(isActiveGlobalMuteAudioState);
    const { cameraStream } = useCameraContext();
    const {
        camera,
        setCamera,
        sessionId,
    } = useSessionContext();

    const sessions = useSessions();
    const webrtc = useContext(WebRTCContext);

    const isSelf = user.id === sessionId ? true : false;

    const userSession = sessions.get(user.id);
    const userCamera = isSelf ? camera : webrtc.getCameraStream(user.id);

    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(isSelf){
            setCamera(cameraStream);
        }
    }, [ cameraStream, isSelf ]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = userCamera ? userCamera : null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = userCamera ? userCamera : null;
        }
    }, [
        audioRef.current,
        videoRef.current,
        userCamera,
        camOn,
    ]);

    useEffect(() => {
        if (camMuteCurrent !== null) {
            setCamOn(camMuteCurrent);
        } else {
            setCamOn(webrtc.isVideoEnabledByProducer(user.id) && !webrtc.isVideoDisabledLocally(user.id));
        }
    }, [ webrtc.isVideoEnabledByProducer(user.id), webrtc.isVideoDisabledLocally(user.id) ]);

    useEffect(() => {
        if (micMuteCurrent !== null) {
            setMicOn(micMuteCurrent);
        } else {
            setMicOn(webrtc.isAudioEnabledByProducer(user.id) && !webrtc.isAudioDisabledLocally(user.id));
        }
    }, [ webrtc.isAudioEnabledByProducer(user.id), webrtc.isAudioDisabledLocally(user.id) ]);

    const isNoCamera = useMemo(() => {
        return !userCamera || !userSession || !camOn;
    }, [
        userCamera,
        userSession,
        camOn,
    ]);

    return (
        <Grid
            container
            className={clsx(classes.root, {
                [classes.self]: isSelf,
                [classes.videoDisabled]: !isSelf && !webrtc.isVideoEnabledByProducer(user.id),
                [classes.rootSm]: isSmDown,
                [classes.rootLarge]: variant === `large`,
            })}
            id={`participant:${user.id}`}
            aria-videostream={
                isNoCamera ? intl.formatMessage({
                    id: `off`,
                    defaultMessage: `OFF`,
                }) : intl.formatMessage({
                    id: `on`,
                    defaultMessage: `ON`,
                })}
            aria-audiostream={
                micOn ? intl.formatMessage({
                    id: `on`,
                    defaultMessage: `ON`,
                }) : intl.formatMessage({
                    id: `off`,
                    defaultMessage: `OFF`,
                })}
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
                />
                {actions ? isHover && <UserCameraActions
                    user={user}
                    expanded={camOn && !process.env.IS_CORDOVA_BUILD} /> : null}
                <ReactPlayer
                    key={`${userCamera?.id}${userCamera?.active}`}
                    autoPlay
                    url={userCamera}
                    playing={true}
                    playsinline={true}
                    muted={true}
                    id={`camera:${userSession?.id}`}
                    className={classes.video}
                />
                {
                    isNoCamera && <NoCamera
                        name={user.name}
                        variant={variant} />
                }
                <audio
                    ref={audioRef}
                    autoPlay={true}
                    muted={isSelf}
                />
            </Grid>
        </Grid>
    );
};

export default UserCamera;
