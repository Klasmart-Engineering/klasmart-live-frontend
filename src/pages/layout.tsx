/* eslint-disable no-case-declarations */
import React, { useState, createContext, useContext, useEffect, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useStore, useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Skeleton from "@material-ui/lab/Skeleton";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

import { People as PeopleIcon } from "@styled-icons/material-twotone/People";
import { LibraryBooks as LessonPlanIcon } from "@styled-icons/material-twotone/LibraryBooks";
import { Forum as ChatIcon } from "@styled-icons/material-twotone/Forum";
import { Settings as SettingsIcon } from "@styled-icons/material-twotone/Settings";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Share as ShareIcon } from "@styled-icons/material/Share";
import { ExpandLess as ArrowUpIcon } from "@styled-icons/material/ExpandLess";
import { ExpandMore as ArrowDownIcon } from "@styled-icons/material/ExpandMore";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
import { ExitToApp as ExitIcon } from "@styled-icons/material-twotone/ExitToApp";

import { Session, Message, InteractiveModeState, StreamIdState, RoomContext } from "./room/room";
import ModeControls from "./teacher/modeControls";
import GlobalControls from "./teacher/globalControls";
import StyledIcon from "../components/styled/icon";
import { SendMessage } from "../components/chat/sendMessage";
import { useSynchronizedState } from "../whiteboard/context-providers/SynchronizedStateProvider";
import WBToolbar from "../whiteboard/components/Toolbar";
import { MaterialTypename, LessonMaterial } from "../lessonMaterialContext";
import { WB_EXPAND_BUTTON, WB_TOOLBAR } from "../utils/layerValues";
import { WebRTCSFUContext } from "../webrtc/sfu";
import Camera from "../components/media/camera";
import InviteButton from "./teacher/invite";
import Lightswitch from "../components/lightswitch";
import LanguageSelect from "../components/languageSelect";
import CenterAlignChildren from "../components/centerAlignChildren";
import { State } from "../store/store";
import { useCameraContext } from "../components/media/useCameraContext";
import { ClassType } from "../store/actions";
import { setClassType } from "../store/reducers/session";
import {
    setDrawerOpen,
    setDrawerWidth,
    setColsCamera,
    setColsObserve,
    setContentIndex
} from "../store/reducers/control";
import { useUserContext } from "../context-provider/user-context";
import StyledButton from "../components/styled/button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const MessageContext = createContext(new Map<string, Message>());
const UsersContext = createContext(new Map<string, Session>());

enum UserType {
    TeacherOnly = 0,
    StudentOnly = 1,
    Both = 2
}

const TABS = [
    { icon: <PeopleIcon role="img" size="1.5rem" />, title: "title_participants", userType: 2, classType: ClassType.LIVE },
    { icon: <LessonPlanIcon role="img" size="1.5rem" />, title: "title_lesson_plan", userType: 0, classType: ClassType.LIVE },
    { icon: <ChatIcon role="img" size="1.5rem" />, title: "title_chat", userType: 2, classType: ClassType.LIVE },
    { icon: <SettingsIcon role="img" size="1.5rem" />, title: "title_settings", userType: 0, classType: ClassType.STUDY },
];

const OPTION_COLS_CAMERA = [
    { id: "option-cols-camera-2", title: <FormattedMessage id="two_columns" />, value: 2 },
    { id: "option-cols-camera-3", title: <FormattedMessage id="three_columns" />, value: 3 },
    // { id: "option-cols-camera-4", title: <FormattedMessage id="four_columns" />, value: 4 }, // Future feature
]

const OPTION_COLS_OBSERVE = [
    { id: "option-cols-observe-2", title: <FormattedMessage id="two_columns" />, value: 2 },
    { id: "option-cols-observe-4", title: <FormattedMessage id="four_columns" />, value: 4 },
    { id: "option-cols-observe-6", title: <FormattedMessage id="six_columns" />, value: 6 },
]

export const DRAWER_TOOLBAR_WIDTH = 64;
const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)
const MOBILE_WB_TOOLBAR_MAX_HEIGHT = 46; // 38 + 8(padding top)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2, 2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1, 1),
            },
        },
        drawerContentRoot: {
            flex: 1,
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: `calc(100vh - ${theme.spacing(6)}px)`,
        },
        messageContainer: {
            maxHeight: `calc(100vh - ${theme.spacing(12)}px)`,
        },
        step: {
            cursor: "pointer",
        },
        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            paddingLeft: theme.spacing(2),
        },
        tabIndicator: {
            backgroundColor: "#0E78D5",
            width: "0.25rem",
            borderRadius: "0.25rem 0 0 0.25rem",
            [theme.breakpoints.down("sm")]: {
                borderRadius: "0.25rem 0.25rem 0 0",
                height: "0.25rem",
            },
        },
        tabRoot: {
            minWidth: "auto",
            padding: 0,
            "&:hover": {
                color: "#0E78D5",
                opacity: 1,
                transform: "translateX(-2px)",
            },
            "&$tabSelected": {
                color: "#0E78D5",
                opacity: 1,
            },
            "&:focus": {
                color: "#0E78D5"
            },
            "-webkit-transition": "all .4s ease",
            transition: "all .4s ease",
        },
        tabSelected: {
            color: "#0E78D5",
            opacity: 1,
        },
        tabs: {
            height: "100%",
        },
        sendMessageContainer: {
            width: "100%",
            position: "absolute",
            bottom: 0,
        },
        scrollCameraContainer: {
            flexGrow: 1,
            overflow: "hidden auto",
        },
    }),
);

interface LayoutProps {
    children?: React.ReactNode;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export default function Layout(props: LayoutProps): JSX.Element {
    const { children, interactiveModeState, streamIdState } = props;
    const { materials } = useUserContext();

    const dispatch = useDispatch();
    const classType = useSelector((store: State) => store.session.classType);
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());
    const { streamId } = streamIdState;

    useEffect(() => {
        if (classType === ClassType.LIVE) {
            dispatch(setDrawerOpen(true));
        } else {
            dispatch(setDrawerOpen(false));
        }
    }, [])

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            wrap="nowrap"
            style={{ flexGrow: 1, overflow: "hidden" }}
        >
            <MainContainer classContent={children} materialKey={materialKey} interactiveModeState={interactiveModeState} />
            <DrawerContainer
                interactiveModeState={interactiveModeState}
                streamId={streamId}
                material={material}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
                setMaterialKey={setMaterialKey}
            />
        </Grid>
    )
}

function MainContainer({ classContent, materialKey, interactiveModeState }: {
    classContent?: React.ReactNode,
    materialKey: number,
    interactiveModeState: InteractiveModeState,
}) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);
    const { interactiveMode } = interactiveModeState;

    return (
        <Grid
            id="main-container"
            component="main"
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item xs={drawerOpen ? 9 : 12}
            key={materialKey}
            style={{
                padding: isSmDown ? theme.spacing(1) : theme.spacing(2),
                paddingRight: (isSmDown ? theme.spacing(1) : theme.spacing(2)) + DRAWER_TOOLBAR_WIDTH,
            }}
        >
            <Grid
                id="class-content-container"
                item xs={12}
                style={{
                    maxWidth: "100%",
                    height: `calc(100% - ${isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT}px)`,
                    maxHeight: `calc(100% - ${isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT}px)`,
                    overflow: "hidden",
                    overflowY: interactiveMode === 2 ? "auto" : "hidden" // For Observe mode
                }}
            >
                {classContent || null}
            </Grid>
            <WBToolbarOpener />
        </Grid>
    )
}

function WBToolbarOpener() {
    const TEACHER_FAB_WIDTH = 80;
    const TEACHER_FAB_HEIGHT = 18;

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { teacher, sessionId } = useUserContext();
    const { state: { display, permissions }, actions: { setDisplay, getPermissions, setPermissions } } = useSynchronizedState();
    const classType = useSelector((store: State) => store.session.classType);
    const enableWB = classType === ClassType.LIVE ? (!teacher ? display && permissions.allowCreateShapes : display) : true;
    const [open, setOpen] = useState(false);

    const handleOpenWBToolbar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        if (classType !== ClassType.LIVE) {
            setDisplay(true);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: true,
            };
            setPermissions(sessionId, newPermissions)
        }
    };
    const handleCloseWBToolbar = () => {
        setOpen(false);
        if (classType !== ClassType.LIVE) {
            setDisplay(false);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: false,
            };
            setPermissions(sessionId, newPermissions)
        }
    };
    return (
        <Grid item xs={12} style={{ position: "relative", height: isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT }}>
            {classType !== ClassType.LIVE || !teacher ? (
                <Fab
                    aria-label="student whiteboard toolbar opener"
                    disabled={!enableWB}
                    onClick={handleOpenWBToolbar}
                    size={isSmDown ? "small" : "large"}
                    color="primary"
                    style={{
                        display: open ? "none" : "flex",
                        zIndex: WB_EXPAND_BUTTON,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <StyledIcon icon={<WBIcon />} size={isSmDown ? "small" : "large"} color="white" />
                </Fab>
            ) : (
                    <Fab
                        aria-label="teacher whiteboard toolbar opener"
                        disabled={!enableWB}
                        variant="extended"
                        onClick={handleOpenWBToolbar}
                        size="small"
                        color="primary"
                        style={{
                            zIndex: WB_EXPAND_BUTTON,
                            display: open ? "none" : "flex",
                            width: TEACHER_FAB_WIDTH,
                            height: TEACHER_FAB_HEIGHT,
                            position: "absolute",
                            bottom: 0,
                            left: `calc(50% - ${TEACHER_FAB_WIDTH}px)`,
                        }}
                    >
                        <StyledIcon icon={<ArrowUpIcon />} size="medium" color="white" />
                    </Fab>
                )
            }
            <Paper
                aria-label="whiteboard toolbar"
                elevation={2}
                style={{
                    zIndex: WB_TOOLBAR,
                    display: open ? "flex" : "none",
                    padding: isSmDown ? theme.spacing(0.5) : theme.spacing(1),
                    width: "100%",
                    position: "absolute",
                    bottom: 0,
                    borderRadius: 32,
                    overflowY: "hidden",
                }}
            >
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item style={{ flex: 0 }}>
                        <IconButton
                            size={isSmDown ? "small" : "medium"}
                            style={{ backgroundColor: theme.palette.background.paper }}
                            onClick={handleCloseWBToolbar}
                        >
                            <StyledIcon icon={teacher ? <ArrowDownIcon /> : <CloseIcon />} size={isSmDown ? "small" : "large"} />
                        </IconButton>
                    </Grid>
                    <WBToolbar />
                </Grid>
            </Paper>
        </Grid>
    )
}

function DrawerContainer({ interactiveModeState, streamId, material, tabIndex, setTabIndex, setMaterialKey }: {
    interactiveModeState: InteractiveModeState,
    streamId: string | undefined,
    material: LessonMaterial | undefined,
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>,
    setMaterialKey: React.Dispatch<React.SetStateAction<number>>,
}) {
    const dispatch = useDispatch();
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);
    const classType = useSelector((state: State) => state.session.classType);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref || !ref.current) { return; }
        dispatch(setDrawerWidth(ref.current.offsetWidth));
    }, [ref.current]);

    if (classType === ClassType.LIVE) {
        const { teacher } = useUserContext();
        const { users, messages } = RoomContext.Consume()
        return (
            <Grid id="drawer-container" ref={ref} item xs={drawerOpen ? 3 : undefined} style={{ position: "relative" }}>
                <UsersContext.Provider value={users}>
                    <MessageContext.Provider value={messages}>
                        {teacher ?
                            TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={tabIndex} />) :
                            TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={tabIndex} />)
                        }
                    </MessageContext.Provider>
                </UsersContext.Provider>
                <DrawerToolbar isTeacher={teacher} interactiveModeState={interactiveModeState} streamId={streamId} material={material} tabIndex={tabIndex} setTabIndex={setTabIndex} setMaterialKey={setMaterialKey} />
            </Grid>
        )
    } else {
        const teacher = false;
        return (
            <Grid id="drawer-container" ref={ref} item xs={drawerOpen ? 3 : undefined} style={{ position: "relative" }}>
                {TABS.filter((t) => t.classType === ClassType.STUDY).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={tabIndex} />)}
                <DrawerToolbar isTeacher={teacher} interactiveModeState={interactiveModeState} streamId={streamId} material={material} tabIndex={tabIndex} setTabIndex={setTabIndex} setMaterialKey={setMaterialKey} />
            </Grid>
        )
    }
}

function DrawerToolbar({ isTeacher, interactiveModeState, streamId, material, tabIndex, setTabIndex, setMaterialKey }: {
    isTeacher: boolean,
    interactiveModeState: InteractiveModeState,
    streamId: string | undefined,
    material: LessonMaterial | undefined,
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>,
    setMaterialKey: React.Dispatch<React.SetStateAction<number>>,
}) {
    const classes = useStyles()
    const theme = useTheme();

    const dispatch = useDispatch();
    // const setDrawerOpen = (open: boolean) => { dispatch(setDrawerOpen(open)); }
    const classType = useSelector((state: State) => state.session.classType);

    const handleTabIndexChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Grid
            id="drawer-toolbar"
            container
            direction="column"
            justify="space-between"
            style={{
                position: "absolute",
                top: 0,
                left: -DRAWER_TOOLBAR_WIDTH,
                width: DRAWER_TOOLBAR_WIDTH,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`,
                borderRight: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Grid item>
                <Tabs
                    aria-label="drawer vertical tabs"
                    orientation="vertical"
                    value={tabIndex}
                    onChange={handleTabIndexChange}
                    className={classes.tabs}
                    classes={{
                        indicator: classes.tabIndicator
                    }}
                >
                    {classType === ClassType.STUDY ? (
                        TABS.filter((t) => t.classType === ClassType.STUDY).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>)
                    ) : isTeacher ?
                            TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>) :
                            TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ setDrawerOpen: (open: boolean) => dispatch(setDrawerOpen(open)), setTabIndex }} value={index}>{tab.icon}</StyledTab>)
                    }
                </Tabs>
            </Grid>
            {classType === ClassType.STUDY || !isTeacher ? null :
                <Grid item>
                    <ModeControls
                        interactiveModeState={interactiveModeState}
                        disablePresent={!(
                            streamId ||
                            (material && material.__typename === undefined && Boolean(material.video)) || //Enable for legacy video
                            (material && material.__typename !== MaterialTypename.Iframe) //Enable for Image, Audio, Video
                        )}
                        disableActivity={!(
                            !material ||
                            material.__typename === MaterialTypename.Iframe || //Enable for iframe
                            (material.__typename === undefined && !!material.url) //Enable for legacy iframe
                        )}
                        setKey={setMaterialKey}
                        orientation="vertical"
                    />
                </Grid>
            }
        </Grid>
    )
}

interface StyledTabProps {
    children: React.ReactElement;
    className: string;
    handlers: {
        setDrawerOpen: (open: boolean) => void;
        setTabIndex: React.Dispatch<React.SetStateAction<number>>;
    }
    mobile?: boolean;
    value: number;
    title: string;
}

function StyledTab(props: StyledTabProps) {
    const classes = useStyles();
    const { children, className, handlers, mobile, value, title } = props;

    const a11yProps = () => {
        return {
            id: `vertical-tab-${title}`,
            "aria-controls": `vertical-tabpanel-${title}`,
        };
    };

    return (
        <Tab
            classes={{ root: mobile ? "" : classes.tabRoot, selected: mobile ? "" : classes.tabSelected }}
            className={className}
            label={mobile ? children : <Tooltip arrow placement="left" title={<FormattedMessage id={title} />}>{children}</Tooltip>}
            onClick={() => {
                handlers.setDrawerOpen(true);
                handlers.setTabIndex(value);
            }}
            value={value}
            style={{ backgroundColor: "#FFF", opacity: 1 }}
            {...a11yProps}
        />
    );
}

function ParticipantCamera({ mediaStream, session, sessionId, id, gridMode }: {
    mediaStream: MediaStream | undefined,
    session: Session,
    sessionId: string,
    id: string,
    gridMode: boolean,
}) {
    const isMobileOnly = useSelector((store: State) => store.session.userAgent.isMobileOnly)
    const colsCamera = useSelector((store: State) => store.control.colsCamera)
    let xs: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined
    if (colsCamera === 3) { xs = 4 }
    else if (colsCamera === 4) { xs = 3 }
    else { xs = 6 }

    const isSelf = id === sessionId;
    let idx = 1;
    if (isSelf) { idx = 0; }

    return (
        <Grid id={`participant:${id}`} item xs={isMobileOnly ? 6 : xs} style={{ order: idx }}>
            <Camera
                mediaStream={mediaStream}
                session={session}
                muted={isSelf}
                controls={true}
                bottomControls={!gridMode}
                square
            />
        </Grid>
    )
}

function TabInnerContent({ title }: {
    title: string,
}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const classType = useSelector((state: State) => state.session.classType);
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

    const camera = useCameraContext();

    const { sessionId, materials, teacher } = useUserContext();
    const [gridMode, setGridMode] = useState(true)

    switch (title) {
        case "title_participants":
            const webrtc = WebRTCSFUContext.Consume()
            const users = useContext(UsersContext);
            // TODO: Improve performance as order in flexbox instead of .filter()
            const allUsers = [...users.entries()];
            const selfUser = allUsers.filter(([id]) => id === sessionId);
            const otherUsers = allUsers.filter(([id]) => id !== sessionId);

            return (
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    className={classes.drawerContentRoot}
                >
                    {teacher ? <>
                        {selfUser.map(([id, session]) =>
                            <Camera
                                key={id}
                                mediaStream={camera.stream}
                                session={session}
                                muted={true}
                                controls={true}
                                bottomControls={true}
                            />
                        )}
                        <GlobalControls />
                    </> : null}
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignContent="flex-start"
                        item
                        xs={12}
                        style={{
                            flexGrow: 1,
                            overflowY: "auto",
                            minHeight: 16,
                            // TODO: below
                            // height: teacher ? `calc(100vh - ${theme.spacing(60)}px)` : `calc(100vh - ${theme.spacing(9)}px)`,
                        }}
                    >
                        {teacher ? (otherUsers.length === 0 ?
                            <Typography style={{ color: "rgb(200,200,200)", padding: 4 }}><FormattedMessage id="no_participants" /></Typography> :
                            otherUsers.map(([id, session]) =>
                                <ParticipantCamera
                                    key={id}
                                    gridMode={gridMode}
                                    sessionId={sessionId}
                                    id={id}
                                    session={session}
                                    mediaStream={id === sessionId && camera.stream ? camera.stream : webrtc.getCameraStream(id)}
                                />
                            )) :
                            allUsers.map(([id, session]) =>
                                <ParticipantCamera
                                    key={id}
                                    gridMode={gridMode}
                                    sessionId={sessionId}
                                    id={id}
                                    session={session}
                                    mediaStream={id === sessionId && camera.stream ? camera.stream : webrtc.getCameraStream(id)}
                                />
                            )
                        }
                    </Grid>
                </Grid>
            );
        case "title_lesson_plan":
            return (
                <Grid item className={classes.drawerContentRoot}>
                    <Stepper
                        style={{ overflowX: "hidden", overflowY: "auto" }}
                        activeStep={contentIndex}
                        orientation="vertical"
                    >
                        {classType === ClassType.LIVE ?
                            materials.map((material, index) => (
                                <Step
                                    key={`step-${material.name}`}
                                    onClick={() => dispatch(setContentIndex(index))}
                                    disabled={false}
                                    className={classes.step}
                                >
                                    <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                                </Step>
                            )) :
                            materials
                                .filter(mat => mat.__typename !== undefined && mat.__typename !== MaterialTypename.Image)
                                .map((material, index) => (
                                    <Step
                                        key={`step-${material.name}`}
                                        onClick={() => dispatch(setContentIndex(index))}
                                        disabled={false}
                                        className={classes.step}
                                    >
                                        <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                                    </Step>
                                ))}
                    </Stepper>
                </Grid>
            );
        case "title_chat":
            const Messages = React.lazy(() => import("../components/chat/messages"));
            const messages = useContext(MessageContext);

            return (
                <Grid
                    container
                    direction="column"
                    justify="flex-end"
                    style={{ overflow: "hidden" }}
                >
                    <React.Suspense fallback={<Typography variant="body2"><Skeleton variant="text" /></Typography>}>
                        <Grid item className={clsx(classes.drawerContentRoot, classes.messageContainer)}>
                            <Messages messages={messages} />
                        </Grid>
                    </React.Suspense>
                    <Grid container alignItems="flex-end" item style={{ width: "100%", position: "absolute", bottom: 0 }}>
                        <SendMessage />
                    </Grid>
                </Grid>
            );
        case "title_settings":
            return <Settings />
        default:
            return (<Typography>Item <FormattedMessage id={title} /></Typography>);
    }
}

interface TabPanelProps {
    index: number;
    tab: { icon: JSX.Element, title: string };
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { index, tab, value, ...other } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { teacher } = useUserContext();

    const store = useStore();
    const dispatch = useDispatch();
    const isMobileOnly = useSelector((state: State) => state.session.userAgent.isMobileOnly);
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => { setAnchorEl(null); }
    const open = Boolean(anchorEl);
    const id = open ? "share-popover" : undefined;

    const isLocalFile = useMemo<boolean>(() => {
        return new URL(window.location.href).origin === 'file://';
    }, [window.location.href]);

    return (
        <>
            <div
                aria-labelledby={`vertical-tab-${index}`}
                id={`vertical-tabpanel-${index}`}
                hidden={!drawerOpen || (value !== index)}
                role="tabpanel"
                {...other}
            >
                <Grid item className={classes.toolbar}>
                    <Typography variant="body1" style={{ fontSize: isSmDown ? "unset" : "1rem" }}>
                        <CenterAlignChildren>
                            <FormattedMessage id={tab.title} />
                            {teacher && tab.title === "title_participants" && !isLocalFile ?
                                <IconButton aria-label="share popover" onClick={handleClick}>
                                    <ShareIcon size="1rem" />
                                </IconButton> : null
                            }
                        </CenterAlignChildren>
                    </Typography>
                    {isMobileOnly ? null :
                        <IconButton aria-label="minimize drawer" onClick={() => dispatch(setDrawerOpen(false))}>
                            <StyledIcon icon={<CloseIcon />} size="medium" color={"#000"} />
                        </IconButton>
                    }
                </Grid>
                <Divider />
                <TabInnerContent title={tab.title} />
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <InviteButton />
            </Popover>
        </>
    );
}

function Settings() {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const colsCamera = useSelector((state: State) => state.control.colsCamera);
    const colsObserve = useSelector((state: State) => state.control.colsObserve);
    const isMobileOnly = useSelector((store: State) => store.session.userAgent.isMobileOnly)

    const classType = useSelector((store: State) => store.session.classType)
    function toggleClassType() {
        classType === ClassType.LIVE
            ? dispatch(setClassType(ClassType.STUDY))
            : dispatch(setClassType(ClassType.LIVE));
    }

    const [openDialog, setOpenDialog] = useState(false);
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Grid
            container
            direction="column"
            style={{ overflow: "hidden", padding: theme.spacing(2) }}
        >
            {/* Toggle button for testing in dev environment */}
            {/* {new URL(window.location.href).hostname === "localhost" ? <button onClick={toggleClassType}>Toggle classType for Testing</button> : null} */}
            <Lightswitch type="text" />
            <Grid container direction="row" alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="body2">
                        <FormattedMessage id="language" />
                    </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "right" }}>
                    <LanguageSelect />
                </Grid>
            </Grid>
            {classType === ClassType.LIVE ? (<>
                {/* Mobile always display 2 Cameras per row */}
                {!isMobileOnly ? <>
                    <div className={classes.toolbar} />
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="cols_camera_per_row" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl style={{ width: "100%" }}>
                            <Select
                                value={colsCamera}
                                onChange={(e) => dispatch(setColsCamera(Number(e.target.value)))}
                            >
                                {OPTION_COLS_CAMERA.map((option) => <MenuItem key={option.id} value={option.value}>{option.title}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </> : null}
                <div className={classes.toolbar} />
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        <FormattedMessage id="cols_observe_per_row" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={{ width: "100%" }}>
                        <Select
                            value={colsObserve}
                            onChange={(e) => dispatch(setColsObserve(Number(e.target.value)))}
                        >
                            {OPTION_COLS_OBSERVE.map((option) => <MenuItem key={option.id} value={option.value}>{option.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <div className={classes.toolbar} />
                <Grid item xs={12}>
                    <StyledButton onClick={() => setOpenDialog(true)} style={{ backgroundColor: "#f50057" }} fullWidth>
                        End Class
                            <ExitIcon size="1rem" style={{ marginLeft: isSmDown ? 0 : 4 }} />
                    </StyledButton>
                </Grid>
            </>) : null}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="end-class-dialog-title"
                aria-describedby="end-class-dialog-description"
            >
                <DialogTitle id="end-class-dialog-title">{<FormattedMessage id="end_class_title" />}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="end-class-dialog-description">
                        This will end the live session for all users in the classroom.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        <FormattedMessage id="button_cancel" />
                    </Button>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        <FormattedMessage id="button_confirm" />
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
