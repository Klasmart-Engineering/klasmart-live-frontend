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
import Skeleton from "@material-ui/lab/Skeleton";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import PeopleAltTwoToneIcon from "@material-ui/icons/PeopleAltTwoTone";
import LibraryBooksTwoToneIcon from "@material-ui/icons/LibraryBooksTwoTone";
import ForumTwoToneIcon from "@material-ui/icons/ForumTwoTone";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";

import Hidden from "@material-ui/core/Hidden";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import VideocamOffTwoToneIcon from "@material-ui/icons/VideocamOffTwoTone";
import MicOffTwoToneIcon from "@material-ui/icons/MicOffTwoTone";

import { webRTCContext, Camera, MyCamera, CameraControls, GlobalCameraControl } from "../webRTCState";
import { UserContext } from "../entry";
import { Session, Message, ContentIndexState, InteractiveModeState, StreamIdState } from "../room";
import Toolbar from "../whiteboard/components/Toolbar";
import { ControlButtons } from "../pages/teacher/controlButtons";
import Messages from "../messages";
import { SendMessage } from "../sendMessage";

export const DRAWER_WIDTH = 380;

const TABS = [
    { icon: <PeopleAltTwoToneIcon/>, title: "Participants", userType: 2 },
    { icon: <LibraryBooksTwoToneIcon/>, title: "Lesson Plan", userType: 0 },
    { icon: <ForumTwoToneIcon/>, title: "Chat", userType: 2 },
    { icon: <CreateTwoToneIcon/>, title: "Whiteboard", userType: 2 },
    { icon: <SettingsTwoToneIcon/>, title: "Settings", userType: 0 },
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
                    <Typography variant="body1">{tab.title}</Typography>
                    <IconButton aria-label="minimize drawer" onClick={() => handleOpenDrawer(false)}>
                        <CloseTwoToneIcon />
                    </IconButton>
                </Grid>
                <Divider />
                <TabInnerContent contentIndexState={contentIndexState} title={tab.title} />
            </div>
        </>
    );
}

function TabInnerContent({ contentIndexState, title }: {contentIndexState?: ContentIndexState, title: string}) {
    const classes = useStyles();
    const {sessionId, materials, teacher} = useContext(UserContext);
    const {name} = useContext(UserContext);

    switch(title) {
    case "Participants":
        const users = useContext(UsersContext);
        const webrtc = useContext(webRTCContext);
        return (
            <Grid container direction="column" justify="flex-start" alignItems="center">
                { teacher ? <GlobalCameraControl /> : null }
                {
                    [...users.entries()].map(([id,session]) => (
                        <React.Fragment key={id}>
                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                <Grid item xs={12}><Divider /></Grid>
                            </Grid>
                            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                                <Grid item xs={5}>
                                    <Grid container direction="row" justify="space-between">
                                        <Grid item xs={12}>
                                            { id === sessionId ? 
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
                                <Grid item xs={4}>
                                    <Tooltip placement="left" title={id === sessionId ? name || "" : session.name || ""}>
                                        <Typography variant="body2" align="left" noWrap>
                                            {id === sessionId ? "You" : session.name}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <CameraControls global={teacher} sessionId={id} />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                <Grid item xs={12}><Divider /></Grid>
                            </Grid>
                        </React.Fragment>
                    ))
                }
            </Grid>
        );
    case "Lesson Plan":
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
    case "Chat":
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
                <Grid item alignItems="flex-end" style={{ position: "absolute", bottom: 0 }}>
                    <SendMessage />
                </Grid>
            </Grid>
        );
    case "Whiteboard":
        return (<Toolbar />);
    case "Settings":
        return (<Typography>Item {title}</Typography>);
    default:
        return (<Typography>Item {title}</Typography>);
    }
}

interface StyledTabProps {
    children: React.ReactElement;
    className: string;
    handlers: {
        handleOpenDrawer: (open?: boolean) => void;
        setValue: React.Dispatch<React.SetStateAction<number>>;
    }
    value: number;
    title: string;
}

function StyledTab(props: StyledTabProps) {
    const classes = useStyles();
    const {children, className, handlers, value, title} = props;

    const a11yProps = () => {
        return {
            id: `vertical-tab-${title}`,
            "aria-controls": `vertical-tabpanel-${title}`,
        };
    };

    return (
        <Tab 
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            className={className}
            label={<Tooltip arrow placement="left" title={title}>{children}</Tooltip>} 
            onClick={() => {
                handlers.handleOpenDrawer(true);
                handlers.setValue(value);
            }} 
            value={value}
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

    const { streamId, setStreamId } = streamIdState;
    const { contentIndex, setContentIndex } = contentIndexState;

    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [value, setValue] = useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
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
                        >
                            { children || null }
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
                                                { isTeacher ? 
                                                    TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{handleOpenDrawer, setValue}} value={index}>{tab.icon}</StyledTab>) :
                                                    TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{handleOpenDrawer, setValue}} value={index}>{tab.icon}</StyledTab>)
                                                }
                                            </Tabs>
                                        </Grid>
                                        <Grid item hidden={!isTeacher}>
                                            <ControlButtons 
                                                interactiveModeState={interactiveModeState}
                                                disablePresent={!(streamId || (material && material.video))}
                                                disableActivity={!(material && material.url)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={10} hidden={!openDrawer} style={{ flexGrow: 1 }}>
                                    <UsersContext.Provider value={users}>
                                        <MessageContext.Provider value={messages}>
                                            { isTeacher ? 
                                                TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} contentIndexState={contentIndexState} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value}/>) :
                                                TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={value}/>)
                                            }
                                        </MessageContext.Provider>
                                    </UsersContext.Provider>
                                </Grid>
                            </Grid>
                        </Drawer>
                        {/* <Hidden mdUp>
                            <BottomNavigation value={value} onChange={handleChange} className={classes.bottomNav}>
                                <BottomNavigationAction label="Recents" value={0} icon={<PeopleAltTwoToneIcon />} />
                                <BottomNavigationAction label="Favorites" value={1} icon={<LibraryBooksTwoToneIcon />} />
                                <BottomNavigationAction label="Nearby" value={2} icon={<ForumTwoToneIcon />} />
                                <BottomNavigationAction label="Folder" value={3} icon={<CreateTwoToneIcon />} />
                            </BottomNavigation>
                        </Hidden> */}
                    </div>
                </Container>
            </Grid>
        </Grid>
    );
}
