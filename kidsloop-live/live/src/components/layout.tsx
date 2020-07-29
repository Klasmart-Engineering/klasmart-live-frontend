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

import { Create as CreateIcon } from "@styled-icons/material-twotone/Create";
import { People as PeopleIcon } from "@styled-icons/material-twotone/People";
import { LibraryBooks as LessonPlanIcon } from "@styled-icons/material-twotone/LibraryBooks";
import { Forum as ChatIcon } from "@styled-icons/material-twotone/Forum";
import { Settings as SettingsIcon } from "@styled-icons/material-twotone/Settings";
import { Close as CloseIcon } from "@styled-icons/material/Close";

import { webRTCContext, Camera, MyCamera, CameraControls, GlobalCameraControl } from "../webRTCState";
import { UserContext } from "../entry";
import { Session, Message, ContentIndexState, InteractiveModeState, StreamIdState } from "../room";
import Toolbar from "../whiteboard/components/Toolbar";
import PermissionControls from "../whiteboard/components/PermissionControls";
import { ControlButtons } from "../pages/teacher/controlButtons";
import Messages from "../messages";
import { SendMessage } from "../sendMessage";
import InviteButton from "./invite";
import { MaterialTypename } from "../lessonMaterialContext";

export const DRAWER_WIDTH = 380;

const TABS = [
    { icon: <PeopleIcon role="img" size="1.5rem" />, title: "title_participants", userType: 2 },
    { icon: <LessonPlanIcon role="img" size="1.5rem" />, title: "title_lesson_plan", userType: 0 },
    { icon: <ChatIcon role="img" size="1.5rem" />, title: "title_chat", userType: 2 },
    { icon: <CreateIcon role="img" size="1.5rem" />, title: "title_whiteboard", userType: 2 },
    { icon: <SettingsIcon role="img" size="1.5rem" />, title: "title_settings", userType: 0 },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        active: {
            backgroundColor: "#0E78D5",
            width: "0.25rem",
            borderRadius: "0.25rem 0 0 0.25rem",
        },
        bottomNav: {
            width: "100%",
            position: "fixed",
            bottom: 0,
            zIndex: 999,
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
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.leavingScreen,
                easing: theme.transitions.easing.sharp,
            }),
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
            width: "100%",
            position: "fixed",
            bottom: 48,
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
}

function TabPanel(props: TabPanelProps) {
    const { contentIndexState, handleOpenDrawer, index, tab, value, ...other } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

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
                        <FormattedMessage id={tab.title} />
                    </Typography>
                    <IconButton aria-label="minimize drawer" onClick={() => handleOpenDrawer(false)}>
                        <CloseIcon size="1.25rem" />
                    </IconButton>
                </Grid>
                <Divider />
                <TabInnerContent contentIndexState={contentIndexState} title={tab.title} />
            </div>
        </>
    );
}

function TabInnerContent({ contentIndexState, title }: { contentIndexState?: ContentIndexState, title: string }) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { sessionId, materials, teacher } = useContext(UserContext);
    const { name } = useContext(UserContext);

    switch (title) {
        case "title_participants":
            const users = useContext(UsersContext);
            const webrtc = useContext(webRTCContext);
            return (
                <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.scrollContainer}>
                    {teacher ? <>
                        <InviteButton />
                        <GlobalCameraControl />
                        <Grid item xs={12}><Divider /></Grid>
                    </> : null}
                    {[...users.entries()].map(([id, session]) => (
                        <Grid key={id} container justify="flex-start" item xs={6} md={12}>
                            <Grid container alignItems="center" spacing={isSmDown ? 0 : 2} item xs={12}>
                                <Grid item xs={12} md={5}>
                                    <Grid container direction="row" justify="space-between">
                                        <Grid item xs={12}>
                                            {id === sessionId ?
                                                <MyCamera /> :
                                                <Camera
                                                    controls
                                                    mediaStream={webrtc.getCameraStream(id)}
                                                    square
                                                />
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <Tooltip placement="left" title={id === sessionId ? name || "" : session.name || ""}>
                                        <Typography variant={isSmDown ? "caption" : "body2"} align="left" noWrap>
                                            {id === sessionId ? "You" : session.name}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid container justify="space-evenly" item xs={6} md={3}>
                                    <CameraControls global={teacher} sessionId={id} />
                                    {teacher && id !== sessionId ? <PermissionControls otherUserId={session.id} /> : <></>}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {/* TODO: On mobile, Divider is not visible */}
                                <Divider orientation={isSmDown ? "vertical" : "horizontal"} />
                            </Grid>
                        </Grid>
                    ))}
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
            return (<Typography>Item <FormattedMessage id={title} /></Typography>);
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
    users: Map<string, Session>;
    messages: Map<string, Message>;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export default function Layout(props: Props): JSX.Element {
    const { children, isTeacher, users, messages, openDrawer, handleOpenDrawer, contentIndexState, interactiveModeState, streamIdState } = props;
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
        >
            <Grid item xs={12}>
                <Container
                    disableGutters
                    maxWidth={"xl"}
                >
                    <div className={classes.container}>
                        <main
                            id="iframe-container"
                            className={classes.content}
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
                                            <ControlButtons
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
                                                TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} contentIndexState={contentIndexState} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value} />) :
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
                                    <Grid item xs={12} style={{ backgroundColor: "#FFF" }}>
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
                    <ControlButtons
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
