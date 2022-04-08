import { CameraPreview } from "./cameraPreview";
import { MicrophonePreview } from './microphonePreview';
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { microphoneErrorState , cameraErrorState} from "@/app/model/appModel";
import { formatDateMonthYearMillis } from "@/app/utils/dateTimeUtils";
import JoinRoomImg from "@/assets/img/join_room_study.png";
import JoinRoomTabletImg from "@/assets/img/join_room_study_tablet.png";
import BackIcon from "@/assets/img/join_study_back_icon.svg";
import CamOff from "@/assets/img/join-live-app/cam_off.svg";
import CamOn from "@/assets/img/join-live-app/cam_on.svg";
import MicOff from "@/assets/img/join-live-app/mic_off.svg";
import MicOn from "@/assets/img/join-live-app/mic_on.svg";
import MicOffDisabled from "@/assets/img/join-live-app/mic_off_disabled.svg";
import CamOffDisabled from "@/assets/img/join-live-app/cam_off_disabled.svg";
import {
    TEXT_COLOR_DUE_DATE,
    THEME_BACKGROUND_JOIN_STUDY,
    THEME_COLOR_BACKGROUND_BACK_BUTTON,
    THEME_COLOR_BACKGROUND_JOIN_BUTTON,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
} from "@/store/layoutAtoms";
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
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import Cookies from "js-cookie";
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

enum MEDIA_DEVICES{
    MICROPHONE,
    CAMERA,
}

interface MicAndCamControlsProps{
    microphonePaused: boolean;
    cameraPaused: boolean;
    setCameraPaused:  React.Dispatch<React.SetStateAction<boolean>>;
    setMicrophonePaused:  React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root:{
            position: `relative`,
            zIndex: 1,
            backgroundColor: THEME_BACKGROUND_JOIN_STUDY,
            height: `100%`,
        },
        header:{
            fontWeight: theme.typography.fontWeightBold as number,
            color: THEME_COLOR_BACKGROUND_JOIN_BUTTON,
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
            backgroundColor: THEME_COLOR_BACKGROUND_JOIN_BUTTON,
            color: theme.palette.common.white,
            padding: theme.spacing(2),
            borderRadius: theme.spacing(3),
            borderTopRightRadius: theme.spacing(1),
            fontSize: `1.15rem`,
            lineHeight: 1.334,
            fontWeight: theme.typography.fontWeightBold as number,
            "&:hover": {
                backgroundColor: THEME_COLOR_BACKGROUND_JOIN_BUTTON,
            },
            [theme.breakpoints.up(`md`)]: {
                fontSize: `1.6rem`,
            },
        },
        tabletBackIcon: {
            width: 40,
        },
        dialogCloseIconButton:{
            borderRadius: `50%`,
            width: `3.5rem`,
            height: `3.5rem`,
            background: THEME_COLOR_BACKGROUND_BACK_BUTTON,
            color: theme.palette.common.white,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            position: `fixed`,
            top: 0,
            left: 0,
            margin: theme.spacing(2),
            zIndex: 10,
            [theme.breakpoints.up(`md`)]: {
                width: `5rem`,
                height: `5rem`,
            },
        },
        img: {
            width: 450,
            borderRadius: 20,
            [theme.breakpoints.up(`md`)]: {
                width: 600,
            },
        },
        imgSmallWidth: {
            width: 350,
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
            padding: theme.spacing(6, 3, 0, 8),
            [theme.breakpoints.up(`md`)]: {
                padding: theme.spacing(6, 3, 0, 5),
            },
        },
        contentSmallWidth: {
            padding: theme.spacing(5, 3, 0, 3),
        },
        infoContainer: {
            height: `100%`,
            padding: theme.spacing(1),
        },
    }));

export default function Join (): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const intl = useIntl();
    const history = useHistory();
    const { width } = useWindowSize();
    const { restart } = useCordovaSystemContext();
    const camera = useCamera();
    const microphone = useMicrophone();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const setClassEnded = useSetRecoilState(classLeftState);
    const setClassLeft = useSetRecoilState(classEndedState);
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);
    const [ cameraPaused, setCameraPaused ] = useState(false);
    const [ microphonePaused, setMicrophonePaused ] = useState(false);
    const [ isSmallWidth, setSmallWidth ] = useState<boolean>(width <= 680);
    const [ tardyDuration, setTardyDuration ] = useState<number>(0);
    const TIME_UPDATE_STARTED_DURATION = 60 * 1000;

    const {
        title,
        dueDate,
        user_id,
        roomId,
        classType,
        startTime,
    } = useSessionContext();
    const isLiveClass = classType === ClassType.LIVE;

    useEffect(() => {
        setClassEnded(false);
        setClassLeft(false);
        Cookies.set(`roomUserId`, `${roomId}:${user_id}`); // Used to cache H5P answers (H5P-342)
    }, []);

    useEffect(() => {
        setSmallWidth(width <= 680);
    }, [ width ]);

    useEffect(() => {
        updateTardyDuration();
        setInterval(() => {
            updateTardyDuration();
        }, TIME_UPDATE_STARTED_DURATION);
    }, []);

    const updateTardyDuration = () => {
        if(!startTime) return;
        setTardyDuration(Math.floor((Date.now() - fromSecondsToMilliseconds(startTime)) / TIME_UPDATE_STARTED_DURATION));
    };

    const onCloseButtonClick = () => {
        if (restart) {
            restart();
        } else {
            history.push(`/schedule`);
        }
    };

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item>
                <div
                    className={classes.dialogCloseIconButton}
                    onClick={onCloseButtonClick}
                >
                    <img
                        alt="back icon"
                        src={BackIcon}
                        className={clsx({
                            [classes.tabletBackIcon]: !isSmDown,
                        })}
                    />
                </div>
            </Grid>
            <Grid
                container
                wrap="nowrap"
                spacing={2}
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                className={clsx(classes.content, {
                    [classes.contentSmallWidth]: isSmallWidth,
                })}
            >
                <Grid item>
                    {isLiveClass ? (
                        <Box position="relative">
                            <Box sx={{
                                width: isSmallWidth ? 350 : 450,
                                [theme.breakpoints.up(`md`)]: {
                                    width: 600,
                                },
                            }}
                            >
                                <CameraPreview paused={cameraPaused} />
                                <Box
                                    position="absolute"
                                    bottom="20px"
                                    width="100%"
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <MicrophonePreview paused={microphonePaused} />
                                </Box>
                            </Box>
                            <MicAndCamControls 
                                cameraPaused={cameraPaused}
                                microphonePaused={microphonePaused}
                                setMicrophonePaused={setMicrophonePaused} 
                                setCameraPaused={setCameraPaused}
                            />
                        </Box>
                    ): (
                        <img
                            alt=""
                            src={isSmDown ? JoinRoomImg : JoinRoomTabletImg}
                            className={clsx(classes.img, {
                                [classes.imgSmallWidth]: isSmallWidth,
                            })}
                        />
                    )}
                </Grid>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.infoContainer}
                >
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
                        <TeacherList />
                    </Grid>
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
                                variant={isSmDown ? `h5`: `h4`}
                                className={classes.subTitle}
                            >
                                {isLiveClass && tardyDuration > 0 ?
                                    <FormattedMessage
                                        id="live.enter.tardyDuration"
                                        values={{
                                            value: tardyDuration,
                                        }}
                                    />
                                    : dueDate ?
                                        `Due on ` + formatDateMonthYearMillis(fromSecondsToMilliseconds(dueDate ?? 0), intl)
                                        : ``}
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
                                    if(!cameraPaused) { camera.setSending.execute(true); }
                                    if(!microphonePaused) { microphone.setSending.execute(true); }
                                }}
                            >
                                <FormattedMessage
                                    id={isLiveClass ? `live.enter.joinLive` : `study.enter.startStudying`}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

function MicAndCamControls (props:MicAndCamControlsProps): JSX.Element {
    const classes = useStyles();
    const micError = useRecoilValue(microphoneErrorState);
    const camError = useRecoilValue(cameraErrorState);
    const { microphonePaused, cameraPaused, setCameraPaused, setMicrophonePaused} = props;
    const attachImgForMicAndCam = useCallback((type: MEDIA_DEVICES) => {
        switch(type){
            case MEDIA_DEVICES.MICROPHONE:
                if(micError) return MicOffDisabled;
                return microphonePaused ? MicOff : MicOn;
            case MEDIA_DEVICES.CAMERA:
                if(camError) return CamOffDisabled;
                return cameraPaused ? CamOff : CamOn;
            default:
                break;
        }
    }, [ micError, camError, microphonePaused, cameraPaused]);

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
                alt="mcirophone"
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

function TeacherList() : JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const { teachers } = useSessionContext();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));
    const MAX_AVATAR_DISPLAY = 6;

    return (
    <>
        <Grid
            container
            wrap="nowrap"
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="center"
            className={clsx({
                [classes.widthDisplayForOneTeacher]: teachers?.length === 1,
            })}
        >
            {teachers?.slice(0, MAX_AVATAR_DISPLAY).map(item => (
                <Grid
                    key={item.id}
                    item
                >
                    <UserAvatar
                        name={item.name}
                        size={`medium`}
                    />
                </Grid>
            ))}
            {teachers?.length === 1 && (
                <Grid item>
                    <Typography
                        variant={isSmDown ? `h5`: `h4`}
                        className={clsx(classes.subTitle, classes.insertThreeDots, classes.oneLineClamp)}
                    >
                        {teachers[0].name}
                    </Typography>
                </Grid>)}
        </Grid>
        {teachers && teachers?.length > MAX_AVATAR_DISPLAY && (
            <Grid item>
                <Typography
                    variant={isSmDown ? `h6`: `h5`}
                    className={classes.moreText}
                >
                    <FormattedMessage
                        id="live.enter.teacherCount"
                        values={{
                            value: teachers?.length - MAX_AVATAR_DISPLAY,
                        }}
                    />
                </Typography>
            </Grid>
        )}
    </>)
}