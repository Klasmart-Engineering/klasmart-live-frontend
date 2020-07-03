import { Button, Hidden, Theme} from "@material-ui/core";
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

    const liveData = useSelector((state: State) => state.ui.activeComponentHome);
    const setFinishedLiveData = (value: LiveSessionData) => {
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
    };
    const toggleLive = () => {
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });
    };

    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return {
            activity: url.searchParams.get("activity") || "",
            hostName: url.hostname,
        };
    }, []);

    const [contentId, setContentId] = useState(memos.activity);
    // console.log(`contentId: ${contentId}`)

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
                                    onClick={() => {
                                        const data: LiveSessionData = {
                                            classId: "CalmIsland",
                                            className: "Pre-production",
                                            students: [{
                                                profileId: "student0",
                                                profileName: "Woody",
                                                profileImage: "",
                                            }],
                                        };
                                        setFinishedLiveData(data);
                                        toggleLive();
                                    }}
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
                        { users.size === 0 ?
                            <Typography>
                                <FormattedMessage id="waiting_for_students" />
                            </Typography> :
                            <Grid container direction="column" style={{ height: "100%", width: drawerWidth - 20, padding: 4 }}>
                                <Typography variant="caption" align="center" color="textSecondary" gutterBottom>
                                    Students { content.type === "Activity" ? "+ Interactive View" : "" }
                                </Typography>
                                {
                                    [...users.entries()].filter(([, s]) => s.id !== sessionId).map(([id, session]) => (
                                        <>
                                            { content.type === "Activity" ?
                                                <Grid item style={{ height: drawerWidth - 20, width: drawerWidth - 20, margin: "0 auto" }} key={id}>
                                                    {
                                                        session.streamId
                                                            ? <PreviewPlayer streamId={session.streamId} height={drawerWidth - 20} width={drawerWidth - 20} />
                                                            : undefined
                                                    }
                                                </Grid> : null }
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
