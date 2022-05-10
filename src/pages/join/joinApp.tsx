import { CameraPreview } from "./cameraPreview";
import { MicrophonePreview } from './microphonePreview';
import { microphoneErrorState, cameraErrorState } from "@/app/model/appModel";
import { classEndedState, classLeftState, hasJoinedClassroomState } from "@/store/layoutAtoms";
import { formatDateMonthYearMillis } from "@/app/utils/dateTimeUtils";
import Loading from "@/components/loading";
import JoinRoomImg from "@/assets/img/join_room_study.png";
import BackIcon from "@/assets/img/join_study_back_icon.svg";
import CamOff from "@/assets/img/join-live-app/cam_off.svg";
import CamOn from "@/assets/img/join-live-app/cam_on.svg";
import MicOff from "@/assets/img/join-live-app/mic_off.svg";
import MicOn from "@/assets/img/join-live-app/mic_on.svg";
import MicOffDisabled from "@/assets/img/join-live-app/mic_off_disabled.svg";
import CamOffDisabled from "@/assets/img/join-live-app/cam_off_disabled.svg";
import { MediaDeviceSelect } from "@/components/mediaDeviceSelect";
import {
    PermissionType,
    useCordovaSystemContext
} from "@/app/context-provider/cordova-system-context";
import {
    TEXT_COLOR_DUE_DATE,
    THEME_BACKGROUND_JOIN_APP,
    THEME_COLOR_BACKGROUND_BACK_BUTTON,
    PARENTAL_LOCK_HEADER_TEXT_COLOR,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { fromSecondsToMilliseconds } from "@/utils/utils";
import { useWindowSize } from "@/utils/viewport";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    useCamera,
    useMicrophone,
} from "@kl-engineering/live-state/ui";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Typography,
} from "@material-ui/core";
import Cookies from "js-cookie";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
    useCallback,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";

enum MEDIA_DEVICES {
    MICROPHONE,
    CAMERA,
}

interface MicAndCamControlsProps {
    microphonePaused: boolean;
    cameraPaused: boolean;
    setCameraPaused: React.Dispatch<React.SetStateAction<boolean>>;
    setMicrophonePaused: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MediaDeviceGroupProps {
    isLiveClass: boolean;
}

interface TeacherListProps{
    max: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `relative`,
            backgroundColor: THEME_BACKGROUND_JOIN_APP,
            height: `100%`,
        },
        header: {
            fontWeight: theme.typography.fontWeightBold as number,
            color: PARENTAL_LOCK_HEADER_TEXT_COLOR,
            textAlign: `center`,
            [theme.breakpoints.down(`sm`)]: {
                fontSize: `1.6rem`,
            },
        },
        insertThreeDots: {
            display: `-webkit-box`,
            overflow: `hidden`,
            WebkitBoxOrient: `vertical`,
            WebkitLineClamp: 2,
        },
        oneLineClamp: {
            WebkitLineClamp: 1,
        },
        subTitle: {
            color: TEXT_COLOR_DUE_DATE,
            fontWeight: theme.typography.fontWeightBold as number,
        },
        moreText: {
            color: TEXT_COLOR_DUE_DATE,
            fontWeight: theme.typography.fontWeightMedium as number,
        },
        joinButton: {
            width: `100%`,
            backgroundColor: PARENTAL_LOCK_HEADER_TEXT_COLOR,
            color: theme.palette.common.white,
            padding: theme.spacing(2),
            borderRadius: theme.spacing(3),
            borderTopRightRadius: theme.spacing(1),
            fontSize: `1.15rem`,
            lineHeight: 1.334,
            fontWeight: theme.typography.fontWeightBold as number,
            "&:hover": {
                backgroundColor: PARENTAL_LOCK_HEADER_TEXT_COLOR,
            },
            [theme.breakpoints.up(`md`)]: {
                fontSize: `1.6rem`,
            },
        },
        backIcon: {
            borderRadius: `50%`,
            width: `4rem`,
            height: `4rem`,
            background: THEME_COLOR_BACKGROUND_BACK_BUTTON,
            color: theme.palette.common.white,
            padding: theme.spacing(2),
            [theme.breakpoints.up(`md`)]: {
                width: `5rem`,
                height: `5rem`,
            },
        },
        iconImg: {
            [theme.breakpoints.up(`md`)]: {
                width: 70,
                height: 70,
            },
        },
        fullWidth: {
            width: `100%`,
        },
        widthDisplayForOneTeacher: {
            width: `80%`,
        },
        content: {
            padding: theme.spacing(3.5, 4, 0, 9),
            [theme.breakpoints.up(`md`)]: {
                padding: theme.spacing(6, 8, 0, 10),
            },
        },
        contentStudy: {
            height: `70%`,
        },
        contentSmallWidth: {
            padding: theme.spacing(5, 6, 0, 7.5),
        },
        infoContainer: {
            height: `100%`,
        },
        mediaDevicSelect: {
            display: `none`,
        },
        thumbnail: {
            borderRadius: theme.spacing(4),
            height: '100%',
            backgroundImage: `url('${JoinRoomImg}')`,
            backgroundSize: `cover`,
            backgroundPosition: `center center`,
            [theme.breakpoints.up(`md`)]: {
                backgroundPosition: `55% center`,
            },
        }
    }));

export default function Join(): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const intl = useIntl();
    const history = useHistory();
    const { width } = useWindowSize();
    const camera = useCamera();
    const microphone = useMicrophone();
    const DETECT_SMALL_WIDTH_VALUE = 740;
    const TIME_UPDATE_TARDY_DURATION = 60 * 1000;
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);
    const setClassLeft = useSetRecoilState(classLeftState);
    const setClassEnded = useSetRecoilState(classEndedState);
    const [cameraPaused, setCameraPaused] = useState(false);
    const [microphonePaused, setMicrophonePaused] = useState(false);
    const [isSmallWidth, setIsSmallWidth] = useState<boolean>(width <= DETECT_SMALL_WIDTH_VALUE);
    const [tardyDuration, setTardyDuration] = useState<number>(0);
    const [ requestedNativePermission, setRequestedNativePermission ] = useState(false);

    const {
        title,
        dueDate,
        classType,
        startTime,
        roomId,
        user_id,
    } = useSessionContext();
    const isLiveClass = classType === ClassType.LIVE;
    const {
        requestPermissions: requestNativePermissions,
        isIOS,
        restart,
    } = useCordovaSystemContext();


    useEffect(() => {
        setIsSmallWidth(width <= DETECT_SMALL_WIDTH_VALUE);
    }, [width]);

    useEffect(() => {
        updateTardyDuration();
        setInterval(() => {
            updateTardyDuration();
        }, TIME_UPDATE_TARDY_DURATION);
    }, []);

    useEffect(() => {
        if (!isIOS) {
            requestNativePermissions({
                permissionTypes: [ PermissionType.CAMERA, PermissionType.MIC ],
                onSuccess: () => {
                    setRequestedNativePermission(true);
                },
                onError: () => {
                    setRequestedNativePermission(true);
                },
            });
        }
        setClassEnded(false);
        setClassLeft(false);

        Cookies.set(`roomUserId`, `${roomId}:${user_id}`); // Used to cache H5P answers (H5P-342)
    }, []);

    const updateTardyDuration = () => {
        if (!startTime) return;
        setTardyDuration(Math.floor((Date.now() - fromSecondsToMilliseconds(startTime)) / TIME_UPDATE_TARDY_DURATION));
    };

    const onCloseButtonClick = () => {
        if (restart) {
            restart();
        } else {
            history.push(`/schedule`);
        }
    };


    if (!isIOS && !requestedNativePermission) {
        return <Loading messageId="loading" />;
    }

    return (
        <div className={classes.root}>
            <Box
                position="fixed"
                top={theme.spacing(2.5)}
                left={theme.spacing(2.5)}
                zIndex="10"
                onClick={onCloseButtonClick}
            >
                <img
                    alt="back icon"
                    src={BackIcon}
                    className={classes.backIcon}
                />
            </Box>
            <Box 
                height="100%" 
                display="flex" 
                alignItems="center" 
                justifyContent="center">
                <Grid
                    container
                    wrap="nowrap"
                    spacing={2}
                    justifyContent="space-around"
                    alignItems="stretch"
                    className={clsx(classes.content, {
                        [classes.contentSmallWidth]: isSmallWidth,
                        [classes.contentStudy]: !isLiveClass,
                    })}
                >
                    <Grid item xs={7}>
                        {isLiveClass ? (
                            <Box position="relative">
                                <CameraPreview paused={cameraPaused} />
                                <Box
                                    position="absolute"
                                    bottom={theme.spacing(1.5)}
                                    width="100%"
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <MicrophonePreview paused={microphonePaused} />
                                </Box>
                                <MicAndCamControls
                                    cameraPaused={cameraPaused}
                                    microphonePaused={microphonePaused}
                                    setMicrophonePaused={setMicrophonePaused}
                                    setCameraPaused={setCameraPaused}
                                />
                            </Box>
                        ) : (
                            <div className={classes.thumbnail}></div>
                        )}
                    </Grid>
                    <Grid item xs>
                        <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="space-between"
                            className={classes.infoContainer}
                        >
                            <Grid item>
                                <Grid
                                    container
                                    spacing={2}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                >
                                    <Grid item>
                                        <Typography
                                            align="center"
                                            variant="h2"
                                            className={clsx(classes.header, classes.insertThreeDots)}
                                        >
                                            {title}
                                        </Typography>
                                    </Grid>
                                    <TeacherList max={6} />
                                </Grid>
                            </Grid>
                            <Grid item className={classes.fullWidth}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                >
                                    <Grid item>
                                        <Typography
                                            align="center"
                                            variant={isSmDown ? `h5` : `h4`}
                                            className={classes.subTitle}
                                        >
                                            {isLiveClass && tardyDuration > 0 ?
                                                <FormattedMessage
                                                    id="live.enter.tardyDuration"
                                                    values={{
                                                        value: tardyDuration,
                                                    }}
                                                />
                                                : !!dueDate &&
                                                    <FormattedMessage
                                                        id="study.enter.due"
                                                        values={{
                                                            value: formatDateMonthYearMillis(fromSecondsToMilliseconds(dueDate), intl),
                                                        }}
                                                        defaultMessage="Due on {value}"
                                                    />}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        className={classes.fullWidth}
                                    >
                                        <Button
                                            disableElevation
                                            className={classes.joinButton}
                                            variant="contained"
                                            onClick={() => {
                                                setHasJoinedClassroom(true);
                                                if (!cameraPaused) { camera.setSending.execute(true); }
                                                if (!microphonePaused) { microphone.setSending.execute(true); }
                                            }}
                                        >
                                            <FormattedMessage
                                                id={isLiveClass ?
                                                    `live.enter.joinLive` :
                                                    `study.enter.startStudying`}
                                            />
                                        </Button>
                                    </Grid>
                                    <MediaDeviceGroup isLiveClass />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

function MicAndCamControls(props: MicAndCamControlsProps): JSX.Element {
    const classes = useStyles();
    const micError = useRecoilValue(microphoneErrorState);
    const camError = useRecoilValue(cameraErrorState);
    const { microphonePaused, cameraPaused, setCameraPaused, setMicrophonePaused } = props;
    const attachImgForMicAndCam = useCallback((type: MEDIA_DEVICES) => {
        switch (type) {
            case MEDIA_DEVICES.MICROPHONE:
                if (micError) return MicOffDisabled;
                return microphonePaused ? MicOff : MicOn;
            case MEDIA_DEVICES.CAMERA:
                if (camError) return CamOffDisabled;
                return cameraPaused ? CamOff : CamOn;
            default:
                break;
        }
    }, [micError, camError, microphonePaused, cameraPaused]);

    return (<Box
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <IconButton
            disableRipple
            disableFocusRipple
            disabled={micError}
            onClick={() => setMicrophonePaused(!microphonePaused)}
        >
            <img
                alt="microphone"
                className={classes.iconImg}
                src={attachImgForMicAndCam(MEDIA_DEVICES.MICROPHONE)}
            />
        </IconButton>
        <IconButton
            disableRipple
            disableFocusRipple
            disabled={camError}
            onClick={() => setCameraPaused(!cameraPaused)}
        >
            <img
                alt="camera"
                className={classes.iconImg}
                src={attachImgForMicAndCam(MEDIA_DEVICES.CAMERA)}
            />
        </IconButton>
    </Box>)
}

function TeacherList({ max }: TeacherListProps): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const { teachers } = useSessionContext();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <>
            <Grid
                container
                wrap="nowrap"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                className={clsx({
                    [classes.widthDisplayForOneTeacher]: teachers?.length === 1,
                })}
            >
                {teachers?.slice(0, max).map(teacher => (
                    <Grid
                        key={teacher.id}
                        item
                    >
                        <UserAvatar
                            name={teacher.name}
                            size={`medium`}
                        />
                    </Grid>
                ))}
                {teachers?.length === 1 && (
                    <Grid item>
                        <Typography
                            variant={isSmDown ? `h5` : `h4`}
                            className={clsx(classes.subTitle, classes.insertThreeDots, classes.oneLineClamp)}
                        >
                            {teachers[0].name}
                        </Typography>
                    </Grid>)}
            </Grid>
            {teachers && teachers?.length > max && (
                <Grid item>
                    <Typography
                        variant={isSmDown ? `h6` : `h5`}
                        className={classes.moreText}
                    >
                        <FormattedMessage
                            id="live.enter.teacherCount"
                            values={{
                                value: teachers?.length - max,
                            }}
                        />
                    </Typography>
                </Grid>
            )}
        </>)
}

function MediaDeviceGroup({ isLiveClass }: MediaDeviceGroupProps): JSX.Element {
    const classes = useStyles();
    return (
        <Grid
            item
            className={classes.mediaDevicSelect}
        >
            <Box
                my={1}
                display="flex"
                justifyContent="center"
            >
                <MediaDeviceSelect kind="audioinput" />
            </Box>
            {isLiveClass && (
                <Box
                    my={1}
                    display="flex"
                    justifyContent="center"
                >
                    <MediaDeviceSelect kind="videoinput" />
                </Box>
            )}
        </Grid>
    );
}