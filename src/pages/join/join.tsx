/* eslint-disable react/no-multi-comp */
import { CameraPreview } from "./cameraPreview";
import { MicrophonePreview } from "./microphonePreview";
import BackButton from "@/app/components/layout/BackButton";
import {
    PermissionType,
    useCordovaSystemContext,
} from "@/app/context-provider/cordova-system-context";
import KidsLoopClassTeachers from "@/assets/img/classtype/kidsloop_class_teachers.svg";
import KidsLoopLiveStudents from "@/assets/img/classtype/kidsloop_live_students.svg";
import KidsLoopLiveTeachers from "@/assets/img/classtype/kidsloop_live_teachers.svg";
import KidsLoopReviewStudents from "@/assets/img/classtype/kidsloop_review_students.svg";
import KidsLoopStudyStudents from "@/assets/img/classtype/kidsloop_study_students.svg";
import KidsLoopLogoSvg from "@/assets/img/kidsloop.svg";
import Loading from "@/components/loading";
import { MediaDeviceSelect } from "@/components/mediaDeviceSelect";
import StyledButton from "@/components/styled/button";
import StyledIcon from "@/components/styled/icon";
import StyledTextField from "@/components/styled/textfield";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
    showSelectAttendeesState,
} from "@/store/layoutAtoms";
import { getOrganizationBranding, removeKLLH5PStateStorage } from "@/utils/utils";
import {
    useCamera,
    useMicrophone,
} from "@kl-engineering/live-state/ui";
import {
    Box,
    Grid,
    IconButton,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { red } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { InfoCircle as InfoCircleIcon } from "@styled-icons/boxicons-solid/InfoCircle";
import clsx from "clsx";
import Cookies from "js-cookie";
import React,
{
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
    VoidFunctionComponent,
} from "react";
import { useAsync } from "react-async-hook";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root:{
            position: `relative`,
            zIndex: 1,
        },
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
            fontWeight: theme.typography.fontWeightBold as number,
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
        user_id,
        roomId,
    } = useSessionContext();

    const brandingEndpoint = useHttpEndpoint(`user`);
    const brandingAsync = useAsync((id: string, endpoint: string) => getOrganizationBranding(id, endpoint), [ organizationId, brandingEndpoint ]);
    const logo = brandingAsync.result?.iconImageURL || KidsLoopLogoSvg;

    const setClassEnded = useSetRecoilState(classLeftState);
    const setClassLeft = useSetRecoilState(classEndedState);
    const setShowSelectAttendees = useSetRecoilState(showSelectAttendeesState);
    const [ requestedNativePermission, setRequestedNativePermission ] = useState(false);

    const history = useHistory();
    const {
        requestPermissions: requestNativePermissions,
        isIOS,
        restart,
    } = useCordovaSystemContext();

    useEffect(() => {
        if (process.env.IS_CORDOVA_BUILD && !isIOS) {
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
        setShowSelectAttendees(classType === ClassType.CLASSES);

        Cookies.set(`roomUserId`, `${roomId}:${user_id}`); // Used to cache H5P answers (H5P-342)

        removeKLLH5PStateStorage();
    }, []);

    const [ cameraPaused, setCameraPaused ] = useState(false);
    const [ microphonePaused, setMicrophonePaused ] = useState(false);

    // Should access the camera after allow camera permission, have to restart the device if not.
    if (process.env.IS_CORDOVA_BUILD && !isIOS && !requestedNativePermission) {
        return <Loading messageId="loading" />;
    }

    if (brandingAsync.loading) {
        return <Loading messageId="loading" />;
    }

    const onCloseButtonClick = () => {
        if (restart) {
            restart();
        } else {
            history.push(`/schedule`);
        }
    };

    return (
        <div className={clsx(classes.root, {
            [classes.rootTeacher]: isTeacher,
        })}
        >
            {process.env.IS_CORDOVA_BUILD &&
                <div className={classes.appHeader}>
                    <BackButton onClick={onCloseButtonClick} />
                </div>
            }
            <div className={classes.header}>
                <Typography
                    noWrap
                    align="center"
                    variant="h3"
                    className={classes.headerText}
                    style={{
                        color: brandingAsync.result?.primaryColor && theme.palette.getContrastText(brandingAsync.result?.primaryColor),
                    }}
                >
                    <FormattedMessage
                        id={name ? `hello` : `join_your_class`}
                        values={{
                            name,
                        }}
                    />
                </Typography>
                <div
                    className={classes.headerBg}
                    style={{
                        background: brandingAsync.result?.primaryColor && brandingAsync.result?.primaryColor,
                    }}
                />
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
                <Container maxWidth={classType === ClassType.LIVE ? (isSmDown ? `sm` : `md`) : `xs`}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid
                                container
                                direction={isXsDown ? `column-reverse` : `row`}
                                justifyContent="center"
                                alignItems="center"
                                spacing={classType === ClassType.LIVE ? 4 : 0}
                            >
                                {classType !== ClassType.LIVE ? null :
                                    <Grid
                                        item
                                        xs={6}
                                        md={7}
                                    >
                                        <Box position="relative">
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
                                    </Grid>
                                }
                                {!isSmDown && classType !== ClassType.LIVE && (
                                    <Grid
                                        container
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <ClassTypeLogo />
                                        </Grid>
                                    </Grid>
                                )}
                                <Grid
                                    item
                                    xs={classType === ClassType.LIVE ? 6 : 10}
                                    md={classType === ClassType.LIVE ? 5 : undefined}
                                >
                                    <JoinRoomForm
                                        cameraPaused={cameraPaused}
                                        setCameraPaused={setCameraPaused}
                                        microphonePaused={microphonePaused}
                                        setMicrophonePaused={setMicrophonePaused}
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
        </div>
    );
}

function ClassTypeLogo (): JSX.Element {
    const { logo } = useStyles();
    const {
        classType,
        isTeacher,
        isReview,
    } = useSessionContext();
    const IMG_HEIGHT = `64px`;

    const getImgSrc = () => {
        switch (classType) {
        case ClassType.LIVE:
            return isTeacher ? KidsLoopLiveTeachers : KidsLoopLiveStudents;
        case ClassType.CLASSES:
            return KidsLoopClassTeachers;
        default:
            if (isReview) return KidsLoopReviewStudents;
            return KidsLoopStudyStudents;
        }
    };

    return (
        <img
            alt="KidsLoop Live"
            src={getImgSrc()}
            height={IMG_HEIGHT}
            className={logo}
        />
    );
}

const useStylesJoinRoomForm = makeStyles((theme) => createStyles({
    iconButton: {
        padding: theme.spacing(2.5),
        border: `1px solid ${theme.palette.grey[300]}`,
    },
    iconButtonPaused: {
        borderColor: `transparent`,
        backgroundColor: red[500],
        color: `white`,
        "&:hover": {
            backgroundColor: red[500],
        },
    },
}));

const JoinRoomForm: VoidFunctionComponent<{
    cameraPaused: boolean;
    setCameraPaused: Dispatch<SetStateAction<boolean>>;
    microphonePaused: boolean;
    setMicrophonePaused: Dispatch<SetStateAction<boolean>>;
}> = ({
    cameraPaused,
    setCameraPaused,
    microphonePaused,
    setMicrophonePaused,
}) => {
    const {
        classType,
        name,
        setName,
    } = useSessionContext();
    const classes = useStylesJoinRoomForm();
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);

    const [ user, setUser ] = useState<string>(``);
    const [ hasNameError, setHasNameError ] = useState(false);

    const camera = useCamera();
    const microphone = useMicrophone();

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    function join (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setHasNameError(!user);
        if (!name) { setName(user); }

        setHasJoinedClassroom(true);

        if(!cameraPaused) { camera.setSending.execute(true); }
        if(!microphonePaused) { microphone.setSending.execute(true); }
    }

    const nameHelperText = (
        <span style={{
            display: `flex`,
            alignItems: `center`,
        }}
        >
            <StyledIcon
                icon={<InfoCircleIcon />}
                size="small"
                color="#dc004e"
            />
            <Typography variant="caption">
                <FormattedMessage id="error_empty_name" />
            </Typography>
        </span>
    );

    return (
        <form onSubmit={join}>
            <Grid
                container
                direction="column"
                spacing={2}
            >
                {!isSmDown && classType === ClassType.LIVE && (
                    <Grid item>
                        <ClassTypeLogo />
                    </Grid>
                )}
                {!name &&
                <Grid
                    item
                    xs
                >
                    <StyledTextField
                        fullWidth
                        label={<FormattedMessage id="what_is_your_name" />}
                        value={user}
                        error={hasNameError}
                        helperText={nameHelperText}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </Grid>
                }
                <Grid
                    item
                    xs
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item>
                            <IconButton
                                className={clsx(classes.iconButton, {
                                    [classes.iconButtonPaused]: microphonePaused,
                                })}
                                onClick={() => setMicrophonePaused(x => !x)}
                            >
                                {!microphonePaused ? <MicFillIcon size="1.25em" /> : <MicDisabledIcon size="1.25em" />}
                            </IconButton>
                        </Grid>
                        {classType === ClassType.LIVE && (
                            <Grid item>
                                <IconButton
                                    classes={{
                                        root: clsx(classes.iconButton, {
                                            [classes.iconButtonPaused]: cameraPaused,
                                        }),
                                    }}
                                    onClick={() => setCameraPaused(x => !x)}
                                >
                                    {!cameraPaused ? <CameraVideoFillIcon size="1.25em" /> : <CameraDisabledIcon size="1.25em" />}
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid
                    item
                    xs
                >
                    <Box
                        my={1}
                        display="flex"
                        justifyContent="center"
                    >
                        <MediaDeviceSelect kind="audioinput" />
                    </Box>
                    {classType === ClassType.LIVE && (
                        <Box
                            my={1}
                            display="flex"
                            justifyContent="center"
                        >
                            <MediaDeviceSelect kind="videoinput" />
                        </Box>
                    )}
                </Grid>

                <Grid item>
                    <StyledButton
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
    );
};
