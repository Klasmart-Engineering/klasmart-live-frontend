import LogRocket from 'logrocket';
import React, { useState, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { InfoCircle as InfoCircleIcon } from "@styled-icons/boxicons-solid/InfoCircle";
import StyledIcon from "../../components/styled/icon";

import { LocalSessionContext } from "../../entry";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import Camera from "../../components/media/camera";
import Loading from "../../components/loading";
import MediaDeviceSelect, { DeviceInfo } from "../../components/mediaDeviceSelect";
import logger from "../../services/logger/Logger";
import { ClassType, OrientationType } from '../../store/actions';
import MediaDeviceSelect from "../../components/mediaDeviceSelect";
import { ClassType } from '../../store/actions';

import KidsLoopLiveTeachers from "../../assets/img/kidsloop_live_teachers.svg";
import KidsLoopLiveStudents from "../../assets/img/kidsloop_live_students.svg";
import KidsLoopStudyStudents from "../../assets/img/kidsloop_study_students.svg";
import { useHistory } from 'react-router-dom';
import { useUserContext } from '../../context-provider/user-context';
import { State } from '../../store/store';
import { useUserInformation } from '../../context-provider/user-information-context';
import { useServices } from '../../context-provider/services-provider';
import useCordovaInitialize from '../../cordova-initialize';
import { FacingType, useCameraContext } from '../../components/media/useCameraContext';
import { lockOrientation } from '../../utils/screenUtils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            margin: "auto 0"
        },
        card: {
            display: "flex",
            alignItems: "center",
            padding: "48px 40px !important",
            [theme.breakpoints.down("sm")]: {
                maxWidth: 360,
                margin: "0 auto",
            },
        },
        formContainer: {
            width: "100%"
        },
        pageWrapper: {
            flexGrow: 1
        },
        errorIcon: {
            fontSize: "1em",
            marginRight: theme.spacing(1),
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
    const history = useHistory();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const classes = useStyles();
    const { classtype } = useContext(UserContext);

    const dispatch = useDispatch();
    const classType = useSelector((store: State) => store.session.classType);
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const handleDialogClose = () => setDialogOpen(false);

    const [permissionError, setPermissionError] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<boolean>(false);
    const [audioDeviceOptions, setAudioDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [videoDeviceOptions, setVideoDeviceOptions] = useState<MediaDeviceInfo[]>([]);
    const [audioDeviceId, setAudioDeviceId] = useState<string>("");
    const [videoDeviceId, setVideoDeviceId] = useState<string>("");

    const { name, setName, teacher } = useUserContext();
    const { information: myInformation } = useUserInformation();
    const { contentService } = useServices();

    const [user, setUser] = useState<string>("");
    const [nameError, setNameError] = useState<JSX.Element | null>(null);
    const { permissions, requestPermissions } = useCordovaInitialize(undefined, undefined, true);

    // TODO: If moving to using just front/back camera device for mobile
    // app devices we may not need these arrays. Since they would be constant
    // front/back always (would need to figure out how to determine available
    // cameras though).
    const [videoDevices] = useState<DeviceInfo[]>([
        { label: "Front Facing", kind: "videoinput", id: FacingType.User as string, },
        { label: "Back Facing", kind: "videoinput", id: FacingType.Environment as string }
    ]);

    const { error, stream, facing, setFacing, refreshCameras } = useCameraContext();

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }

        const getMediaPermissions = async () => {
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
                setPermissionError(false); setDialogOpen(false);
                await loadMediaDevices();
            } catch (e) {
                console.error(`getMediaPermissions Error - ${e}`);
                setPermissionError(true); setDialogOpen(true);
            }
        }
        getMediaPermissions();

        // When user disconnect or connect a media device, the media devices that connected to computer are reloaded.
        navigator.mediaDevices.addEventListener("devicechange", loadMediaDevices);
        return () => { navigator.mediaDevices.removeEventListener("devicechange", loadMediaDevices); };
    }, []);

    // NOTE: This effect will set the customizable name based on the 
    // information from /me query. This will prepopulate the input
    // field for the user name but still allow it to be customized.
    useEffect(() => {
        if (!myInformation) return;

        if (myInformation.givenName) {
            setUser(myInformation.givenName);
        } else if (myInformation.name) {
            setUser(myInformation.name);
        }

    }, [myInformation]);

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
    }, []);

    useEffect(() => {
        if (classType === ClassType.STUDY) return;

        if (!permissions) {
            requestPermissions(true, true);
        } else {
            refreshCameras();
        }
    }, [refreshCameras, permissions, classType]);

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
        } catch (e) {
            console.error(`loadMediaDevices Error - ${e}`);
            setLoadError(true);
        }
    }

    function getMicStream(deviceId: string) {
        navigator.mediaDevices.getUserMedia({
            audio: { deviceId }
        }).then((s) => {
            setStream(s);
            setLoadError(false);
        }).catch((e) => {
            console.error(`getMicStream Error - ${e}`);
            setStream(undefined);
            setLoadError(true);
        });
    }

    function getCamStream(audioDeviceId: string, videoDeviceId: string) {
        const videoConstraints = {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { max: 24 }
        };

        navigator.mediaDevices.getUserMedia({
            audio: { deviceId: audioDeviceId },
            video: { deviceId: videoDeviceId }
        }).then((s) => {
            const track = s.getVideoTracks()[0];
            track.applyConstraints(videoConstraints);
            setStream(s);
            setLoadError(false);
        }).catch((e) => {
            console.error(`getCamStream Error - ${e}`);
            setStream(undefined);
            setLoadError(true);
        });
    }

    function join(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNameError(null);
        if (!user) {
            setNameError(
                <span style={{ display: "flex", alignItems: "center" }}>
                    <ErrorIcon className={classes.errorIcon} />
                    <FormattedMessage id="error_empty_name" />
                </span>
            );
        }

        // TODO: Using this conditional here will prioritize the name
        // coming from token first. And disallow setting any other name.
        // User also wont be able to set their name after it's been set 
        // once, unless the page is reloaded (name setting is not persistent)
        // there's also name information related to the /me query which
        // currently will be used optionally if the token name isn't set. We
        // may want to change the priorities used when selecting name and
        // determining if user can set a custom name or not in the future.
        if (!name) { setName(user); }

        history.push(`/room`);
    }

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        if (classtype === ClassType.LIVE) {
            getCamStream(audioDeviceId, videoDeviceId);
        } else {
            getMicStream(audioDeviceId)
        }
    }, [videoDeviceId, audioDeviceId]);

    return (<>
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: "100%", backgroundColor: (classType === ClassType.LIVE && stream) ? "transparent" : "white" }}
        >
            <Container maxWidth={classtype === ClassType.LIVE ? "lg" : "xs"}>
                <Card>
                    <CardContent className={card}></CardContent>
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
                                        mediaDeviceError={permissionError || loadError}
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
        <PermissionAlertDialog dialogOpenHandler={{ dialogOpen, handleDialogClose }} />
    </>)
}

function CameraPreview({ permissionError, videoStream }: {
    permissionError: boolean,
    videoStream: MediaStream | undefined
}): JSX.Element {

    return (
        permissionError ?
            <CameraPreviewFallback permissionError /> : (
                videoStream && videoStream.getVideoTracks().length > 0 && videoStream.getVideoTracks().every((t) => t.readyState === "live") && videoStream.active ?
                    <Camera mediaStream={videoStream} isLocalCamera={true} /> :
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
                {permissionError ?
                    <FormattedMessage id="join_cameraPreviewFallback_allowMediaPermissions" /> :
                    <FormattedMessage id="connect_camera" />
                }
            </Typography>
        </Grid>
    );
}

function KidsLoopLogo(): JSX.Element {
    const { logo } = useStyles();
    const { classtype, isTeacher } = useContext(LocalSessionContext);
    const IMG_HEIGHT = "64px";
    // TODO: Logo asset for ClassType.CLASSES
    return (classtype === ClassType.LIVE
        ? <img alt="KidsLoop Live" src={isTeacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents} height={IMG_HEIGHT} className={logo} />
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
    const { classtype, setCamera, name, setName, sessionId } = useContext(LocalSessionContext);

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
        setCamera(stream);
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

function PermissionAlertDialog({ dialogOpenHandler }: {
    dialogOpenHandler: {
        dialogOpen: boolean,
        handleDialogClose: () => void
    }
}) {
    const { classtype } = useContext(LocalSessionContext);
    const { dialogOpen, handleDialogClose } = dialogOpenHandler;

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            aria-labelledby="media-permission-alert-title"
            aria-describedby="media-permission-alert-description"
        >
            <DialogTitle id="media-permission-alert-title">
                <FormattedMessage id="join_permissionAlertDialog_title" />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="media-permission-alert-description">
                    {classtype === ClassType.LIVE ?
                        <FormattedMessage id="join_permissionAlertDialog_contentText_live" /> :
                        <FormattedMessage id="join_permissionAlertDialog_contentText_classesStudy" />
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    <FormattedMessage id="join_permissionAlertDialog_action_close" />
                </Button>
            </DialogActions>
        </Dialog>
    )
}