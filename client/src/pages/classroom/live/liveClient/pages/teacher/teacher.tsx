import { Button, Hidden, Theme } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import clsx from "clsx";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../../../../../../store/actions";
import { State } from "../../../../../../store/store";
import { LiveSessionData } from "../../../../../../types/objectTypes";
import { InviteButton } from "../../components/invite";
import { PreviewPlayer } from "../../components/preview-player";
import { RecordedIframe } from "../../components/recordediframe";
import { sessionIdContext } from "../../entry";
import { Messages } from "../../messages";
import { Content, Message, Session } from "../../room";
import { SendMessage } from "../../sendMessage";
import { MyCamera } from "../../webRTCState";
import { ControlButtons } from "./controlButtons";
import {
    useRestAPI,
    CreateAssessmentRequest,
    UpdateAssessmentRequest,
} from "../../../../assessments/api/restapi";
import { getDefaultProgId } from "../../../../../../config";

const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            height: "100%",
        },
        title: {
            flexGrow: 1,
        },
        hide: {
            display: "none",
        },
        drawer: {
            flexShrink: 0,
            width: drawerWidth,
        },
        drawerPaper: {
            overflowX: "hidden",
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            marginRight: -drawerWidth,
            padding: theme.spacing(2),
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
        iframeContainer: {
            overflow: "hidden",
            position: "relative",
            // paddingTop: "56.25%",
            margin: "0 auto",
            borderRadius: "12px 12px 0 0",
        },
    }),
);

interface Props {
    content: Content;
    users: Map<string, Session>;
    messages: Map<string, Message>;
}

export function Teacher(props: Props): JSX.Element {
    const api = useRestAPI();

    const classes = useStyles();
    const store = useStore();
    const { content, users, messages } = props;

    const sessionId = useContext(sessionIdContext);
    const [open, setOpen] = useState<boolean>(true);
    const [streamId, setStreamId] = useState<string>();
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");
    const [maxWidth, setMaxWidth] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    const isLive = useSelector((state: State) => state.ui.liveClass);
    const toggleLive = () => {
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });
    };
    const liveData = useSelector((state: State) => state.account.finishLiveData);
    const setFinishedLiveData = (value: LiveSessionData) => {
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
    };
    const setActiveComponent = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_COMPONENT_HOME, payload: value });
    };
    const setActiveAssessMenu = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_ASSESSMENTS_MENU, payload: value });
    };
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return {
            activity: url.searchParams.get("activity") || "",
            hostName: url.hostname,
        };
    }, []);

    const [contentId, setContentId] = useState(memos.activity);

    useEffect(() => {
        function test(e: MessageEvent) {
            if (!e.data || !e.data.url) { return; }
            setContentId(e.data.url);
        }

        window.addEventListener("message", test);
        return () => window.removeEventListener("message", test);
    }, []);

    useEffect(() => {
        const containerRef = window.document.getElementById("iframe-container");
        if (containerRef) {
            setHeight(containerRef.getBoundingClientRect().height);
            setWidth(containerRef.getBoundingClientRect().width);
            setMaxHeight(containerRef.getBoundingClientRect().height);
            setMaxWidth(containerRef.getBoundingClientRect().width);
        }
    }, []);

    // TODO: While pending, Backdrop or simple progress bar for loading,
    // If uploadAssessment is failed, UI for add assessment manually 
    async function onEndClass() {
        if (isLive) { toggleLive(); }
        const data: LiveSessionData = {
            classId: liveData.classId,
            className: liveData.className,
            startDate: liveData.startDate,
            students: liveData.students
        };
        setFinishedLiveData(data);
        await uploadAssessment(data);
        setActiveAssessMenu("pending");
        location.href = "/?component=assessments";
    }

    async function uploadAssessment(data: LiveSessionData) {
        const createAssReq: CreateAssessmentRequest = {
            publish: false,
            progId: getDefaultProgId(),
            classId: data.classId,
            className: data.className,
            lessonPlanId: "5db78574-2cf3-4a91-b705-b18d78013676", // TODO: It's temporary for demo
            sessionId: "demo-session-id",
            startDate: data.startDate,
            subject: "English",
        }
        const updateAssReq: UpdateAssessmentRequest = {
            students: data.students,
            state: 2
        }

        const res = await api.createAssessment(createAssReq);
        await api.updateAssessment(res.assId, updateAssReq);
    }

    return (
        <div className={classes.root}>
            <main
                id="iframe-container"
                className={
                    clsx(classes.content, { [classes.contentShift]: open })
                }
            >
                <Grid
                    container
                    style={{ border: "1px solid gray", borderRadius: 12 }}
                >
                    <RecordedIframe
                        contentId={contentId}
                        setStreamId={setStreamId}
                        parentWidth={width}
                        parentHeight={height}
                        setParentWidth={setWidth}
                        setParentHeight={setHeight}
                    />
                    <Grid item xs={12}>
                        <Grid
                            container
                            justify="space-between"
                            style={{ width: "100%", margin: "0 auto", borderTop: "1px solid gray" }}
                        >
                            <Grid item>
                                <ControlButtons
                                    contentId={contentId}
                                    streamId={streamId}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    aria-label="invite"
                                    size="small"
                                    style={{
                                        backgroundColor: "#ff6961",
                                        color: "white",
                                        padding: "2px 5px",
                                        marginRight: 8,
                                        borderRadius: 12,
                                        margin: "4px 8px",
                                    }}
                                    onClick={onEndClass}
                                >
                                    <CloseIcon style={{ paddingRight: 5 }} />
                                    <FormattedMessage id="live_buttonEndClass" />
                                </Button>
                                <InviteButton />
                                <Hidden smDown>
                                    <Button
                                        aria-label="open preview drawer"
                                        onClick={() => setOpen(!open)}
                                        size="small"
                                        style={{
                                            color: "black",
                                            padding: "2px 5px",
                                            marginRight: 8,
                                            borderRadius: 12,
                                            margin: "2px 8px",
                                        }}
                                    >
                                        <MenuOpenIcon style={{ paddingRight: 5 }} />
                                        <Hidden mdDown>
                                            <FormattedMessage id={open ? "live_closePreviewDrawer" : "live_openPreviewDrawer"} />
                                        </Hidden>
                                    </Button>
                                </Hidden>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <SendMessage />
                <Messages messages={messages} />
            </main>
            <Hidden smDown>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div style={{ height: 64 }} />
                    <MyCamera />
                    <Divider />

                    <Grid item>
                        {users.size === 0 ?
                            <Typography>
                                <FormattedMessage id="live_waitingForStudents" />
                            </Typography> :
                            <Grid container direction="column" style={{ height: "100%", width: drawerWidth - 20, padding: 4 }}>
                                <Typography variant="caption" align="center" color="textSecondary" gutterBottom>
                                    Students {content.type === "Activity" ? "+ Interactive View" : ""}
                                </Typography>
                                {
                                    [...users.entries()].filter(([, s]) => s.id !== sessionId).map(([id, session]) => (
                                        <>
                                            {content.type === "Activity" ?
                                                <Grid item style={{ height: drawerWidth - 20, width: drawerWidth - 20, margin: "0 auto" }} key={id}>
                                                    {
                                                        session.streamId
                                                            ? <PreviewPlayer streamId={session.streamId} height={drawerWidth - 20} width={drawerWidth - 20} />
                                                            : undefined
                                                    }
                                                </Grid> : null}
                                            <Grid item>
                                                <Typography align="center">
                                                    {session.name}
                                                </Typography>
                                            </Grid>
                                        </>
                                    ))
                                }
                            </Grid>
                        }
                    </Grid>
                </Drawer>
            </Hidden>
        </div>
    );
}
