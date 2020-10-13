/* eslint-disable no-case-declarations */
import React, { useState, createContext, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
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

import { Create as CreateIcon } from "@styled-icons/material-twotone/Create";
import { People as PeopleIcon } from "@styled-icons/material-twotone/People";
import { LibraryBooks as LessonPlanIcon } from "@styled-icons/material-twotone/LibraryBooks";
import { Forum as ChatIcon } from "@styled-icons/material-twotone/Forum";
import { Settings as SettingsIcon } from "@styled-icons/material-twotone/Settings";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { Grid as GridIcon } from "@styled-icons/evaicons-solid/Grid";
import { ViewList as ListIcon } from "@styled-icons/material/ViewList";
import { Share as ShareIcon } from "@styled-icons/material/Share";

import { UserContext } from "../entry";
import { Session, Message, ContentIndexState, InteractiveModeState, StreamIdState, RoomContext } from "./room/room";
import ModeControls from "./teacher/modeControls";
import GlobalControls from "./teacher/globalControls";
import StyledIcon from "../components/styled/icon";
import { SendMessage } from "../components/chat/sendMessage";
import Toolbar from "../whiteboard/components/Toolbar";
import { MaterialTypename } from "../lessonMaterialContext";
import { bottomNav, modePanel } from "../utils/layerValues";
import { WebRTCSFUContext } from "../webrtc/sfu";
import Camera from "../components/media/camera";
import InviteButton from "./teacher/invite";
import Lightswitch from "../components/lightswitch";
import LanguageSelect from "../components/languageSelect";
import CenterAlignChildren from "../components/centerAlignChildren";
import { State } from "../store/store";

const MessageContext = createContext(new Map<string, Message>());
const UsersContext = createContext(new Map<string, Session>());

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
            height: "100%",
            maxheight: "100%",
        },
        contentShift: {
            marginRight: 0,
            transition: theme.transitions.create("margin", {
                duration: theme.transitions.duration.enteringScreen,
                easing: theme.transitions.easing.easeOut,
            }),
        },
        drawer: {
            flexShrink: 0,
            whiteSpace: "nowrap",
        },
        drawerOpen: {
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
            maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
        },
        messageContainer: {
            maxHeight: `calc(100% - ${theme.spacing(12)}px)`,
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

interface LayoutProps {
    children?: React.ReactNode;
    isTeacher: boolean; // TODO: Redux
    contentIndexState: ContentIndexState; // TODO: Redux
    interactiveModeState: InteractiveModeState; // TODO: Redux
    streamIdState: StreamIdState; // TODO: Redux - Session
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewLayout(props: LayoutProps): JSX.Element {
    const { children, isTeacher, contentIndexState, interactiveModeState, streamIdState, numColState, setNumColState } = props;
    const classes = useStyles()
    const { sessionId, materials } = useContext(UserContext);
    const { streamId, setStreamId } = streamIdState;
    const { contentIndex, setContentIndex } = contentIndexState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [openDrawer, setOpenDrawer] = useState(true);
    const handleOpenDrawer = (open?: boolean) => {
        if (open !== null && open !== undefined) {
            setOpenDrawer(open);
        } else {
            setOpenDrawer(!openDrawer);
        }
    };

    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            wrap="nowrap"
            style={{
                height: "100%",
                border: "5px solid lime",
            }}
        >
            <MainContainer
                classContent={children}
                isTeacher={isTeacher}
                interactiveModeState={interactiveModeState}
                material={material}
                streamId={streamId}
                openDrawer={openDrawer}
                handleOpenDrawer={handleOpenDrawer}
                tabIndex={tabIndex}
                setTabIndex={setTabIndex}
            />
            <DrawerContainer
                isTeacher={isTeacher}
                openDrawer={openDrawer}
                handleOpenDrawer={handleOpenDrawer}
                tabIndex={tabIndex}
                contentIndexState={contentIndexState}
                numColState={numColState}
                setNumColState={setNumColState}
            />
        </Grid>
    )
}

function MainContainer({ classContent, isTeacher, interactiveModeState, material, streamId, openDrawer, handleOpenDrawer, tabIndex, setTabIndex }: {
    classContent?: React.ReactNode,
    isTeacher: boolean,
    interactiveModeState: InteractiveModeState, // TODO: Redux
    material: { // TODO: Type
        __typename: MaterialTypename;
        name: string;
        url: string;
    } | {
        __typename: undefined;
        name: string;
        url?: string | undefined;
        video?: string | undefined;
    } | undefined,
    streamId: string | undefined, // TODO: Redux - Session
    openDrawer: boolean,
    handleOpenDrawer: (open?: boolean) => void,
    tabIndex: number,
    setTabIndex: React.Dispatch<React.SetStateAction<number>>,
}) {
    const classes = useStyles()
    const theme = useTheme();
    const TOOLBAR_WIDTH = theme.spacing(8);

    const [key, setKey] = useState(Math.random())

    const handleTabIndexChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Grid
            item xs={openDrawer ? 9 : 12}
            id="main-container"
            component="main"
            style={{
                position: "relative",
                padding: theme.spacing(4), // TODO? in mobile, less padding? with Redux work?
                paddingRight: theme.spacing(4) + TOOLBAR_WIDTH,

                backgroundColor: "red",
            }}
            key={key}
        >
            {classContent || null}

            {/* Drawer Toolbar */}
            <Grid
                id="drawer-toolbar"
                container
                direction="column"
                justify="space-between"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: TOOLBAR_WIDTH,
                    height: "100%",
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Grid item>
                    <Tabs
                        aria-label="drawer vertical tabs"
                        orientation="vertical"
                        // variant="fullWidth" // TODO: need it?
                        value={tabIndex}
                        onChange={handleTabIndexChange}
                        className={classes.tabs}
                        classes={{
                            indicator: classes.tabIndicator
                        }}
                    >
                        {isTeacher ?
                            TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setTabIndex }} value={index}>{tab.icon}</StyledTab>) :
                            TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} className={index === tabIndex ? classes.tabSelected : ""} title={tab.title} handlers={{ handleOpenDrawer, setTabIndex }} value={index}>{tab.icon}</StyledTab>)
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
    )
}

// TODO: isTeacher Redux
function DrawerContainer({ isTeacher, openDrawer, handleOpenDrawer, tabIndex, contentIndexState, numColState, setNumColState }: {
    isTeacher: boolean,
    openDrawer: boolean,
    handleOpenDrawer: (open?: boolean) => void,
    tabIndex: number,
    contentIndexState: ContentIndexState,
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}) {
    const theme = useTheme();
    const { users, messages } = RoomContext.Consume()

    useEffect(() => {
        console.log("openDrawer: ", openDrawer)
    }, [openDrawer])

    return (
        <Grid
            hidden={!openDrawer}
            item
            xs={3}
            style={{ backgroundColor: theme.palette.background.paper }}
        >
            <UsersContext.Provider value={users}>
                <MessageContext.Provider value={messages}>
                    {isTeacher ?
                        TABS.filter((t) => t.userType !== 1).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} contentIndexState={contentIndexState} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={tabIndex} numColState={numColState} setNumColState={setNumColState} />) :
                        TABS.filter((t) => t.userType !== 0).map((tab, index) => <TabPanel key={`tab-panel-${tab.title}`} handleOpenDrawer={handleOpenDrawer} index={index} tab={tab} value={tabIndex} />)
                    }
                </MessageContext.Provider>
            </UsersContext.Provider>
        </Grid>
    )
}

interface StyledTabProps {
    children: React.ReactElement;
    className: string;
    handlers: {
        handleOpenDrawer: (open?: boolean) => void;
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
                handlers.handleOpenDrawer(true);
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
    const isSelf = id === sessionId;
    let idx = 1;
    if (isSelf) { idx = 0; }

    return (
        <Grid id={`participant:${id}`} item xs={gridMode ? 6 : 12} style={{ order: idx }}>
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

function TabInnerContent({ contentIndexState, title, numColState, setNumColState }: {
    contentIndexState?: ContentIndexState,
    title: string,
    numColState?: number,
    setNumColState?: React.Dispatch<React.SetStateAction<number>>,
}) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobileOnly = useSelector((state: State) => state.session.userAgent.isMobileOnly);
    const { camera, sessionId, materials, teacher } = useContext(UserContext);

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
            const allUsers = [...users.entries()];
            const selfUser = allUsers.filter(([id]) => id === sessionId);
            const otherUsers = allUsers.filter(([id]) => id !== sessionId);

            return (
                <Grid container direction="row" justify="flex-start" alignItems="center" style={{ flex: 1 }}>
                    {teacher ? <>
                        {selfUser.map(([id, session]) =>
                            <Camera
                                key={id}
                                mediaStream={camera !== null ? camera : undefined}
                                session={session}
                                muted={true}
                                controls={true}
                                bottomControls={true}
                            />
                        )}
                        <GlobalControls />
                    </> : null}
                    {!isMobileOnly ? <ToggleCameraViewMode setGridMode={setGridMode} /> : null}
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
                            // TODO: below
                            // height: teacher ? `calc(100% - ${theme.spacing(60)}px)` : `calc(100% - ${theme.spacing(9)}px)`, // Because student side has no <InviteButton /> and <GlobalControls />
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
                                    mediaStream={id === sessionId && camera !== null ? camera : webrtc.getCameraStream(id)}
                                />
                            )) :
                            allUsers.map(([id, session]) =>
                                <ParticipantCamera
                                    key={id}
                                    gridMode={gridMode}
                                    sessionId={sessionId}
                                    id={id}
                                    session={session}
                                    mediaStream={id === sessionId && camera !== null ? camera : webrtc.getCameraStream(id)}
                                />
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

function ToggleCameraViewMode({ setGridMode }: { setGridMode: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Grid container justify="flex-end" item xs={12}>
            <IconButton aria-label="switch grid view" size="small" onClick={() => setGridMode(true)}>
                <StyledIcon icon={<GridIcon />} size="medium" />
            </IconButton>
            <IconButton aria-label="switch list view" size="small" onClick={() => setGridMode(false)}>
                <StyledIcon icon={<ListIcon />} size="medium" />
            </IconButton>
        </Grid>
    )
}