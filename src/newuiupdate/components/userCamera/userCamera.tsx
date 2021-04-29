import { LocalSessionContext } from "../../providers/providers";
import { RoomContext } from "../../providers/roomContext";
import { WebRTCContext } from "../../providers/WebRTCContext";
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

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: `#31313c`,
        borderRadius: 12,
        width: `100%`,
        minHeight: 90,
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
        border: `4px solid #5ce1ff`,
        boxShadow: `2px 2px 2px rgba(93, 225, 255, 0.4)`,
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

    const { camera, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const isSelf = user.id === sessionId ? true : false;
    const isSpeaking = false;

    const userSession = sessions.get(user.id);
    const userCamera = isSelf ? camera : webrtc.getCameraStream(user.id);

    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.srcObject = userCamera ? userCamera : null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = userCamera ? userCamera : null;
        }
    }, [ videoRef.current, userCamera ]);

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
                <UserCameraDetails user={user} />
                {actions ? isHover && <UserCameraActions user={user} /> : null}
                {userCamera ? (
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
                            muted={true}
                            // muted={isSelf}
                        />
                    </>
                ) : <NoCamera name={user.name} />}
            </Grid>
        </Grid>
    );
}

export default UserCamera;
