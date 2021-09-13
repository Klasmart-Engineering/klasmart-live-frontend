import { BackButton } from "@/app/components/icons/backButton";
import {
    DeviceStatus,
    useCameraContext,
} from "@/app/context-provider/camera-context";
import KidsLoopClassTeachers from "@/assets/img/classtype/kidsloop_class_teachers.svg";
import KidsLoopLiveStudents from "@/assets/img/classtype/kidsloop_live_students.svg";
import KidsLoopLiveTeachers from "@/assets/img/classtype/kidsloop_live_teachers.svg";
import KidsLoopStudyStudents from "@/assets/img/classtype/kidsloop_study_students.svg";
import KidsLoopLogoSvg from "@/assets/img/kidsloop.svg";
import Loading from "@/components/loading";
import Camera from "@/components/media/camera";
import MediaDeviceSelect from "@/components/mediaDeviceSelect";
import StyledButton from "@/components/styled/button";
import StyledIcon from "@/components/styled/icon";
import StyledTextField from "@/components/styled/textfield";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { hasJoinedClassroomState } from "@/store/layoutAtoms";
import {
    BrandingType,
    getOrganizationBranding,
} from "@/utils/utils";
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
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

const config = require(`@/../package.json`);

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
                padding: `12px 14px !important`,
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
        appHeader: {
            position: `fixed`,
            top: 0,
            left: 0,
            width: `100%`,
        },
        header:{
            color: `#fff`,
            padding: `5rem 0 3rem 0`,
            [theme.breakpoints.down(`sm`)]: {
                padding: `2.5rem 0 2rem 0`,
            },
        },
        headerText:{
            fontWeight: 600,
            [theme.breakpoints.down(`sm`)]: {
                fontSize: `1.6rem`,
            },
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
            [theme.breakpoints.down(`sm`)]: {
                height: `490px`,
            },
        },
        footer:{
            textAlign: `center`,
            "& img": {
                objectFit: `contain`,
                width: 150,
                margin: `2rem 0`,
                height: `auto`,
                [theme.breakpoints.down(`sm`)]: {
                    width: 110,
                    margin: `1.2rem 0`,
                },
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
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));

    const {
        classType,
        name,
        isTeacher,
        organizationId,
    } = useSessionContext();

    const [ dialogOpen, setDialogOpen ] = useState<boolean>(false);
    const handleDialogClose = () => setDialogOpen(false);

    const [ loading, setLoading ] = useState(true);
    const [ branding, setBranding ] = useState<BrandingType|undefined>(undefined);
    const logo = branding?.iconImageURL || KidsLoopLogoSvg;

    const history = useHistory();

    const {
        setAcquireDevices,
        setAcquireCameraDevice,
        setHighQuality,
        notFoundError,
        permissionError,
        cameraStream,
        deviceStatus,
    } = useCameraContext();

    const handleOrganizationBranding = async () => {
        setLoading(true);
        try {
            const dataBranding = await getOrganizationBranding(organizationId);
            setBranding(dataBranding);
        } catch (e) {
            console.error(`couldn't get branding: ${e}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        setHighQuality(isTeacher);
        setAcquireCameraDevice(classType === ClassType.LIVE);
        setAcquireDevices(true);
    }, [ isTeacher, classType ]);

    useEffect(() => {
        handleOrganizationBranding();
    }, []);

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
            {process.env.IS_CORDOVA_BUILD &&
                <div className={classes.appHeader}>
                    <BackButton onClick={() => history.push(`/schedule`) } />
                </div>
            }
            <div className={classes.header}>
                <Typography
                    noWrap
                    align="center"
                    variant="h3"
                    className={classes.headerText}
                    style={{
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
                justifyContent="center"
                alignItems="center"
                style={{
                    paddingBottom: `20px`,
                }}
            >
                <Container maxWidth={classType === ClassType.LIVE ? `md` : `xs`}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid
                                container
                                direction={isXsDown ? `column-reverse` : `row`}
                                justifyContent="center"
                                alignItems="center"
                                spacing={4}
                            >
                                {classType !== ClassType.LIVE ? null :
                                    <Grid
                                        item
                                        xs={6}
                                        md={7}>
                                        <CameraPreview
                                            permissionError={permissionError}
                                            videoStream={cameraStream} />
                                    </Grid>
                                }
                                <Grid
                                    item
                                    xs={6}
                                    md={classType === ClassType.LIVE ? 5 : undefined}
                                >
                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        {!isSmDown &&
                                        <Grid item>
                                            <ClassTypeLogo />
                                        </Grid>
                                        }

                                    </Grid>
                                    <JoinRoomForm
                                        mediaDeviceError={permissionError || notFoundError}
                                        stream={cameraStream}
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

            {process.env.IS_CORDOVA_BUILD && <Typography className={classes.version}>{config.version}</Typography>}

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
            justifyContent="center"
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
    const { classType, isTeacher } = useSessionContext();
    const IMG_HEIGHT = `64px`;
    const IMG_SRC = classType === ClassType.LIVE ? (isTeacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents) : classType === ClassType.CLASSES ? KidsLoopClassTeachers : KidsLoopStudyStudents;

    return (<img
        alt="KidsLoop Live"
        src={IMG_SRC}
        height={IMG_HEIGHT}
        className={logo} />);
}

interface JoinRoomFormProps {
    mediaDeviceError: boolean;
    stream: MediaStream | undefined;
}

function JoinRoomForm ({
    mediaDeviceError,
    stream,
}: JoinRoomFormProps): JSX.Element {
    const {
        classType,
        setCamera,
        name,
        setName,
    } = useSessionContext();

    const [ hasJoinedClassroom, setHasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    const [ user, setUser ] = useState<string>(``);
    const [ nameError, setNameError ] = useState<JSX.Element | null>(null);

    const {
        setSelectedAudioDeviceId,
        selectedAudioDeviceId,
        availableAudioDevices,
        setSelectedVideoDeviceId,
        selectedVideoDeviceId,
        availableVideoDevices,
    } = useCameraContext();

    const history = useHistory();

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

        if (process.env.IS_CORDOVA_BUILD) {
            history.push(`/room`);
        }
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

                {classType !== ClassType.LIVE ? null :
                    <Grid
                        item
                        xs>
                        <MediaDeviceSelect
                            disabled={availableVideoDevices.length <= 1}
                            deviceType="video"
                            deviceId={selectedVideoDeviceId}
                            devices={availableVideoDevices}
                            onChange={(e) => setSelectedVideoDeviceId(e.target.value as string) }
                        />
                    </Grid>
                }
                <Grid
                    item
                    xs>
                    <MediaDeviceSelect
                        disabled={availableAudioDevices.length <= 1}
                        deviceType="audio"
                        deviceId={selectedAudioDeviceId}
                        devices={availableAudioDevices}
                        onChange={(e) => setSelectedAudioDeviceId(e.target.value as string)}
                    />
                </Grid>
                <Grid
                    item
                    xs>
                    <StyledButton
                        fullWidth
                        disabled={classType === ClassType.LIVE && (mediaDeviceError || !stream)}
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
    const { classType } = useSessionContext();
    const {
        dialogOpen,
        handleDialogClose,
        deviceStatus,
    } = dialogOpenHandler;
    const [ dialogTitle, setDialogTitle ] = useState(`join_permissionAlertDialog_title`);
    const [ dialogContent, setDialogContent ] = useState(`join_permissionAlertDialog_contentText_live`);

    useEffect(() => {
        if(classType !== ClassType.LIVE){
            if(DeviceStatus.MIC_NOT_ALLOWED){
                setDialogTitle(`join_permissionAlertDialog_mic_blocked_title`);
                setDialogContent(`join_permissionAlertDialog_mic_blocked_contentText_live`);
            }else if(DeviceStatus.MIC_NOT_FOUND){
                setDialogTitle(`join_permissionAlertDialog_mic_not_exist_title`);
                setDialogContent(`join_permissionAlertDialog_mic_not_exist_contentText_live`);
            }
        }
    }, [ classType, deviceStatus ]);

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
