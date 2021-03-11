/* eslint-disable no-case-declarations */
import React, { useState, createContext, useContext, useEffect } from "react";
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
import { Share as ShareIcon } from "@styled-icons/material/Share";

import { GlobalCameraControl } from "../webRTCState";
import { LocalSessionContext } from "../entry";
import { Session, Message, InteractiveModeState, StreamIdState, RoomContext } from "../pages/room/room";
import Toolbar from "../whiteboard/components/Toolbar";
import ModeControls from "../pages/teacher/modeControls";
import { SendMessage } from "../sendMessage";
import InviteButton from "./invite";
import { MaterialTypename } from "../lessonMaterialContext";
import Lightswitch from "./lightswitch";
import LanguageSelect from "./languageSelect";
import CenterAlignChildren from "./centerAlignChildren";
import { bottomNav, modePanel } from "../utils/layerValues";
import { WebRTCSFUContext } from "../webrtc/sfu";
import Camera, { getCameraOrder } from "../components/media/camera";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../store/store";
import { setContentIndex, setDrawerOpen } from "../store/reducers/control";

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
const SessionsContext = createContext(new Map<string, Session>());

interface TabPanelProps {
    index: any;
    tab: { icon: JSX.Element, title: string };
    value: any;
    numColState?: number;
    setNumColState?: React.Dispatch<React.SetStateAction<number>>;
}

function TabPanel(props: TabPanelProps) {
    const { index, tab, value, numColState, setNumColState, ...other } = props;
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { isTeacher } = useContext(LocalSessionContext);
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
                <Grid item xs={12} className={classes.toolbar}>
                    <Typography variant="body1" style={{ fontSize: isSmDown ? "unset" : "1rem" }}>
                        <CenterAlignChildren>
                            <FormattedMessage id={tab.title} />
                            {isTeacher && tab.title === "title_participants" ?
                                <IconButton aria-label="share popover" onClick={handleClick}>
                                    <ShareIcon size="1rem" />
                                </IconButton> : null
                            }
                        </CenterAlignChildren>
                    </Typography>
                    <IconButton aria-label="minimize drawer" onClick={() => dispatch(setDrawerOpen(false))}>
                        {/* <StyledIcon icon={<CloseIcon />} size="medium" /> */}
                        <CloseIcon size="1.25rem" />
                    </IconButton>
                </Grid>
                <Divider />
                <TabInnerContent title={tab.title} numColState={numColState} setNumColState={setNumColState} />
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
                {/* TODO: <StyledIcon icon={<InviteIcon />} size="medium" /> */}
                <InviteButton />
            </Popover>
        </>
    );
}

const MUTATION_SET_HOST = gql`
    mutation setHost($roomId: ID!, $hostId: ID!) {
        setHost(roomId: $roomId, hostId: $hostId)
    }
`;

function TabInnerContent({ title, numColState, setNumColState }: {
    title: string,
    numColState?: number,
    setNumColState?: React.Dispatch<React.SetStateAction<number>>,
}) {
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const { camera, roomId, sessionId: localSessionId, materials, isTeacher: isLocalUserTeacher } = useContext(LocalSessionContext);
    const sessions = useContext(SessionsContext);
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const colsCamera = useSelector((store: State) => store.control.colsCamera);
    const [hostMutation] = useMutation(MUTATION_SET_HOST);

    useEffect(() => {
        const teachers = [...sessions.values()].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        if (!host && teachers.length) {
            const hostId = teachers[0].id;
            hostMutation({ variables: { roomId, hostId } })
        }
    }, [sessions, sessions.size])

    // type GridItemXS = 3 | 4 | 6 | 12;
    // const [camGridItemXS, setCamGridItemXS] = useState<GridItemXS>(6);
    // useEffect(() => {
    //     if (1 <= colsCamera && colsCamera <= 4) {
    //         setCamGridItemXS((12 / colsCamera) as GridItemXS);
    //     } else {
    //         setCamGridItemXS(6);
    //     }
    // }, [camGridItemXS])

    const changeNumColState = (num: number) => {
        if (!setNumColState) { return; }
        setNumColState(num);
    };

    switch (title) {
        case "title_participants":
            const webrtc = WebRTCSFUContext.Consume()

            // TODO: Improve performance as order in flexbox instead of .filter()
            const localSession = sessions.get(localSessionId);
            const otherSessions = [...sessions.values()].filter(session => session.id !== localSessionId);

            return (
                <Grid container direction="row" justify="flex-start" alignItems="center" style={{ flex: 1 }}>
                    {localSession?.isTeacher && localSession?.isHost && <>
                        <Camera
                            session={localSession}
                            mediaStream={camera !== null ? camera : undefined}
                            muted
                            // GridProps - You can find related props by searching the keyword '...other' in camera.tsx

                            item xs={12}
                            style={{ padding: theme.spacing(0.5) }}
                        />
                        <GlobalCameraControl />
                    </>}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignContent="flex-start"
                        item
                        xs={12}
                        className={classes.scrollCameraContainer}
                        style={{
                            flexGrow: 1,
                            overflow: "hidden auto",
                            // Because student side has no <InviteButton /> and <GlobalCameraControl />
                            maxHeight: isSmDown ? `calc(100vh - ${theme.spacing(54)}px)` :
                                localSession?.isTeacher && localSession?.isHost ? `calc(100vh - ${theme.spacing(49)}px)` : `calc(100vh - ${theme.spacing(6)}px)`,
                        }}
                    >
                        {localSession && !(localSession?.isTeacher && localSession?.isHost) && (
                            <Camera
                                session={localSession}
                                mediaStream={camera !== null ? camera : undefined}
                                muted
                                square

                                // GridProps - You can find related props by searching the keyword '...other' in camera.tsx
                                item xs={isSmDown ? 3 : 12}
                                style={{
                                    padding: theme.spacing(0.5),
                                    order: getCameraOrder(localSession, true)
                                }}
                            />
                        )}
                        {isLocalUserTeacher && otherSessions.length === 0 ?
                            <Typography style={{ color: "rgb(200,200,200)", padding: 4 }}>
                                <FormattedMessage id="no_participants" />
                            </Typography> :
                            otherSessions.map(session => {
                                return (
                                    <Camera
                                        key={session.id}
                                        session={session}
                                        mediaStream={webrtc.getCameraStream(session.id)}
                                        square

                                        // GridProps - You can find related props by searching the keyword '...other' in camera.tsx
                                        item xs={isSmDown ? 3 : 12}
                                        // xs={camGridItemXS} // TODO (Isu): This is planned by design.
                                        style={{
                                            padding: theme.spacing(0.5),
                                            order: getCameraOrder(session, false)
                                        }}
                                    />
                                )
                            })
                        }
                    </Grid>
                </Grid>
            );
        case "title_lesson_plan":
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
                                onClick={() => dispatch(setContentIndex((index)))}
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
                            <FormattedMessage id="cols_observe_per_row" />
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
        setValue: React.Dispatch<React.SetStateAction<number>>;
    }
    mobile?: boolean;
    value: number;
    title: string;
}

function StyledTab(props: StyledTabProps) {
    const classes = useStyles();
    const dispatch = useDispatch();
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
                dispatch(setDrawerOpen(true));
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
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}

export default function Layout(props: Props): JSX.Element {
    const { sessions, messages } = RoomContext.Consume()
    const { materials, isTeacher, sessionId: localSessionId } = useContext(LocalSessionContext);
    const localSession = sessions.get(localSessionId);
    const isHostTeacher = localSession?.isTeacher && localSession?.isHost;

    const { children, interactiveModeState, streamIdState, numColState, setNumColState } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

    const [key, setKey] = useState(Math.random())
    const { streamId, setStreamId } = streamIdState;
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
                                padding: (material?.__typename === MaterialTypename.Video)
                                    ? theme.spacing(1) : theme.spacing(0)
                            }}
                            key={key}
                        >
                            {children || null}
                        </main>
                        <Drawer
                            anchor="right"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: drawerOpen,
                                [classes.drawerClose]: !drawerOpen,
                            })}
                            classes={{
                                paper: clsx({
                                    [classes.drawerOpen]: drawerOpen,
                                    [classes.drawerClose]: !drawerOpen,
                                }),
                            }}
                            hidden={isSmDown}
                            variant="permanent"
                        >
                            <Grid container direction="row" style={{ flexGrow: 1, overflow: "hidden" }}>
                                <Grid item xs={!drawerOpen ? 12 : 2} style={{ flexGrow: 1 }}>
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
                                                {isHostTeacher ?
                                                    TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ setValue }} value={index}>{tab.icon}</StyledTab>) :
                                                    TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ setValue }} value={index}>{tab.icon}</StyledTab>)
                                                }
                                            </Tabs>
                                        </Grid>
                                        <Grid item hidden={!isHostTeacher}>
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
                                <Grid item xs={10} hidden={!drawerOpen} style={{ flexGrow: 1 }}>
                                    <SessionsContext.Provider value={sessions}>
                                        <MessageContext.Provider value={messages}>
                                            {isTeacher ?
                                                TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={value} numColState={numColState} setNumColState={setNumColState} />) :
                                                TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={value} />)
                                            }
                                        </MessageContext.Provider>
                                    </SessionsContext.Provider>
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
                                        TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab mobile key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ setValue }} value={index}>{tab.icon}</StyledTab>) :
                                        TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab mobile key={`tab-button-${tab.title}`} className={index === value ? classes.tabSelected : ""} title={tab.title} handlers={{ setValue }} value={index}>{tab.icon}</StyledTab>)
                                    }
                                </Tabs>
                                <Collapse in={drawerOpen}>
                                    <Grid item xs={12} style={{ backgroundColor: theme.palette.type === "light" ? "#FFF" : "#030D1C" }}>
                                        <SessionsContext.Provider value={sessions}>
                                            <MessageContext.Provider value={messages}>
                                                {isTeacher ?
                                                    TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={value} />) :
                                                    TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} index={index} tab={tab} value={value} />)
                                                }
                                            </MessageContext.Provider>
                                        </SessionsContext.Provider>
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
