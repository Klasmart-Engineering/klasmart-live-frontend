import React, { useRef, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Theme, useTheme, createStyles, makeStyles } from "@material-ui/core/styles";
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
import { Session } from "../../pages/room/room";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { State } from "../../store/store";
import { useUserContext } from "../../context-provider/user-context";
import useVideoLayoutUpdate from "../../utils/video-layout-update";
import { videoStreamControls } from "../../utils/layerValues";

export default function Camera({ mediaStream, session, muted, controls, square, bottomControls }: {
    mediaStream?: MediaStream,
    session?: Session,
    muted?: boolean,
    controls?: boolean,
    square?: boolean,
    bottomControls?: boolean,
}): JSX.Element {
    const theme = useTheme();

    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!videoRef.current || !mediaStream) { return; }
        videoRef.current.pause();
        videoRef.current.srcObject = mediaStream;
    }, [videoRef.current, mediaStream]);

    const volume = useSelector((state: State) => state.settings.volumeVoice);

    useEffect(() => {
        if (!videoRef.current) { return; }
        videoRef.current.volume = volume;
    }, [videoRef.current, volume]);

    useVideoLayoutUpdate(videoRef.current);

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
                    backgroundColor: mediaStream ? "transparent" : "#193d6f",
                }}
            >
                {mediaStream ?
                    <video
                        autoPlay={true}
                        muted={muted}
                        playsInline
                        style={{
                            zIndex: -1,
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
            {controls && session ? <CameraOverlay mediaStream={mediaStream} session={session} bottomControls={bottomControls} square={square} /> : null}
        </div>
    );
}

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

function CameraOverlay({ mediaStream, session, bottomControls, square }: {
    mediaStream: MediaStream | undefined;
    session: Session;
    bottomControls?: boolean;
    square: boolean | undefined;
}) {
    const theme = useTheme();
    const isMobileOnly = useSelector((state: State) => state.session.userAgent.isMobileOnly);
    const isTablet = useSelector((state: State) => state.session.userAgent.isTablet);
    const isTabletCenteredControls = isTablet && !bottomControls;
    const { root, iconBtn, iconOffBtn, icon, iconOff, infoContainer, controlsContainer } = useStyles();

    const { roomId, teacher, sessionId: mySessionId } = useUserContext();
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
        <div
            className={root}
            style={!mediaStream ? { background: "transparent" } :
                (!square ? { borderRadius: 12 } : undefined)
            }
        >
            <Grid container direction="row" justify="space-between" style={{ height: "100%" }}>
                {/* User name */}
                <Grid item xs={12} className={infoContainer}>
                    <Tooltip
                        arrow
                        aria-label="user name tooltip"
                        placement={"top"}
                        title={session.name ? session.name : <FormattedMessage id="error_unknown_user" />}
                    >
                        <Typography
                            component="p"
                            variant={isMobileOnly || isTablet ? "caption" : "body1"}
                            noWrap
                            style={{ color: "white" }}
                        >
                            {!session.name ? <FormattedMessage id="error_unknown_user" /> : (isSelf ? "You" : session.name)}
                        </Typography>
                    </Tooltip>
                </Grid>

                {/* Camera Controls */}
                <Grid
                    container
                    direction="column"
                    justify={bottomControls ? "flex-end" : "flex-start"}
                    item
                    xs={12}
                    className={controlsContainer}
                    style={bottomControls ? undefined : (isMobileOnly ?
                        { padding: "6% 0px 0px 0px" } : // TODO: Vertical center alignment for controls is unstable.
                        { padding: `${isTablet ? "10%" : "18%"} 0px 0px 0px` } // TODO: Vertical center alignment for controls is unstable.
                    )}
                >
                    <Grid container justify="center" item style={{ zIndex: videoStreamControls }}>
                        {mediaStream ? <>
                            <Tooltip
                                arrow
                                aria-label="camera control button tooltip"
                                placement={"top"}
                                title={states.isLocalVideoEnabled(session.id) ? <FormattedMessage id="turn_off_camera" /> : <FormattedMessage id="turn_on_camera" />}
                            >
                                <IconButton
                                    aria-label="camera control button"
                                    onClick={toggleVideoState}
                                    size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
                                    className={states.isLocalVideoEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={isMobileOnly || isTabletCenteredControls ? { margin: theme.spacing(1), padding: theme.spacing(0.5) } : undefined}
                                >
                                    {states.isLocalVideoEnabled(session.id) ?
                                        <StyledIcon
                                            icon={<CameraIcon className={icon} />}
                                            size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
                                            color="white"
                                        /> :
                                        <StyledIcon
                                            icon={<CameraOffIcon className={iconOff} />}
                                            size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
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
                                    size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
                                    className={states.isLocalAudioEnabled(session.id) ? iconBtn : iconOffBtn}
                                    style={isMobileOnly || isTabletCenteredControls ? { margin: theme.spacing(1), padding: theme.spacing(0.5) } : undefined}
                                >
                                    {states.isLocalAudioEnabled(session.id) ?
                                        <StyledIcon
                                            icon={<MicIcon className={icon} />}
                                            size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
                                            color="white"
                                        /> :
                                        <StyledIcon
                                            icon={<MicOffIcon className={iconOff} />}
                                            size={isMobileOnly || isTabletCenteredControls ? "small" : "medium"}
                                            color="red"
                                        />
                                    }
                                </IconButton>
                            </Tooltip>
                        </> : null}
                    </Grid>
                </Grid>
                {(!teacher || isSelf) ? null : <MoreControls session={session} selfUserId={mySessionId} forOverlay={true} />}
            </Grid>
        </div>
    )
}
