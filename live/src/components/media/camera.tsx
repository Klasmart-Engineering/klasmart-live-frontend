import React, { useRef, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Theme, useTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";

import { Videocam as CameraIcon } from "@styled-icons/material-twotone/Videocam";
import { VideocamOff as CameraOffIcon } from "@styled-icons/material-twotone/VideocamOff";
import { Mic as MicIcon } from "@styled-icons/material-twotone/Mic";
import { MicOff as MicOffIcon } from "@styled-icons/material-twotone/MicOff";

import StyledIcon from "../styled/icon";
import MoreControls from "./moreControls";
import { UserContext } from "../../entry";
import { Session } from "../../pages/room/room";
import { WebRTCSFUContext } from "../../webrtc/sfu";

export default function Camera({ mediaStream, session, muted, controls, square, miniMode }: {
    mediaStream?: MediaStream,
    session?: Session,
    muted?: boolean,
    controls?: boolean,
    square?: boolean,
    miniMode?: boolean,
}): JSX.Element {
    const theme = useTheme();

    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current || !mediaStream) { return; }
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    return (
        // CameraOverlay needs the parent div that has `position: "relative"`
        <div style={{ position: "relative", width: "100%" }}>
            <Paper
                component="div"
                elevation={2}
                style={{
                    position: "relative",
                    height: 0,
                    margin: "unset",
                    marginBottom: controls ? 0 : theme.spacing(2),
                    paddingBottom: square ? "75%" : "56.25%",
                    borderRadius: square ? 0 : 12,
                    backgroundColor: "#193d6f",
                }}
            >
                {mediaStream ?
                    <video
                        autoPlay={true}
                        muted={muted}
                        playsInline
                        style={{
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: square ? 0 : 12,
                            backgroundColor: "#193d6f",
                        }}
                        ref={videoRef}
                    /> :
                    <Typography
                        align="center"
                        style={{
                            color: "#FFF",
                            top: "50%",
                            left: "50%",
                            marginRight: "-50%",
                            position: "absolute",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <CameraOffIcon size="1.5rem" />
                    </Typography>
                }
            </Paper>
            {controls && session ? <CameraOverlay mediaStream={mediaStream} session={session} miniMode={miniMode} /> : null}
        </div>
    );
}

/**
 * CameraOverlay style detail
 *         | Info spacing | Controls spacing | Button |  Icon  |
 * Desktop |       1      |         2        | medium | medium |   
 * Tablet  |      0.5     |         1        | medium | medium |
 * Mobile  |      0.5     |         1        |  small |  small |
 */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: `linear-gradient(
                rgba(0, 0, 0, 0.3),
                rgba(0, 0, 0, 0) 16%,
                rgba(0, 0, 0, 0.3))
            `,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            width: "100%",
        },
        iconBtn: {
            border: "1px solid white",
            margin: theme.spacing(0, 2),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        iconOffBtn: {
            border: "1px solid #dc004e",
            margin: theme.spacing(0, 2),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        icon: {
            "&:hover": {
                color: "white"
            }
        },
        iconOff: {
            "&:hover": {
                color: "red"
            }
        },
        infoContainer: {
            textAlign: "center",
            height: "15%",
            padding: theme.spacing(1),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(0.5),
            },
        },
        controlsContainer: {
            height: "85%",
            padding: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1),
            },
            opacity: 0,
            transition: ".3s ease",
            "&:hover": {
                opacity: 1
            }
        },
    })
);

function CameraOverlay({ mediaStream, session, miniMode }: {
    mediaStream: MediaStream | undefined;
    session: Session;
    miniMode?: boolean;
}) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
    const { root, iconBtn, iconOffBtn, icon, iconOff, infoContainer, controlsContainer } = useStyles();

    const { roomId, teacher, sessionId: mySessionId } = useContext(UserContext);
    const [mute, { loading, error }] = useMutation(gql`
    mutation mute($roomId: ID!, $sessionId: ID!, $audio: Boolean, $video: Boolean) {
        mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video)
    }
    `);
    const states = WebRTCSFUContext.Consume()
    const isSelf = session.id === mySessionId;

    function toggleVideoState() {
        if (isSelf) {
            states.localVideoToggle(session.id);
        } else {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    video: !states.isLocalVideoEnabled(session.id),
                }
            });
        }
    }

    function toggleAudioState() {
        if (isSelf) {
            states.localAudioToggle(session.id);
        } else {
            mute({
                variables: {
                    roomId,
                    sessionId: session.id,
                    audio: !states.isLocalAudioEnabled(session.id),
                }
            });
        }
    }

    return (
        <div className={root} style={!mediaStream ? { background: "transparent" } : undefined}>
            <Grid container direction="row" justify="space-between" style={{ height: "100%" }}>
                {/* User name */}
                <Grid item xs={12} className={infoContainer}>
                    {miniMode ? null :
                        <Tooltip
                            arrow
                            aria-label="user name tooltip"
                            placement={"top"}
                            title={session.name ? session.name : <FormattedMessage id="error_unknown_user" />}
                        >
                            <Typography
                                component="p"
                                variant={isSmDown ? "caption" : "body1"}
                                noWrap
                                style={{ color: "white" }}
                            >
                                {!session.name ? <FormattedMessage id="error_unknown_user" /> : (isSelf ? "You" : session.name)}
                            </Typography>
                        </Tooltip>
                    }
                </Grid>

                {/* Camera Controls */}
                <Grid
                    container
                    direction="column"
                    justify={miniMode ? "flex-start" : "flex-end"}
                    item
                    xs={12}
                    className={controlsContainer}
                    style={miniMode ? { padding: theme.spacing(1), paddingTop: theme.spacing(2) } : undefined}
                >
                    <Grid container justify="center" item>
                        {mediaStream ? <>
                            <Tooltip
                                arrow
                                aria-label="camera control button tooltip"
                                placement={"top"}
                                title={states.isLocalVideoEnabled(session.id)
                                    ? <FormattedMessage id="turn_off_camera" /> : <FormattedMessage id="turn_on_camera" />}
                            >
                                <IconButton
                                    aria-label="camera control button"
                                    onClick={toggleVideoState}
                                    size={isSmUp ? "medium" : "small"}
                                    className={states.isLocalVideoEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={miniMode ? { margin: theme.spacing(1), padding: theme.spacing(0.5) } : undefined}
                                >
                                    {states.isLocalVideoEnabled(session.id) ?
                                        <StyledIcon
                                            icon={<CameraIcon className={icon} />}
                                            size={isSmUp ? "medium" : "small"}
                                            color="white"
                                        /> :
                                        <StyledIcon
                                            icon={<CameraOffIcon className={iconOff} />}
                                            size={isSmUp ? "medium" : "small"}
                                            color="red"
                                        />
                                    }
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                arrow
                                aria-label="mic control button tooltip"
                                placement="top"
                                title={states.isLocalAudioEnabled(session.id)
                                    ? <FormattedMessage id="turn_off_mic" /> : <FormattedMessage id="turn_on_mic" />}
                            >
                                <IconButton
                                    aria-label="mic control button"
                                    onClick={toggleAudioState}
                                    size={isSmUp ? "medium" : "small"}
                                    className={states.isLocalAudioEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={miniMode ? { margin: theme.spacing(1), padding: theme.spacing(0.5) } : undefined}
                                >
                                    {states.isLocalAudioEnabled(session.id) ?
                                        <StyledIcon
                                            icon={<MicIcon className={icon} />}
                                            size={isSmUp ? "medium" : "small"}
                                            color="white"
                                        /> :
                                        <StyledIcon
                                            icon={<MicOffIcon className={iconOff} />}
                                            size={isSmUp ? "medium" : "small"}
                                            color="red"
                                        />
                                    }
                                </IconButton>
                            </Tooltip>
                        </> : null}
                    </Grid>
                </Grid>
                {(!teacher || isSelf || miniMode) ? null : <MoreControls session={session} selfUserId={mySessionId} forOverlay={true} />}
            </Grid>
        </div>
    )
}
