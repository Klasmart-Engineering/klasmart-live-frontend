import { LocalSessionContext } from "../../providers/providers";
import { RoomContext } from "../../providers/roomContext";
import { WebRTCContext } from "../../providers/WebRTCContext";
import { videoGloballyMutedState } from "../../states/layoutAtoms";
import NoCamera from "./noCamera";
import UserCameraActions from "./userCameraActions";
import UserCameraDetails from "./userCameraDetails";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import clsx from "clsx";
import React, {
    useContext, useEffect, useRef, useState,
} from "react";
import { useRecoilState } from "recoil";
import  vad  from "voice-activity-detection";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: `#31313c`,
        borderRadius: 12,
        width: `100%`,
        minHeight: 96,
        margin: 2,
        height: `100%`,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        order: 99,
        "& video": {
            // backgroundColor: theme.palette.grey[200],
        },
    },
    rootSmall:{},
    rootLarge:{
        fontSize: `1.5rem`,
    },
    self:{
        order: 1,
    },
    speaking:{
        order: 2,
        boxShadow: `0px 0px 0px 2px #ffe000, 0px 6px 4px 1px rgb(255 224 0 / 48%)`,
    },
}));

interface UserCameraType {
    user: any;
    actions?: boolean;
    variant?: "medium" | "large" | "small";
}

function UserCamera (props: UserCameraType) {
    const {
        user, variant, actions = true,
    } = props;
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    const enableSpeakingActivity = true;
    const [ isSpeaking, setIsSpeaking ] = useState(false);
    const [ speakingActivity, setSpeakingActivity ] = useState(0);

    const [ camOn, setCamOn ] = useState(true);
    const [ micOn, setMicOn ] = useState(true);

    const { camera, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const isSelf = user.id === sessionId ? true : false;

    const userSession = sessions.get(user.id);
    const userCamera = isSelf ? camera : webrtc.getCameraStream(user.id);

    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const userCameraTracks = userCamera?.getTracks();

    function audioDetector (stream:any) {
        const audioContext = new AudioContext();

        const options = {
            minNoiseLevel: 0.3,
            maxNoiseLevel: 0.7,
            noiseCaptureDuration: 1500,
            avgNoiseMultiplier: 0.3,
            smoothingTimeConstant: 0.9,

            onVoiceStart: function () {
                setIsSpeaking(true);
            },
            onVoiceStop: function () {
                setIsSpeaking(false);        },
            onUpdate: function (val:any) {
                setSpeakingActivity(val);
            },
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
        videoRef.current,
        userCamera,
        camOn,
    ]);

    useEffect(() => {
        setMicOn(webrtc.isLocalAudioEnabled(user.id));
    }, [ webrtc.isLocalAudioEnabled(user.id) ]);

    useEffect(() => {
        setCamOn(webrtc.isLocalVideoEnabled(user.id));

        if(userCameraTracks){
            userCameraTracks.forEach( (track:any) => {
                if(track.kind === `video` && track.enabled === false){
                    setCamOn(false);
                }
            });
        }
    }, [ webrtc.isLocalVideoEnabled(user.id), userCameraTracks ]);

    useEffect(() => {
        userCamera && enableSpeakingActivity && audioDetector(userCamera);
    }, [ userCamera ]);

    return (
        <Grid
            container
            className={clsx(classes.root, {
                // [classes.speaking]: isSpeaking,
                [classes.self]: isSelf,
                [classes.rootSmall]: variant === `small`,
                [classes.rootLarge]: variant === `large`,
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
                    speakingActivity={speakingActivity}
                />
                {actions ? isHover && <UserCameraActions user={user} /> : null}
                {userCamera && camOn ? (
                    <>
                        <video
                            ref={videoRef}
                            playsInline
                            id={userSession ? `camera:${userSession.id}` : undefined}
                            autoPlay={true}
                            muted={true}
                            style={{
                                width: `100%`,
                                height: `100%`,
                                position: `absolute`,
                                top: 0,
                                left: 0,
                            }}
                        />
                        <audio
                            ref={audioRef}
                            autoPlay={true}
                            muted={isSelf}
                        />
                    </>
                ) : <NoCamera
                    name={user.name}
                    variant={variant} />}
            </Grid>
        </Grid>
    );
}

export default UserCamera;
