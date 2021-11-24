
import { Session } from "@/pages/utils";
import Grid,
{ GridProps } from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import React,
{
    useEffect,
    useRef,
} from "react";

export enum CameraOrder {
    DEFAULT = 0,
    HOST_TEACHER = 1,
    TEACHER_SELF = 2,
    TEACHER = 3,
    // StudentSpeaking = 4, // TODO: https://calmisland.atlassian.net/browse/KL-3907
    STUDENT_SELF = 9,
    STUDENT = 10,
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
