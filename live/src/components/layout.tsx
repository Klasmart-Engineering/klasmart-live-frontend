/* eslint-disable no-case-declarations */
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Drawer from "@material-ui/core/Drawer";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, useTheme, Theme, withStyles } from "@material-ui/core/styles";
import * as React from "react";
import CameraContainer from "./cameraContainer";
import { Session, Message } from "../room";
import { Messages } from "../messages";
import { SendMessage } from "../sendMessage";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useState, createContext, useContext } from "react";
import Divider from "@material-ui/core/Divider";
import CloseTwoToneIcon from "@material-ui/icons/CloseTwoTone";
import PeopleAltTwoToneIcon from "@material-ui/icons/PeopleAltTwoTone";
import LibraryBooksTwoToneIcon from "@material-ui/icons/LibraryBooksTwoTone";
import ForumTwoToneIcon from "@material-ui/icons/ForumTwoTone";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import { UserContext } from "../entry";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Cameras, MyCamera, CameraControls } from "../webRTCState";
import CenterAlignChildren from "./centerAlignChildren";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import Toolbar from "../whiteboard/components/Toolbar";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

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
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            overflowX: "hidden",
            overflowY: "auto",
            width: theme.spacing(7),
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        messageContainer: {
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
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
            paddingLeft: theme.spacing(1.5),
        },
        tabRoot: {
            minWidth: "auto",
            padding: 0,
        },
        tabs: {
            borderRight: `1px solid ${theme.palette.divider}`,
            height: "100%",
        },
        tabcontent: {
            // width: DRAWER_WIDTH - theme.spacing(7) - 1,
        }
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
                    <IconButton>
                        <CloseTwoToneIcon onClick={() => handleOpenDrawer(false)}/>
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
    const theme = useTheme();
    const {roomId, sessionId, materials} = useContext(UserContext);

    switch(title) {
    case "Participants":
        const users = useContext(UsersContext);
        return (
            <Grid container direction="column" justify="flex-start" alignItems="center">
                {
                    [...users.entries()].filter(([,s]) => s.id === sessionId).map(([id,session]) => (
                        <React.Fragment key={id}>
                            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                                <Grid item xs={6}>
                                    <MyCamera />
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2" align="left">
                                        You
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <CameraControls />
                                </Grid>
                            </Grid>
                            <Grid container direction="row" justify="flex-start" alignItems="center">
                                <Grid item xs={12}><Divider /></Grid>
                            </Grid>
                        </React.Fragment>
                    ))
                }
                {
                    [...users.entries()].filter(([,s]) => s.id !== sessionId).map(([id,session]) => (
                        <React.Fragment key={id}>
                            <Grid container key={id} direction="row" justify="flex-start" alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <Cameras id={session.id} />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body2" align="left">
                                        {session.name}
                                    </Typography>
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
            );
        }
        else {
            return (
                <Typography>Oops! Something went wrong.</Typography>
            );
        }
    case "Chat":
        const messages = useContext(MessageContext);
        return (
            <Grid 
                container
                direction="column"
                justify="flex-end"
                style={{ overflow: "hidden" }}
            >
                <Grid item className={classes.messageContainer}>
                    <Messages messages={messages} />
                </Grid>
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
    handlers: {
        handleOpenDrawer: (open?: boolean) => void;
        setValue: React.Dispatch<React.SetStateAction<number>>;
    }
    value: number;
    title: string;
}

function StyledTab(props: StyledTabProps) {
    const classes = useStyles();
    const {children, handlers, value, title} = props;

    const a11yProps = () => {
        return {
            id: `vertical-tab-${title}`,
            "aria-controls": `vertical-tabpanel-${title}`,
        };
    };

    return (
        <Tab 
            className={classes.tabRoot}
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

interface ContentIndexState {
    contentIndex: number;
    setContentIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface Props {
    children?: React.ReactNode;
    isTeacher: boolean;
    users: Map<string, Session>;
    messages: Map<string, Message>;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
}

export default function Layout(props: Props): JSX.Element {
    const { children, isTeacher, users, messages, openDrawer, handleOpenDrawer, contentIndexState } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
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
                                    <Tabs
                                        aria-label="vertical tabs"
                                        orientation="vertical"
                                        variant="fullWidth"
                                        value={value}
                                        onChange={handleChange}
                                        className={classes.tabs}
                                        classes={{
                                            indicator: classes.active
                                        }}
                                    >
                                        { isTeacher ? 
                                            TABS.filter((t) => t.userType !== 1).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} title={tab.title} handlers={{handleOpenDrawer, setValue}} value={index}>{tab.icon}</StyledTab>) :
                                            TABS.filter((t) => t.userType !== 0).map((tab, index) => <StyledTab key={`tab-button-${tab.title}`} title={tab.title} handlers={{handleOpenDrawer, setValue}} value={index}>{tab.icon}</StyledTab>)
                                        }
                                    </Tabs>
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
                    </div>
                </Container>
            </Grid>
        </Grid>
    );
}
