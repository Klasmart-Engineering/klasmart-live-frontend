import { useSessions } from "@/data/live/state/useSessions";
import { Session } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { WhiteboardLoadableElement } from "@/whiteboard/components/ContainedWhiteboard";
import { useStream } from "@kl-engineering/live-state/ui";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useEffect,
    useRef,
} from "react";

const useStyles = makeStyles(() => ({
    video:{
        width: `100% !important`,
        height: `100% !important`,
        position: `absolute`,
        top: 0,
        left: 0,
        objectFit: `cover`,
    },
}));

interface UserCameraProps extends Omit<React.MediaHTMLAttributes<HTMLVideoElement>, "onLoad">, WhiteboardLoadableElement{
    user: Session;
}

const UserCamera = ({
    user, className, onLoad, ...rest
}: UserCameraProps) => {
    const classes = useStyles();
    const mediaRef = useRef<HTMLVideoElement>(null);
    const { stream: mediaStream } = useStream(user.id);
    const mySession = useSessionContext();
    const isSelf = (user.id === mySession.sessionId);
    const sessions = useSessions();
    const userSession = sessions.get(user.id);

    useEffect(() => {
        if(!mediaRef.current) { return; }
        mediaRef.current.srcObject = mediaStream ?? null;
    }, [ mediaRef.current, mediaStream ]);

    useEffect(() => {
        if (!mediaRef.current) return;

        onLoad?.({
            width: mediaRef.current.videoWidth,
            height: mediaRef.current.videoHeight,
        });
    }, [ mediaRef.current?.videoWidth, mediaRef.current?.videoHeight ]);

    return (
        <video
            ref={mediaRef}
            autoPlay
            playsInline
            muted={isSelf}
            id={`camera:${userSession?.id}`}
            className={clsx(className, classes.video)}
            {...rest}
        />
    );
};

export default UserCamera;
