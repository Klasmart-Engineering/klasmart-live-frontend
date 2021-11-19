import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import UserCameraDetails from "./userCameraDetails";
import ReactPlayer from "@/components/react-player";
import { useCameraContext } from "@/providers/Camera";
import { useSessionContext } from "@/providers/session-context";
import { WebRTCContext } from "@/providers/WebRTCContext";
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
    useRef,
    useState,
} from "react";
import  vad  from "voice-activity-detection";
import { useSessions } from "@/data/live/state/useSessions";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: `#31313c`,
        borderRadius: 12,
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
    speaking:{
        order: 2,
        boxShadow: `0px 0px 0px 2px #ffe000, 0px 6px 4px 1px rgb(255 224 0 / 10%)`,
    },
}));

interface UserCameraType {
    user: any;
    actions?: boolean;
    variant?: "medium" | "large" | "small";
}

function UserCamera (props: UserCameraType) {
    const {
        user,
        variant,
        actions = true,

    } = props;
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const enableSpeakingActivity = false;
    const [ isSpeaking, setIsSpeaking ] = useState(false);
    const [ speakingActivity, setSpeakingActivity ] = useState(0);

    const [ camOn, setCamOn ] = useState(true);
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

    function audioDetector (stream:any) {
        const audioContext = new AudioContext();

        const options = {
            minNoiseLevel: 0.3,
            maxNoiseLevel: 0.7,
            noiseCaptureDuration: 1500,
            avgNoiseMultiplier: 0.3,
            smoothingTimeConstant: 0.9,
            onVoiceStart: function () { setIsSpeaking(true); },
            onVoiceStop: function () { setIsSpeaking(false); },
            onUpdate: function (val:any) { setSpeakingActivity(val); },
        };
        vad(audioContext, stream, options);
    }

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
        setCamOn(webrtc.isVideoEnabledByProducer(user.id) && !webrtc.isVideoDisabledLocally(user.id));
    }, [ webrtc.isVideoEnabledByProducer(user.id), webrtc.isVideoDisabledLocally(user.id) ]);

    useEffect(() => {
        userCamera && enableSpeakingActivity && audioDetector(userCamera);
    }, [ userCamera ]);

    return (
        <Grid
            container
            className={clsx(classes.root, {
                // [classes.speaking]: isSpeaking,
                [classes.self]: isSelf,
                [classes.videoDisabled]: !isSelf && !webrtc.isVideoEnabledByProducer(user.id),
                [classes.rootSm]: isSmDown,
                [classes.rootLarge]: variant === `large`,
            })}
            id={`participant:${user.id}`}
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
                    speakingActivity={speakingActivity}
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
                    !userCamera || !userSession || !camOn ? <NoCamera
                        name={user.name}
                        variant={variant} /> : <></>
                }
                <audio
                    ref={audioRef}
                    autoPlay={true}
                    muted={isSelf}
                />
            </Grid>
        </Grid>
    );
}

export default UserCamera;
