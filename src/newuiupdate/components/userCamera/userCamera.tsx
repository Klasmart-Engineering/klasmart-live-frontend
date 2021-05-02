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
        minHeight: 90,
        margin: 2,
        height: `100%`,
        alignItems: `center`,
        textAlign: `center`,
        position: `relative`,
        overflow: `hidden`,
        order: 99,
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
}

function UserCamera (props: UserCameraType) {
    const { user, actions = true } = props;
    const classes = useStyles();
    const [ isHover, setIsHover ] = useState(false);

    const [ isSpeaking, setIsSpeaking ] = useState(false);
    const [ camOn, setCamOn ] = useState(false);
    const [ micOn, setMicOn ] = useState(false);

    const { camera, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const isSelf = user.id === sessionId ? true : false;
    const enableSpeakingActivity = true;

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
            noiseCaptureDuration: 1000,
            avgNoiseMultiplier: 0.3,
            smoothingTimeConstant: 0.9,

            onVoiceStart: function () {
                setIsSpeaking(true);
            },
            onVoiceStop: function () {
                setIsSpeaking(false);
            },
            onUpdate: function (val:any) {

            },
        };
        vad(audioContext, stream, options);
    }

    useEffect(() => {
        userCamera && enableSpeakingActivity && audioDetector(userCamera);
    }, [ userCamera ]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = userCamera ? userCamera : null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = userCamera ? userCamera : null;
        }

        if(userCameraTracks){
            userCameraTracks.forEach( (track:any) => {
                if(track.kind === `audio`){
                    setMicOn(track.enabled);
                    track.enabled === false && setIsSpeaking(false);
                }
                track.kind === `video` && setCamOn(track.enabled);
            });
        }
    }, [ userCameraTracks, userCamera ]);

    return (
        <Grid
            container
            className={clsx(classes.root, {
                [classes.self]: isSelf,
                [classes.speaking]: isSpeaking,
            })}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Grid
                item
                xs>
                <div id={`meter-${user.id}`}></div>
                <UserCameraDetails user={user} />
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
                ) : <NoCamera name={user.name} />}
            </Grid>
        </Grid>
    );
}

export default UserCamera;
