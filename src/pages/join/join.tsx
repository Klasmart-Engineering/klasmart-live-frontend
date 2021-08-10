import React, {useContext, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
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

import {InfoCircle as InfoCircleIcon} from "@styled-icons/boxicons-solid/InfoCircle";
import StyledIcon from "../../components/styled/icon";

import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import Camera from "../../components/media/camera";
import Loading from "../../components/loading";
import MediaDeviceSelect, {DeviceInfo} from "../../components/mediaDeviceSelect";
import {ClassType} from '../../store/actions';

import KidsLoopLiveTeachers from "../../assets/img/kidsloop_live_teachers.svg";
import KidsLoopLiveStudents from "../../assets/img/kidsloop_live_students.svg";
import KidsLoopStudyStudents from "../../assets/img/kidsloop_study_students.svg";
import {useSessionContext} from '../../context-provider/session-context';
import {useHistory} from "react-router-dom";
import {useUserInformation} from "../../context-provider/user-information-context";
import {FacingType, useCameraContext} from "../../components/media/useCameraContext";
import {CordovaSystemContext, PermissionType} from "../../context-provider/cordova-system-context";

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

    const { classType: classtype } = useSessionContext();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const handleDialogClose = () => setDialogOpen(false);

    const [audioDeviceId, setAudioDeviceId] = useState<string>("system");
    const [videoDeviceId, setVideoDeviceId] = useState<string>(FacingType.User as string);

    const [videoDevices] = useState<DeviceInfo[]>([
        { label: "Front Facing", kind: "videoinput", id: FacingType.User as string },
        { label: "Back Facing", kind: "videoinput", id: FacingType.Environment as string }
    ]);

    const [audioDevices] = useState<DeviceInfo[]>([
        { label: "System Microphone", kind: "audioinput", id: "system" as string },
    ]);

    const { error, stream, facing, setFacing, refreshCameras } = useCameraContext();

    // TODO: Use th CordovaSystemContext instead of useCordovaInitialize to access
    // permission status and functions. The useCordovaInitialize will run separately
    // for each place it's used at. So while it behaves like something with global
    // state, each invokation is actually separate.
    //const { permissions, requestPermissions, requestIosCameraPermission } = useCordovaInitialize(undefined, undefined, true);
    const { isAndroid, isIOS, requestPermissions, devicePermissions : permissions } = useContext(CordovaSystemContext);

    useEffect(() => {
        setFacing(videoDeviceId as FacingType);
        setDialogOpen(!permissions);
    }, [setFacing, videoDeviceId]);

    useEffect(() => {
        const getCameraDevice = classtype == ClassType.LIVE;

        console.log(`isAndroid: ${isAndroid}`);
        console.log(`isIOS: ${isIOS}`);

        if (!permissions) {
            requestPermissions({permissionTypes: [PermissionType.CAMERA, PermissionType.MIC]})
        } else if(getCameraDevice) {
            refreshCameras();
        }

        setDialogOpen(!permissions);
    }, [refreshCameras, permissions, classtype]);

    /* TODO (axel): Unsupported on iOS
    useEffect(() => {
        if (!stream) return;

        const videoConstraints = {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { max: 24 }
        };

        const track = stream.getVideoTracks()[0];
        track?.applyConstraints(videoConstraints);
    }, [stream]); */

    return (<>
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ height: "100%", backgroundColor: classtype == ClassType.LIVE ? "transparent" : "white" }}
        >
            <Container maxWidth={classtype === ClassType.LIVE ? "lg" : "xs"}>
                <Card style={{ backgroundColor: classtype == ClassType.LIVE ? "transparent" : "white" }}>
                    <CardContent className={card}>
                        <Grid
                            container
                            direction={isSmDown ? "column-reverse" : "row"}
                            justify="center"
                            alignItems="center"
                            spacing={4}
                        >
                            {classtype !== ClassType.LIVE ? null :
                                <Grid item xs={12} md={8} style={{minWidth: 260}}>
                                    <CameraPreview permissionError={!permissions} videoStream={stream} />
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
                                        mediaDeviceError={!permissions || error}
                                        stream={stream}
                                        audioDeviceOptions={audioDevices}
                                        audioDeviceIdHandler={{ audioDeviceId, setAudioDeviceId }}
                                        videoDeviceOptions={videoDevices}
                                        videoDeviceIdHandler={{ videoDeviceId: facing as string, setVideoDeviceId }}
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
    const { classType: classtype, isTeacher } = useSessionContext();
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
    audioDeviceOptions: DeviceInfo[];
    audioDeviceIdHandler: {
        audioDeviceId: string,
        setAudioDeviceId: React.Dispatch<React.SetStateAction<string>>
    };
    videoDeviceOptions: DeviceInfo[];
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
    const { classType: classtype, setCamera, name, setName } = useSessionContext();

    const { selectedUserProfile } = useUserInformation();

    const { audioDeviceId, setAudioDeviceId } = audioDeviceIdHandler;
    const { videoDeviceId, setVideoDeviceId } = videoDeviceIdHandler;

    const [user, setUser] = useState<string>("");
    const [nameError, setNameError] = useState<JSX.Element | null>(null);

    const history = useHistory();

    // NOTE: Set the user customizable name based on the information from /me query. This
    // will populate the input field for the user name but still allow it to be customized
    // before joining room.
    useEffect(() => {
        if (!selectedUserProfile) return;

        if (selectedUserProfile.givenName) {
            setUser(selectedUserProfile.givenName);
        } else if(selectedUserProfile.username) {
            setUser(selectedUserProfile.username);
        }

    }, [selectedUserProfile]);

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
        }
        setCamera(stream);

        history.push(`/room`);
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
                        disabled={classtype === ClassType.LIVE && (mediaDeviceError || !stream)}
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
    const { classType: classtype } = useSessionContext();
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
