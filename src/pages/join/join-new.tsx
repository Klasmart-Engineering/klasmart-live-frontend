import LogRocket from 'logrocket';
import React, { useState, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import { InfoCircle as InfoCircleIcon } from "@styled-icons/boxicons-solid/InfoCircle";
import StyledIcon from "../../components/styled/icon";

import { UserContext } from "../../entry";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import Camera from "../../components/media/video";
import Loading from "../../components/loading";
import MediaDeviceSelect from "../../components/mediaDeviceSelect";
import logger from "../../services/logger/Logger";
import { ClassType } from '../../store/actions';

import KidsLoopLiveTeachers from "../../assets/img/kidsloop_live_teachers.svg";
import KidsLoopLiveStudents from "../../assets/img/kidsloop_live_students.svg";
import KidsLoopStudyStudents from "../../assets/img/kidsloop_study_students.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            padding: "48px 40px !important",
            [theme.breakpoints.down("sm")]: {
                maxWidth: 360,
                margin: "0 auto"
            }
        },
        logo: {
            display: "block",
            margin: "0 auto"
        }
    })
);

export default function Join(): JSX.Element {
    const { card } = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { classtype } = useContext(UserContext);

    const [permissionError, setPermissionError] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [audioDeviceOptions, setAudioDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [videoDeviceOptions, setVideoDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [audioDeviceId, setAudioDeviceId] = useState<string>("");
    const [videoDeviceId, setVideoDeviceId] = useState<string>("");
    const [stream, setStream] = useState<MediaStream>();

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        getMediaPermissions()
            .then(() => loadMediaDevices())
            .catch((e) => {
                console.error(`Error while preparing the media devices - ${e}`);
                setError(true);
            });

        // When user disconnect or connect a media device, the media devices that connected to computer are reloaded.
        navigator.mediaDevices.addEventListener("devicechange", loadMediaDevices);
        return () => { navigator.mediaDevices.removeEventListener("devicechange", loadMediaDevices); };
    }, []);

    async function getMediaPermissions() {
        try {
            /**
             * Specification
             * Even if it's not a live class(classtype !== ClassType.LIVE), application needs a microphone.
             * This is because some H5P content requires a microphone.
             */
            await navigator.mediaDevices.getUserMedia({ audio: true });
            // Live class requires the cameras also.
            if (classtype === ClassType.LIVE) {
                await navigator.mediaDevices.getUserMedia({ video: true });
            }
            setPermissionError(false);
        } catch (e) {
            console.error(`getMediaPermissions Error - ${e}`);
            setPermissionError(true);
        }
    }

    async function loadMediaDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const audioDevices = devices.filter((d) => d.kind == "audioinput");
            setAudioDeviceOptions(audioDevices);

            if (audioDevices.length > 0) {
                // Select the first mic only if there is no mic selected
                if (audioDeviceId === "") setAudioDeviceId(audioDevices[0].deviceId);
            } else {
                setAudioDeviceId("");
            }

            if (classtype === ClassType.LIVE) {
                const videoDevices = devices.filter((d) => d.kind == "videoinput");
                setVideoDeviceOptions(videoDevices);

                if (videoDevices.length > 0) {
                    // Select the first cam only if there is no cam selected
                    if (videoDeviceId === "") setVideoDeviceId(videoDevices[0].deviceId);
                } else {
                    setVideoDeviceId("");
                }
            }

            logger({ logType: 'join.tsx detect devices devices list test6', devices });
        } catch (e) {
            console.error(`loadMediaDevices Error - ${e}`);
            setError(true);
        }
    }

    function getMicStream(deviceId: string) {
        navigator.mediaDevices.getUserMedia({
            audio: { deviceId }
        }).then((s) => {
            setStream(s);
            setError(false);
        }).catch((e) => {
            console.error(`getMicStream Error - ${e}`);
            setStream(undefined);
            setError(true);
        });
    }

    function getCamStream(audioDeviceId: string, videoDeviceId: string) {
        navigator.mediaDevices.getUserMedia({
            audio: { deviceId: audioDeviceId },
            video: {
                deviceId: videoDeviceId,
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
                facingMode: "user" // the front camera (if one is available)
            }
        }).then((s) => {
            setStream(s);
            setError(false);
        }).catch((e) => {
            console.error(`getCamStream Error - ${e}`);
            setStream(undefined);
            setError(true);
        });
    }

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        if (classtype === ClassType.LIVE) {
            getCamStream(audioDeviceId, videoDeviceId);
        } else {
            getMicStream(audioDeviceId)
        }
    }, [videoDeviceId, audioDeviceId]);

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: "100%" }}
        >
            <Container maxWidth={classtype === ClassType.LIVE ? "lg" : "xs"}>
                <Card>
                    <CardContent className={card}>
                        <Grid
                            container
                            direction={isSmDown ? "column-reverse" : "row"}
                            justify="center"
                            alignItems="center"
                            spacing={4}
                        >
                            {classtype !== ClassType.LIVE ? null :
                                <Grid item xs={12} md={8}>
                                    <CameraPreview permissionError={permissionError} videoStream={stream} />
                                </Grid>
                            }
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                spacing={4}
                                item
                                xs={12}
                                md={classtype === ClassType.LIVE ? 4 : undefined}
                            >
                                <Grid item xs={12}>
                                    <KidsLoopLogo />
                                </Grid>
                                <Grid item xs={12}>
                                    <JoinRoomForm
                                        mediaDeviceError={error || permissionError}
                                        stream={stream}
                                        audioDeviceOptions={audioDeviceOptions}
                                        audioDeviceIdHandler={{ audioDeviceId, setAudioDeviceId }}
                                        videoDeviceOptions={videoDeviceOptions}
                                        videoDeviceIdHandler={{ videoDeviceId, setVideoDeviceId }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    )
}

function CameraPreview({ permissionError, videoStream }: {
    permissionError: boolean,
    videoStream: MediaStream | undefined
}): JSX.Element {

    return (
        permissionError ?
            <CameraPreviewFallback permissionError /> : (
                videoStream && videoStream.getVideoTracks().length > 0 && videoStream.getVideoTracks().every((t) => t.readyState === "live") && videoStream.active ?
                    <Camera mediaStream={videoStream} muted={true} /> :
                    <Loading messageId="allow_media_permission" />
            )
    )
}

function CameraPreviewFallback({ permissionError }: { permissionError: boolean }) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="center"
            style={{
                position: "relative",
                height: 0,
                paddingBottom: "56.25%", // 16:9
                backgroundColor: "#000",
                borderRadius: 12
            }}
        >
            <Typography
                variant={isSmDown ? "caption" : "body1"}
                align="center"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    color: "#FFF"
                }}
            >
                {/* TODO: Localization */}
                {permissionError ? "Allow media device permissions" : <FormattedMessage id="connect_camera" />}
            </Typography>
        </Grid>
    );
}

function KidsLoopLogo(): JSX.Element {
    const { logo } = useStyles();
    const { classtype, teacher } = useContext(UserContext);
    const IMG_HEIGHT = "64px";
    // TODO: Logo asset for ClassType.CLASSES
    return (classtype === ClassType.LIVE
        ? <img alt="KidsLoop Live" src={teacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents} height={IMG_HEIGHT} className={logo} />
        : <img alt="KidsLoop Live" src={classtype === ClassType.CLASSES ? KidsLoopLiveTeachers : KidsLoopStudyStudents} height={IMG_HEIGHT} className={logo} />
    )
}

interface JoinRoomFormProps {
    mediaDeviceError: boolean;
    stream: MediaStream | undefined;
    audioDeviceOptions: MediaDeviceInfo[];
    audioDeviceIdHandler: {
        audioDeviceId: string,
        setAudioDeviceId: React.Dispatch<React.SetStateAction<string>>
    };
    videoDeviceOptions: MediaDeviceInfo[];
    videoDeviceIdHandler: {
        videoDeviceId: string,
        setVideoDeviceId: React.Dispatch<React.SetStateAction<string>>
    };
}

function JoinRoomForm({
    mediaDeviceError,
    stream,
    audioDeviceOptions,
    videoDeviceOptions,
    audioDeviceIdHandler,
    videoDeviceIdHandler
}: JoinRoomFormProps): JSX.Element {
    const { classtype, setCamera, name, setName, sessionId } = useContext(UserContext);

    const { audioDeviceId, setAudioDeviceId } = audioDeviceIdHandler;
    const { videoDeviceId, setVideoDeviceId } = videoDeviceIdHandler;

    const [user, setUser] = useState<string>("");
    const [nameError, setNameError] = useState<JSX.Element | null>(null);

    function join(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNameError(null);
        if (!user) {
            setNameError(
                <span style={{ display: "flex", alignItems: "center" }}>
                    <StyledIcon icon={<InfoCircleIcon />} size="small" color="#dc004e" />
                    <Typography variant="caption">
                        <FormattedMessage id="error_empty_name" />
                    </Typography>
                </span>
            );
        }
        if (!name) {
            setName(user);
            LogRocket.identify(user, { sessionId })
        }
        setCamera(stream || null);
    }

    return (
        <form onSubmit={join}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {name ?
                        <Tooltip placement="top" title={name}>
                            <Typography align="center" variant="body1" noWrap>
                                <FormattedMessage id="hello" values={{ name }} />
                            </Typography>
                        </Tooltip> :
                        <StyledTextField
                            fullWidth
                            label={<FormattedMessage id="what_is_your_name" />}
                            value={user}
                            error={nameError !== null}
                            helperText={nameError}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    }
                </Grid>
                {classtype !== ClassType.LIVE ? null :
                    <Grid item xs={12}>
                        <MediaDeviceSelect
                            disabled={videoDeviceOptions.length <= 1}
                            deviceType="video"
                            deviceId={videoDeviceId}
                            devices={videoDeviceOptions}
                            onChange={(e) => setVideoDeviceId(e.target.value as string)}
                        />
                    </Grid>
                }
                <Grid item xs={12}>
                    <MediaDeviceSelect
                        disabled={audioDeviceOptions.length <= 1}
                        deviceType="audio"
                        deviceId={audioDeviceId}
                        devices={audioDeviceOptions}
                        onChange={(e) => setAudioDeviceId(e.target.value as string)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <StyledButton
                        disabled={mediaDeviceError || !stream}
                        fullWidth
                        type="submit"
                        size="large"
                    >
                        <Typography>
                            <FormattedMessage id="join_room" />
                        </Typography>
                    </StyledButton>
                </Grid>
            </Grid>
        </form>
    )
}