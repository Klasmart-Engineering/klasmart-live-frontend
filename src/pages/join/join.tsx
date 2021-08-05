import KidsLoopClassTeachers from "../../assets/img/classtype/kidsloop_class_teachers.svg";
import KidsLoopLiveStudents from "../../assets/img/classtype/kidsloop_live_students.svg";
import KidsLoopLiveTeachers from "../../assets/img/classtype/kidsloop_live_teachers.svg";
import KidsLoopStudyStudents from "../../assets/img/classtype/kidsloop_study_students.svg";
import KidsLoopLogoSvg from "../../assets/img/kidsloop.svg";
import Loading from "../../components/loading";
import Camera from "../../components/media/camera";
import MediaDeviceSelect from "../../components/mediaDeviceSelect";
import StyledButton from "../../components/styled/button";
import StyledIcon from "../../components/styled/icon";
import StyledTextField from "../../components/styled/textfield";
import {
    BrandingType,
    getOrganizationBranding,
} from "../../newuiupdate/components/utils/utils";
import { LocalSessionContext } from "../../newuiupdate/providers/providers";
import { ClassType } from "../../store/actions";
import { hasJoinedClassroomState } from "../../store/layoutAtoms";
import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { InfoCircle as InfoCircleIcon } from "@styled-icons/boxicons-solid/InfoCircle";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const config = require(`../../../package.json`);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root:{},
        rootTeacher:{
            "& $headerBg": {
                background: `linear-gradient(87deg, rgba(103,161,214,1) 0%, rgba(82,141,195,1) 100%)`,
            },
        },
        card: {
            borderRadius: 20,
            boxShadow: `0px 4px 8px 0px rgb(0 0 0 / 10%)`,
        },
        cardContent:{
            padding: `22px !important`,
            [theme.breakpoints.down(`sm`)]: {
                maxWidth: 360,
                margin: `0 auto`,
            },
        },
        logo: {
            display: `block`,
            margin: `0 auto`,
            marginBottom: `1rem`,
            width: `auto`,
            maxHeight: `26px`,
            objectFit: `contain`,
        },
        header:{
            color: `#fff`,
            padding: `5rem 0 3rem 0`,
        },
        headerBg:{
            position: `fixed`,
            height: `620px`,
            width: `100%`,
            zIndex: -1,
            top: 0,
            left: 0,
            background: `linear-gradient(87deg, rgba(145,102,253,1) 0%, rgba(134,90,243,1) 100%)`,
            "&:after":{
                content: `''`,
                width: `200%`,
                height: 0,
                paddingTop: 300,
                borderRadius: `100% 100% 0 0`,
                background: `#fff`,
                position: `absolute`,
                bottom: 0,
                left: `50%`,
                transform: `translateX(-50%)`,
            },
        },
        footer:{
            textAlign: `center`,
            "& img": {
                objectFit: `contain`,
                width: 150,
                margin: `2rem 0`,
                height: `auto`,
            },
        },
        version:{
            position: `absolute`,
            bottom: 10,
            right: 20,
            color: theme.palette.grey[400],
            fontSize: `1rem`,
        },
    }));

export default function Join (): JSX.Element {
    const { card } = useStyles();
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const {
        classtype,
        name,
        isTeacher,
        org_id,
    } = useContext(LocalSessionContext);

    const [ dialogOpen, setDialogOpen ] = useState<boolean>(false);
    const handleDialogClose = () => setDialogOpen(false);

    const [ deviceStatus, setDeviceStatus ] = useState<string>(``);
    const [ permissionError, setPermissionError ] = useState<boolean>(false);
    const [ loadError, setLoadError ] = useState<boolean>(false);
    const [ audioDeviceOptions, setAudioDeviceOptions ] = useState<MediaDeviceInfo[]>([]);
    const [ videoDeviceOptions, setVideoDeviceOptions ] = useState<MediaDeviceInfo[]>([]);
    const [ audioDeviceId, setAudioDeviceId ] = useState<string>(``);
    const [ videoDeviceId, setVideoDeviceId ] = useState<string>(``);
    const [ stream, setStream ] = useState<MediaStream>();
    const [ loading, setLoading ] = useState(true);
    const [ branding, setBranding ] = useState<BrandingType|undefined>(undefined);
    const logo = branding?.iconImageURL || KidsLoopLogoSvg;

    const handleOrganizationBranding = async () => {
        setLoading(true);
        try {
            const dataBranding = await getOrganizationBranding(org_id);
            setBranding(dataBranding);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleOrganizationBranding();

        if (!navigator.mediaDevices) { return; }

        const getMediaPermissions = async () => {
            switch(classtype){
            case ClassType.LIVE:
                try{
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });
                    await loadMediaDevices();
                }
                catch (e) {
                    console.error(`getMediaPermissions Error - ${e}`);
                    setPermissionError(true); setDialogOpen(true);
                }
                break;
            default:
                try {
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                    await loadMediaDevices();
                }
                catch (e){
                    if (isMediaNotFoundError(e)) {
                        setDeviceStatus(DeviceStatus.MIC_NOT_FOUND);
                    } else if (isMediaNotAllowedError(e)) {
                        setDeviceStatus(DeviceStatus.MIC_NOT_ALLOWED);
                    } else {
                        setDeviceStatus(DeviceStatus.MIC_ERROR);
                    }
                    console.error(`getMediaPermissions Error - ${e}`);
                    setPermissionError(false); setDialogOpen(true);
                }
            }
        };
        getMediaPermissions();

        // When user disconnect or connect a media device, the media devices that connected to computer are reloaded.
        navigator.mediaDevices.addEventListener(`devicechange`, loadMediaDevices);
        return () => { navigator.mediaDevices.removeEventListener(`devicechange`, loadMediaDevices); };
    }, []);

    async function loadMediaDevices () {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            const audioDevices = devices.filter((d) => d.kind == `audioinput`);
            setAudioDeviceOptions(audioDevices);

            if (audioDevices.length > 0) {
                // Select the first mic only if there is no mic selected
                if (audioDeviceId === ``) setAudioDeviceId(audioDevices[0].deviceId);
            } else {
                setAudioDeviceId(``);
            }

            if (classtype === ClassType.LIVE) {
                const videoDevices = devices.filter((d) => d.kind == `videoinput`);
                setVideoDeviceOptions(videoDevices);

                if (videoDevices.length > 0) {
                    // Select the first cam only if there is no cam selected
                    if (videoDeviceId === ``) setVideoDeviceId(videoDevices[0].deviceId);
                } else {
                    setVideoDeviceId(``);
                }
            }
        } catch (e) {
            console.error(`loadMediaDevices Error - ${e}`);
            setLoadError(true);
        }
    }

    function getMicStream (deviceId: string) {
        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId,
            },
        }).then((s) => {
            setStream(s);
            setLoadError(false);
        }).catch((e) => {
            console.error(`getMicStream Error - ${e}`);
            setStream(undefined);
            setLoadError(true);
        });
    }

    function getCamStream (audioDeviceId: string, videoDeviceId: string) {
        const videoConstraints: MediaTrackConstraints = {
            width: {
                max: 720,
                ideal: isTeacher?720:180,
            },
            height: {
                max: 540,
                ideal: isTeacher?405:96,
            },
            frameRate: {
                max: 15,
                ideal: isTeacher?15:10,
            },
        };

        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: audioDeviceId,
            },
            video: {
                deviceId: videoDeviceId,
            },
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

    function isMediaNotFoundError (error: any) {
        return error.name === `NotFoundError` || error.name === `DevicesNotFoundError`;
    }

    function isMediaNotAllowedError (error: any) {
        return error.name === `NotAllowedError` || error.name === `PermissionDeniedError`;
    }

    useEffect(() => {
        if (!navigator.mediaDevices) { return; }
        if (classtype === ClassType.LIVE) {
            getCamStream(audioDeviceId, videoDeviceId);
        } else {
            getMicStream(audioDeviceId);
        }
    }, [ videoDeviceId, audioDeviceId ]);

    if (loading) {
        return <Grid
            container
            alignItems="center"
            style={{
                height: `100%`,
            }}><Loading messageId="loading" /></Grid>;
    }

    return (
        <div className={clsx(classes.root, {
            [classes.rootTeacher]: isTeacher,
        })}>
            <div className={classes.header}>
                <Typography
                    noWrap
                    align="center"
                    variant="h3"
                    style={{
                        fontWeight: 600,
                        color: branding?.primaryColor && theme.palette.getContrastText(branding?.primaryColor),
                    }}
                >
                    <FormattedMessage
                        id={name ? `hello` : `join_your_class`}
                        values={{
                            name,
                        }} />
                </Typography>
                <div
                    className={classes.headerBg}
                    style={{
                        background: branding?.primaryColor && branding?.primaryColor,
                    }}></div>
            </div>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{
                    paddingBottom: `20px`,
                }}
            >
                <Container maxWidth={classtype === ClassType.LIVE ? `md` : `xs`}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid
                                container
                                direction={isSmDown ? `column-reverse` : `row`}
                                justify="center"
                                alignItems="center"
                                spacing={4}
                            >
                                {classtype !== ClassType.LIVE ? null :
                                    <Grid
                                        item
                                        xs={12}
                                        md={7}>
                                        <CameraPreview
                                            permissionError={permissionError}
                                            videoStream={stream} />
                                    </Grid>
                                }
                                <Grid
                                    item
                                    xs={12}
                                    md={classtype === ClassType.LIVE ? 5 : undefined}
                                >
                                    <Grid
                                        container
                                        direction="column"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <ClassTypeLogo />
                                        </Grid>
                                    </Grid>
                                    <JoinRoomForm
                                        mediaDeviceError={permissionError || loadError}
                                        stream={stream}
                                        audioDeviceOptions={audioDeviceOptions}
                                        audioDeviceIdHandler={{
                                            audioDeviceId,
                                            setAudioDeviceId,
                                        }}
                                        videoDeviceOptions={videoDeviceOptions}
                                        videoDeviceIdHandler={{
                                            videoDeviceId,
                                            setVideoDeviceId,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <div className={classes.footer}>
                        <img src={logo} />
                    </div>
                </Container>
            </Grid>
            <Typography className={classes.version}>{config.version}</Typography>
            <PermissionAlertDialog dialogOpenHandler={{
                dialogOpen,
                handleDialogClose,
                deviceStatus,
            }} />
        </div>
    );
}

function CameraPreview ({ permissionError, videoStream }: {
    permissionError: boolean;
    videoStream: MediaStream | undefined;
}): JSX.Element {

    return (
        permissionError ?
            <CameraPreviewFallback permissionError /> : (
                videoStream && videoStream.getVideoTracks().length > 0 && videoStream.getVideoTracks().every((t) => t.readyState === `live`) && videoStream.active ?
                    <Camera
                        mediaStream={videoStream}
                        muted={true} /> :
                    <Loading messageId="allow_media_permission" />
            )
    );
}

function CameraPreviewFallback ({ permissionError }: { permissionError: boolean }) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="center"
            style={{
                position: `relative`,
                height: 0,
                paddingBottom: `56.25%`, // 16:9
                backgroundColor: `#000`,
                borderRadius: 12,
            }}
        >
            <Typography
                variant={isSmDown ? `caption` : `body1`}
                align="center"
                style={{
                    position: `absolute`,
                    top: `50%`,
                    left: `50%`,
                    transform: `translate(-50%, -50%)`,
                    whiteSpace: `pre-line`,
                    wordBreak: `break-word`,
                    color: `#FFF`,
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

function ClassTypeLogo (): JSX.Element {
    const { logo } = useStyles();
    const { classtype, isTeacher } = useContext(LocalSessionContext);
    const IMG_HEIGHT = `64px`;
    const IMG_SRC = classtype === ClassType.LIVE ? (isTeacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents) : classtype === ClassType.CLASSES ? KidsLoopClassTeachers : KidsLoopStudyStudents;

    return (<img
        alt="KidsLoop Live"
        src={IMG_SRC}
        height={IMG_HEIGHT}
        className={logo} />);
}

interface JoinRoomFormProps {
    mediaDeviceError: boolean;
    stream: MediaStream | undefined;
    audioDeviceOptions: MediaDeviceInfo[];
    audioDeviceIdHandler: {
        audioDeviceId: string;
        setAudioDeviceId: React.Dispatch<React.SetStateAction<string>>;
    };
    videoDeviceOptions: MediaDeviceInfo[];
    videoDeviceIdHandler: {
        videoDeviceId: string;
        setVideoDeviceId: React.Dispatch<React.SetStateAction<string>>;
    };
}

function JoinRoomForm ({
    mediaDeviceError,
    stream,
    audioDeviceOptions,
    videoDeviceOptions,
    audioDeviceIdHandler,
    videoDeviceIdHandler,
}: JoinRoomFormProps): JSX.Element {
    const {
        classtype,
        setCamera,
        name,
        setName,
        sessionId,

    } = useContext(LocalSessionContext);

    const [ hasJoinedClassroom, setHasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    const { audioDeviceId, setAudioDeviceId } = audioDeviceIdHandler;
    const { videoDeviceId, setVideoDeviceId } = videoDeviceIdHandler;

    const [ user, setUser ] = useState<string>(``);
    const [ nameError, setNameError ] = useState<JSX.Element | null>(null);

    function join (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setNameError(null);
        if (!user) {
            setNameError(<span style={{
                display: `flex`,
                alignItems: `center`,
            }}>
                <StyledIcon
                    icon={<InfoCircleIcon />}
                    size="small"
                    color="#dc004e" />
                <Typography variant="caption">
                    <FormattedMessage id="error_empty_name" />
                </Typography>
            </span>);
        }
        if (!name) {
            setName(user);
        }
        setCamera(stream);
        setHasJoinedClassroom(true);
        localStorage.setItem(`ObserveWarning`, `true`);
    }

    return (
        <form onSubmit={join}>
            <Grid
                container
                direction="column"
                spacing={2}>
                {!name && <Grid
                    item
                    xs><StyledTextField
                        fullWidth
                        label={<FormattedMessage id="what_is_your_name" />}
                        value={user}
                        error={nameError !== null}
                        helperText={nameError}
                        onChange={(e) => setUser(e.target.value)}
                    /></Grid>
                }

                {classtype !== ClassType.LIVE ? null :
                    <Grid
                        item
                        xs>
                        <MediaDeviceSelect
                            disabled={videoDeviceOptions.length <= 1}
                            deviceType="video"
                            deviceId={videoDeviceId}
                            devices={videoDeviceOptions}
                            onChange={(e) => setVideoDeviceId(e.target.value as string)}
                        />
                    </Grid>
                }
                <Grid
                    item
                    xs>
                    <MediaDeviceSelect
                        disabled={audioDeviceOptions.length <= 1}
                        deviceType="audio"
                        deviceId={audioDeviceId}
                        devices={audioDeviceOptions}
                        onChange={(e) => setAudioDeviceId(e.target.value as string)}
                    />
                </Grid>
                <Grid
                    item
                    xs>
                    <StyledButton
                        fullWidth
                        disabled={classtype === ClassType.LIVE && (mediaDeviceError || !stream)}
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
    );
}

function PermissionAlertDialog ({ dialogOpenHandler }: {
    dialogOpenHandler: {
        dialogOpen: boolean;
        handleDialogClose: () => void;
        deviceStatus: string;
    };
}) {
    const { classtype } = useContext(LocalSessionContext);
    const {
        dialogOpen,
        handleDialogClose,
        deviceStatus,
    } = dialogOpenHandler;
    const [ dialogTitle, setDialogTitle ] = useState(`join_permissionAlertDialog_title`);
    const [ dialogContent, setDialogContent ] = useState(`join_permissionAlertDialog_contentText_live`);

    useEffect(() => {
        if(classtype !== ClassType.LIVE){
            if(DeviceStatus.MIC_NOT_ALLOWED){
                setDialogTitle(`join_permissionAlertDialog_mic_blocked_title`);
                setDialogContent(`join_permissionAlertDialog_mic_blocked_contentText_live`);
            }else if(DeviceStatus.MIC_NOT_FOUND){
                setDialogTitle(`join_permissionAlertDialog_mic_not_exist_title`);
                setDialogContent(`join_permissionAlertDialog_mic_not_exist_contentText_live`);
            }
        }
    }, [ classtype, deviceStatus ]);

    return (
        <Dialog
            open={dialogOpen}
            aria-labelledby="media-permission-alert-title"
            aria-describedby="media-permission-alert-description"
            onClose={handleDialogClose}
        >
            <DialogTitle id="media-permission-alert-title">
                <FormattedMessage id={dialogTitle} />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="media-permission-alert-description">
                    <FormattedMessage id={dialogContent} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={handleDialogClose}>
                    <FormattedMessage id="join_permissionAlertDialog_action_close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export enum DeviceStatus {
    MIC_ERROR = `mic_error`,
    MIC_NOT_FOUND = `mic_not_found`,
    MIC_NOT_ALLOWED = `mic_not_allowed`
}
