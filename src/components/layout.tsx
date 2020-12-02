/* eslint-disable no-case-declarations */
import React, { useState, createContext, useContext } from "react";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
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
import Collapse from "@material-ui/core/Collapse";
import Skeleton from "@material-ui/lab/Skeleton";
import Hidden from "@material-ui/core/Hidden";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";

import { Create as CreateIcon } from "@styled-icons/material-twotone/Create";
import { People as PeopleIcon } from "@styled-icons/material-twotone/People";
import { LibraryBooks as LessonPlanIcon } from "@styled-icons/material-twotone/LibraryBooks";
import { Forum as ChatIcon } from "@styled-icons/material-twotone/Forum";
import { Settings as SettingsIcon } from "@styled-icons/material-twotone/Settings";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Grid as GridIcon } from "@styled-icons/evaicons-solid/Grid";
import { ViewList as ListIcon } from "@styled-icons/material/ViewList";
import { Share as ShareIcon } from "@styled-icons/material/Share";

import { Camera, GlobalCameraControl } from "../webRTCState";
import { UserContext } from "../entry";
import { Session, Message, ContentIndexState, InteractiveModeState, StreamIdState, RoomContext } from "../pages/room/room";
import Toolbar from "../whiteboard/components/Toolbar";
import ModeControls from "../pages/teacher/modeControls";
import { SendMessage } from "../sendMessage";
import InviteButton from "./invite";
import { MaterialTypename } from "../lessonMaterialContext";
import Lightswitch from "./lightswitch";
import LanguageSelect from "./languageSelect";
import MoreControls from "./moreControls";
import CenterAlignChildren from "./centerAlignChildren";
import { bottomNav, modePanel } from "../utils/layerValues";
import { WebRTCSFUContext } from "../webrtc/sfu";

export const DRAWER_WIDTH = 380;

const TABS = [
    { icon: <PeopleIcon role="img" size="1.5rem" />, title: "title_participants", userType: 2 },
    { icon: <LessonPlanIcon role="img" size="1.5rem" />, title: "title_lesson_plan", userType: 0 },
    { icon: <ChatIcon role="img" size="1.5rem" />, title: "title_chat", userType: 2 },
    { icon: <CreateIcon role="img" size="1.5rem" />, title: "title_whiteboard", userType: 2 },
    { icon: <SettingsIcon role="img" size="1.5rem" />, title: "title_settings", userType: 0 },
];

const OPTION_NUMCOL = [
    { id: "option-numcol-2", title: <FormattedMessage id="two_columns" />, value: 2 },
    { id: "option-numcol-4", title: <FormattedMessage id="four_columns" />, value: 4 },
    { id: "option-numcol-6", title: <FormattedMessage id="six_columns" />, value: 6 },
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        active: {
            backgroundColor: "#0E78D5",
            width: "0.25rem",
            borderRadius: "0.25rem 0 0 0.25rem",
        },
        bottomNav: {
            width: "100vw",
            position: "fixed",
            bottom: 0,
            zIndex: bottomNav,
        },
        layout: {
            flex: 1,
        },
        root: {
            padding: theme.spacing(2, 2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1, 1),
            },
        },
        container: {
            display: "flex",
            height: "100%",
        },
        content: {
            flexGrow: 1,
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
            }),
            height: "100vh",
            maxheight: "100vh",
            [theme.breakpoints.down("sm")]: {
                height: `calc(100vh - ${theme.spacing(16)}px)`,
            },
        },
        contentShift: {
            marginRight: 0,
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.enteringScreen,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        drawer: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
            whiteSpace: "nowrap",
        },
        drawerOpen: {
            width: DRAWER_WIDTH,
            overflowX: "hidden",
            overflowY: "auto",
            transition: theme.transitions.create("width", {
                duration: theme.transitions.duration.enteringScreen,
                easing: theme.transitions.easing.sharp,
            }),
        },
        drawerClose: {
            overflowX: "hidden",
            overflowY: "auto",
            width: theme.spacing(7),
            transition: theme.transitions.create("width", {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
            }),
        },
        scrollContainer: {
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
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
        toolbarContainer: {
            zIndex: modePanel,
            width: "100%",
            position: "fixed",
            bottom: 48,
        },
        scrollCameraContainer: {
            flexGrow: 1,
            overflow: "hidden auto",
        },
    }),
);

const MessageContext = createContext(new Map<string, Message>());
const UsersContext = createContext(new Map<string, Session>());

interface TabPanelProps {
    contentIndexState?: ContentIndexState;
    handleOpenDrawer: (open?: boolean) => void;
    index: any;
    tab: { icon: JSX.Element, title: string };
    value: any;
    numColState?: number;
    setNumColState?: React.Dispatch<React.SetStateAction<number>>;
}

function TabPanel(props: TabPanelProps) {
    const { contentIndexState, handleOpenDrawer, index, tab, value, numColState, setNumColState, ...other } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { teacher } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => { setAnchorEl(null); }
    const open = Boolean(anchorEl);
    const id = open ? "share-popover" : undefined;

    return (
        <>
            <div
                aria-labelledby={`vertical-tab-${index}`}
                id={`vertical-tabpanel-${index}`}
                hidden={value !== index}
                role="tabpanel"
                {...other}
            >
                <Grid item className={classes.toolbar}>
                    <Typography variant="body1" style={{ fontSize: isSmDown ? "unset" : "1rem" }}>
                        <CenterAlignChildren>
                            <FormattedMessage id={tab.title} />
                            {teacher && tab.title === "title_participants" ?
                                <IconButton aria-label="share popover" onClick={handleClick}>
                                    <ShareIcon size="1rem" />
                                </IconButton> : null
                            }
                        </CenterAlignChildren>
                    </Typography>
                    <IconButton aria-label="minimize drawer" onClick={() => handleOpenDrawer(false)}>
                        {/* <StyledIcon icon={<CloseIcon />} size="medium" /> */}
                        <CloseIcon size="1.25rem" />
                    </IconButton>
                </Grid>
                <Divider />
                <TabInnerContent contentIndexState={contentIndexState} title={tab.title} numColState={numColState} setNumColState={setNumColState} />
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

function ToggleCameraViewMode({ isSmDown, setGridMode }: {
    isSmDown: boolean,
    setGridMode: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <Grid container justify="flex-end" item xs={12}>
            <IconButton aria-label="switch grid view" size="small" onClick={() => setGridMode(true)}>
                <GridIcon role="img" size={isSmDown ? "1rem" : "1.25rem"} />
            </IconButton>
            <IconButton aria-label="switch list view" size="small" onClick={() => setGridMode(false)}>
                <ListIcon role="img" size={isSmDown ? "1rem" : "1.25rem"} />
            </IconButton>
        </Grid>
    )
}

function CameraInterface({ isTeacher, isSmDown, gridMode, sessionId, id, session, mediaStream }: {
    isTeacher?: boolean,
    isSmDown: boolean,
    gridMode: boolean,
    sessionId: string,
    id: string,
    session: Session,
    mediaStream: MediaStream | undefined,
}) {
    const isSelf = id === sessionId;
    let idx = 1;
    // if (isTeacher) { idx = -1; } // TODO: After server side work, user will know who is the host teacher
    if (isSelf) { idx = 0; }

    return (
        <Grid id={`participant:${id}`} item xs={6} md={12} style={{ order: idx }}>
            <Grid container alignItems="center" spacing={isSmDown || gridMode ? 0 : 1} item xs={12}>
                <Grid item xs={gridMode ? 12 : 6}>
                    <Camera
                        muted={isSelf}
                        session={session}
                        controls={true}
                        miniMode={!gridMode}
                        mediaStream={mediaStream}
                        square
                    />
                </Grid>
                {!gridMode && !isSmDown ?
                    <Grid container direction="row" alignItems="center" item xs={6}>
                        <Grid item xs={9}>
                            <Tooltip placement="left" title={session.name ? session.name : ""}>
                                <Typography variant="body2" align="left" noWrap>
                                    {isSelf ? "You" : session.name}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        {isTeacher && (id !== sessionId) ?
                            <Grid item xs={3}>
                                <MoreControls session={session} />
                            </Grid> : null}
                    </Grid> : null}
            </Grid>
            <Grid item xs={12}><Divider /></Grid>
        </Grid>
    )
}

function TabInnerContent({ contentIndexState, title, numColState, setNumColState }: {
    contentIndexState?: ContentIndexState,
    title: string,
    numColState?: number,
    setNumColState?: React.Dispatch<React.SetStateAction<number>>,
}) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { camera, sessionId, materials, teacher } = useContext(UserContext);
    const isMdUpTeacher = teacher && !isSmDown;

    const changeNumColState = (num: number) => {
        if (!setNumColState) { return; }
        setNumColState(num);
    };

    const [gridMode, setGridMode] = useState(true)

    switch (title) {
        case "title_participants":
            const webrtc = WebRTCSFUContext.Consume()
            const users = useContext(UsersContext);
            // TODO: Improve performance as order in flexbox instead of .filter()
            const userEntries = [...users.entries()];
            const selfUser = userEntries.filter(([id]) => id === sessionId);
            const otherUsers = userEntries.filter(([id]) => id !== sessionId);

            return (
                <Grid container direction="row" justify="flex-start" alignItems="center" style={{ flex: 1 }}>
                    {isMdUpTeacher ? <>
                        {selfUser.map(([id, session]) =>
                            <Camera
                                key={id}
                                muted={true}
                                session={session}
                                controls={true}
                                mediaStream={camera !== null ? camera : undefined}
                                square
                            />
                        )}
                    </> : null}
                    {teacher ? <GlobalCameraControl /> : null}
                    {isSmDown ? null : <ToggleCameraViewMode isSmDown={isSmDown} setGridMode={setGridMode} />}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignContent="flex-start"
                        item
                        xs={12}
                        className={classes.scrollCameraContainer}
                        style={isSmDown ? { maxHeight: `calc(100vh - ${theme.spacing(65)}px)` } : {
                            height: teacher ? `calc(100vh - ${theme.spacing(60)}px)` : `calc(100vh - ${theme.spacing(9)}px)`, // Because student side has no <InviteButton /> and <GlobalCameraControl />
                        }}
                    >
                        <Grid id={"participant-listing"} item xs={12}><Divider /></Grid>
                        {isMdUpTeacher && otherUsers.length === 0 ?
                            <Typography style={{ color: "rgb(200,200,200)", padding: 4 }}>
                                <FormattedMessage id="no_participants" />
                            </Typography> : (isMdUpTeacher ?
                                otherUsers.map(([id, session]) =>
                                    <CameraInterface
                                        key={id}
                                        isTeacher={teacher}
                                        isSmDown={isSmDown}
                                        gridMode={gridMode}
                                        sessionId={sessionId}
                                        id={id}
                                        session={session}
                                        mediaStream={id === sessionId && camera !== null ?
                                            camera : webrtc.getCameraStream(id)
                                        }
                                    />) :
                                userEntries.map(([id, session]) => {
                                    return (
                                        <CameraInterface
                                            key={id}
                                            isSmDown={isSmDown}
                                            gridMode={gridMode}
                                            sessionId={sessionId}
                                            id={id}
                                            session={session}
                                            mediaStream={id === sessionId && camera !== null ?
                                                camera : webrtc.getCameraStream(id)
                                            }
                                        />
                                    )
                                })
                            )
                        }
                    </Grid>
                </Grid>
            );
        case "title_lesson_plan":
            if (contentIndexState) {
                const { contentIndex, setContentIndex } = contentIndexState;
                return (
                    <Grid item className={classes.scrollContainer}>
                        <Stepper
                            style={{ overflowX: "hidden", overflowY: "auto" }}
                            activeStep={contentIndex}
                            orientation="vertical"
                        >
                            {materials.map((material, index) => (
                                <Step
                                    key={`step-${material.name}`}
                                    onClick={() => setContentIndex(index)}
                                    disabled={false}
                                    className={classes.step}
                                >
                                    <StepLabel key={`label-${material.name}`}>{material.name}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                );
            }
            else {
                return (
                    <Typography>
                        <FormattedMessage id="error_unknown_error" />
                    </Typography>
                );
            }
        case "title_chat":
            const Messages = React.lazy(() => import("../messages"));
            const messages = useContext(MessageContext);

            return (
                <Grid
                    container
                    direction="column"
                    justify="flex-end"
                    style={{ overflow: "hidden" }}
                >
                    <React.Suspense fallback={<Typography variant="body2"><Skeleton variant="text" /></Typography>}>
                        <Grid item className={clsx(classes.scrollContainer, classes.messageContainer)}>
                            <Messages messages={messages} />
                        </Grid>
                    </React.Suspense>
                    <Grid container alignItems="flex-end" item style={{ width: "100%", position: "absolute", bottom: 0 }}>
                        <SendMessage />
                    </Grid>
                </Grid>
            );
        case "title_whiteboard":
            return (<Toolbar />);
        case "title_settings":
            return (
                <Grid
                    container
                    direction="column"
                    style={{ overflow: "hidden", padding: theme.spacing(2) }}
                >
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
                    <div className={classes.toolbar} />
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="num_views_per_row" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl style={{ width: "100%" }}>
                            <Select
                                value={numColState ? numColState : 2}
                                onChange={(e) => changeNumColState(Number(e.target.value))}
                            >
                                {OPTION_NUMCOL.map((option) => <MenuItem key={option.id} value={option.value}>{option.title}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            );
        default:
            return (<Typography>Item <FormattedMessage id={title} /></Typography>);
    }
}

interface StyledTabProps {
    children: React.ReactElement;
    className: string;
    handlers: {
        handleOpenDrawer: (open?: boolean) => void;
        setValue: React.Dispatch<React.SetStateAction<number>>;
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
                handlers.handleOpenDrawer(true);
                handlers.setValue(value);
            }}
            value={value}
            style={{ backgroundColor: "#FFF", opacity: 1 }}
            {...a11yProps}
        />
    );
}

interface Props {
    children?: React.ReactNode;
    isTeacher: boolean;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}

export default function Layout(props: Props): JSX.Element {
    const { users, messages } = RoomContext.Consume()
    const { children, isTeacher, openDrawer, handleOpenDrawer, contentIndexState, interactiveModeState, streamIdState, numColState, setNumColState } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { sessionId, materials } = useContext(UserContext);

    const [key, setKey] = useState(Math.random())
    const { streamId, setStreamId } = streamIdState;
    const { contentIndex, setContentIndex } = contentIndexState;

    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [value, setValue] = useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (<>
        <Grid
            container
            direction="column"
            justify="space-between"
            wrap="nowrap"
            className={classes.layout}
            style={{ backgroundColor: (material && material.__typename === MaterialTypename.Video) ? "#000" : "" }}
        >
            <Grid item xs={12}>
                <Container
                    disableGutters
                    maxWidth={"xl"}
                >
                    <div className={classes.container}>
                        <main
                            id="main-container"
                            className={classes.content}
                            style={{
                                padding: (material && material.__typename === MaterialTypename.Video)
                                    ? theme.spacing(1) : theme.spacing(3)
                            }}
                            key={key}
                        >
                            {children || null}
                        </main>
                        <Drawer
                            anchor="right"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: openDrawer,
                                [classes.drawerClose]: !openDrawer,
                            })}
                            classes={{
                                paper: clsx({
                                    [classes.drawerOpen]: openDrawer,
                                    [classes.drawerClose]: !openDrawer,
                                }),
                            }}
                            hidden={isSmDown}
                            variant="permanent"
                        >
                            <Grid container direction="row" style={{ flexGrow: 1, overflow: "hidden" }}>
                                <Grid item xs={!openDrawer ? 12 : 2} style={{ flexGrow: 1 }}>
                                    <Grid
                                        container
                                        direction="column"
                                        justify="space-between"
                                        style={{ borderRight: `1px solid ${theme.palette.divider}`, height: "100%" }}
                                    >
                                        <Grid item>
                                            <Tabs
                                                aria-label="vertical tabs"
                                                orientation="vertical"
                                                variant="fullWidth"
                                                value={value}
                                                onChange={handleChange}
                                                className={classes.tabs}
                                                classes={{
                                                    indicator: classes.tabIndicator
                                                }}
                                            >
                                                {isTeacher ?
                                                    TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setValue }} value={index}>{tab.icon}</StyledTab>) :
                                                    TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setValue }} value={index}>{tab.icon}</StyledTab>)
                                                }
                                            </Tabs>
                                        </Grid>
                                        <Grid item hidden={!isTeacher}>
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
                                                setKey={setKey}
                                                orientation="vertical"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={10} hidden={!openDrawer} style={{ flexGrow: 1 }}>
                                    <UsersContext.Provider value={users}>
                                        <MessageContext.Provider value={messages}>
                                            {isTeacher ?
                                                TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} contentIndexState={contentIndexState} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value} numColState={numColState} setNumColState={setNumColState} />) :
                                                TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value} />)
                                            }
                                        </MessageContext.Provider>
                                    </UsersContext.Provider>
                                </Grid>
                            </Grid>
                        </Drawer>
                        <Hidden mdUp>
                            <Grid item xs={12} className={classes.bottomNav}>
                                <Tabs
                                    aria-label="horizontal tabs"
                                    orientation="horizontal"
                                    variant="fullWidth"
                                    value={value}
                                    onChange={handleChange}
                                    // className={clsx(classes.tabs)}
                                    classes={{
                                        indicator: classes.tabIndicator
                                    }}
                                    centered
                                >
                                    {isTeacher ?
                                        TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab mobile key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setValue }} value={index}>{tab.icon}</StyledTab>) :
                                        TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab mobile key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setValue }} value={index}>{tab.icon}</StyledTab>)
                                    }
                                </Tabs>
                                <Collapse in={openDrawer}>
                                    <Grid item xs={12} style={{ backgroundColor: theme.palette.type === "light" ? "#FFF" : "#030D1C" }}>
                                        <UsersContext.Provider value={users}>
                                            <MessageContext.Provider value={messages}>
                                                {isTeacher ?
                                                    TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} contentIndexState={contentIndexState} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value} />) :
                                                    TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value} />)
                                                }
                                            </MessageContext.Provider>
                                        </UsersContext.Provider>
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Hidden>
                    </div>
                </Container>
            </Grid>
        </Grid>
        {isTeacher ?
            <Hidden mdUp>
                <Grid className={classes.toolbarContainer}>
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
                        setKey={setKey}
                        orientation="horizontal"
                    />
                </Grid>
            </Hidden> : null}
    </>);
}
