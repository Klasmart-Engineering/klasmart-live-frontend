/* eslint-disable react/no-multi-comp */
import { CameraPreview } from "./cameraPreview";
import ClassTypeLogo from "./classTypeLogo";
import { MicrophonePreview } from "./microphonePreview";
import KidsLoopLogoSvg from "@/assets/img/kidsloop.svg";
import Loading from "@/components/loading";
import {
    MediaDeviceSelect,
    STUDENT_PREFERED_VIDEO_FRAMERATE,
    STUDENT_PREFERED_VIDEO_HEIGHT,
    TEACHER_PREFERED_VIDEO_FRAMERATE,
    TEACHER_PREFERED_VIDEO_HEIGHT,
} from "@/components/mediaDeviceSelect";
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
import {
    getOrganizationBranding,
    removeKLLH5PStateStorage,
} from "@/utils/utils";
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
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `relative`,
            zIndex: 1,
        },
        rootTeacher: {
            "& $headerBg": {
                background: `linear-gradient(87deg, rgba(103,161,214,1) 0%, rgba(82,141,195,1) 100%)`,
            },
        },
        cameraPreview: {
            width: `100%`,
        },
        card: {
            borderRadius: 20,
            boxShadow: `0px 4px 8px 0px rgb(0 0 0 / 10%)`,
        },
        cardContent: {
            padding: `22px !important`,
            [theme.breakpoints.down(`sm`)]: {
                padding: `12px 14px !important`,
            },
        },
        header: {
            color: `#fff`,
            padding: `5rem 0 3rem 0`,
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 0),
            },
        },
        headerText: {
            fontWeight: theme.typography.fontWeightBold as number,
            [theme.breakpoints.down(`sm`)]: {
                fontSize: `1.6rem`,
            },
        },
        headerBg: {
            position: `fixed`,
            height: `620px`,
            width: `100%`,
            zIndex: -1,
            top: 0,
            left: 0,
            background: `linear-gradient(87deg, rgba(145,102,253,1) 0%, rgba(134,90,243,1) 100%)`,
            "&:after": {
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
        footer: {
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
        version: {
            position: `absolute`,
            bottom: 10,
            right: 20,
            color: theme.palette.grey[400],
            fontSize: `1rem`,
        },
    }));

    interface Props {
        enableCamera?: boolean;
        enableMicrophone?: boolean;
    }

export default function Join (props: Props): JSX.Element {
    const {
        enableCamera = false,
        enableMicrophone = true,
    } = props;
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
        type,
        isReview,
    } = useSessionContext();

    const brandingEndpoint = useHttpEndpoint(`user`);
    const brandingAsync = useAsync((id: string, endpoint: string) => getOrganizationBranding(id, endpoint), [ organizationId, brandingEndpoint ]);
    const logo = brandingAsync.result?.iconImageURL || KidsLoopLogoSvg;

    const setClassLeft = useSetRecoilState(classLeftState);
    const setClassEnded = useSetRecoilState(classEndedState);
    const setShowSelectAttendees = useSetRecoilState(showSelectAttendeesState);

    useEffect(() => {
        setClassEnded(false);
        setClassLeft(false);
        setShowSelectAttendees(classType === ClassType.CLASSES);

        Cookies.set(`roomUserId`, `${roomId}:${user_id}`); // Used to cache H5P answers (H5P-342)

        removeKLLH5PStateStorage();
    }, []);

    const [ cameraPaused, setCameraPaused ] = useState(false);
    const [ microphonePaused, setMicrophonePaused ] = useState(false);

    if (brandingAsync.loading) {
        return <Loading messageId="loading" />;
    }

    return (
        <div className={clsx(classes.root, {
            [classes.rootTeacher]: isTeacher,
        })}
        >
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
                <Container maxWidth={enableCamera ? (isSmDown ? `sm` : `md`) : `xs`}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <Grid
                                container
                                direction={isXsDown ? `column` : `row`}
                                justifyContent="center"
                                alignItems="center"
                                spacing={enableCamera ? 4 : 0}
                            >
                                {(isSmDown || !enableCamera) && (
                                    <Grid item >
                                        <ClassTypeLogo
                                            isTeacher={isTeacher}
                                            classType={type === ClassType.PREVIEW ? type : classType}
                                            isReview={isReview}
                                        />
                                    </Grid>
                                )}
                                {enableCamera && (
                                    <Grid
                                        item
                                        xs={12}
                                        md={7}
                                        className={classes.cameraPreview}
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
                                )}

                                <Grid
                                    item
                                    xs={enableCamera ? 6 : 10}
                                    md={enableCamera ?? 5}
                                >
                                    {!isSmDown && enableCamera && (
                                        <Box my={1}>
                                            <ClassTypeLogo
                                                isTeacher={isTeacher}
                                                classType={type === ClassType.PREVIEW ? type : classType}
                                                isReview={isReview}
                                            />
                                        </Box>
                                    )}
                                    {type === ClassType.PREVIEW ? (
                                        <JoinRoomFormPreview />
                                    ) : (
                                        <JoinRoomForm
                                            enableCamera={enableCamera}
                                            enableMicrophone={enableMicrophone}
                                            cameraPaused={cameraPaused}
                                            setCameraPaused={setCameraPaused}
                                            microphonePaused={microphonePaused}
                                            setMicrophonePaused={setMicrophonePaused}
                                        />
                                    )
                                    }
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <div className={classes.footer}>
                        <img
                            src={logo}
                            alt="Logo"
                        />
                    </div>
                </Container>
            </Grid>
        </div>
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
    enableCamera: boolean;
    enableMicrophone: boolean;
}> = ({
    cameraPaused,
    setCameraPaused,
    microphonePaused,
    setMicrophonePaused,
    enableCamera,
    enableMicrophone,
}) => {
    const {
        isTeacher,
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

    function join (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setHasNameError(!user);
        if (!name) { setName(user); }

        setHasJoinedClassroom(true);

        camera.setMaxFramerate(isTeacher ? TEACHER_PREFERED_VIDEO_FRAMERATE : STUDENT_PREFERED_VIDEO_FRAMERATE);
        camera.setMaxHeight(isTeacher ? TEACHER_PREFERED_VIDEO_HEIGHT : STUDENT_PREFERED_VIDEO_HEIGHT);
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
                {!name && (
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
                )}
                <Grid
                    item
                    xs
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                        wrap={`nowrap`}
                    >
                        <Grid
                            item
                        >
                            <IconButton
                                className={clsx(classes.iconButton, {
                                    [classes.iconButtonPaused]: microphonePaused,
                                })}
                                onClick={() => setMicrophonePaused(x => !x)}
                            >
                                {!microphonePaused ? <MicFillIcon size={theme.spacing(3)} /> : <MicDisabledIcon size={theme.spacing(3)} />}
                            </IconButton>
                        </Grid>
                        {enableCamera && (
                            <Grid item>
                                <IconButton
                                    classes={{
                                        root: clsx(classes.iconButton, {
                                            [classes.iconButtonPaused]: cameraPaused,
                                        }),
                                    }}
                                    onClick={() => setCameraPaused(x => !x)}
                                >
                                    {!cameraPaused ? <CameraVideoFillIcon size={theme.spacing(3)} /> : <CameraDisabledIcon size={theme.spacing(3)} />}
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid
                    item
                    xs
                >
                    {enableMicrophone && (
                        <Box
                            my={1}
                            display="flex"
                            justifyContent="center"
                        >
                            <MediaDeviceSelect kind="audioinput" />
                        </Box>
                    )}
                    {enableCamera && (
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
                        <FormattedMessage id={`join_room`} />
                    </StyledButton>
                </Grid>
            </Grid>
        </form>
    );
};

const JoinRoomFormPreview = () => {
    const setHasJoinedClassroom = useSetRecoilState(hasJoinedClassroomState);

    function join (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setHasJoinedClassroom(true);
    }

    return (
        <form onSubmit={join}>
            <Grid
                container
                direction="column"
                spacing={2}
            >
                <Grid item>
                    <StyledButton
                        fullWidth
                        type="submit"
                        size="large"
                    >
                        <FormattedMessage id="classtype.preview.live" />
                    </StyledButton>
                </Grid>
            </Grid>
        </form>
    );
};
