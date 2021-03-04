import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { LocalSession } from "../../entry";
import { ContentType, RoomContext, Session } from "../room/room";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { Stream } from "../../webRTCState";
import { ReplicaMedia } from "../synchronized-video";
import { MaterialTypename } from "../../lessonMaterialContext";
import { PreviewPlayer } from "../../components/previewPlayer";
import { RecordedIframe } from "../../components/recordediframe";
import { imageFrame } from "../../utils/layerValues";
import { WebRTCSFUContext } from "../../webrtc/sfu";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
            height: 240,
            padding: theme.spacing(2),
        },
        imageFrame: {
            zIndex: imageFrame,
            maxWidth: "99%",
            maxHeight: `calc(100vh - ${theme.spacing(5)}px)`,
            margin: "0 auto",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
        },
        textMargin: {
            marginTop: 4
        }
    }),
);

export function Student({ openDrawer }: {
    openDrawer: boolean
}): JSX.Element {
    const { content, sessions } = RoomContext.Consume();
    const classes = useStyles();

    const { name, sessionId } = useContext(LocalSession);
    const webrtc = WebRTCSFUContext.Consume()
    const [streamId, setStreamId] = useState<string>();

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [rootDivWidth, setRootDivWidth] = useState<number>(0);
    const [rootDivHeight, setRootDivHeight] = useState<number>(0);
    const [session, setSession] = useState<Session>();

    const studentModeFilterGroups = useMemo(() => {
        return [sessionId];
    }, [sessionId]);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        setRootDivWidth(rootDivRef.current.clientWidth);
        setRootDivHeight(rootDivRef.current.clientHeight);
    }, [rootDivRef.current]);

    useEffect(() => {
        if (content) {
            const studentSession = sessions.get(content.contentId);
            if (studentSession) {
                setSession(studentSession);
            }
        }
    }, [content]);

    return (
        <>
            {!content || content.type === ContentType.Blank &&
                <div ref={rootDivRef} className={classes.root}>
                    <Grid item xs={12}>
                        <Paper elevation={4} className={classes.paperContainer}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                style={{ height: "100%" }}
                            >
                                <Grid item xs={12}>
                                    <Typography><FormattedMessage id={"hello"} values={{ name }} /></Typography>
                                    <Typography><FormattedMessage id={"waiting_for_class"} /></Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </div>
            }
            {content && content.type === ContentType.Stream &&
                <div ref={rootDivRef} id="player-container" className={classes.root}>
                    <Whiteboard uniqueId="student">
                        <PreviewPlayer streamId={content.contentId} width={rootDivWidth} height={rootDivHeight} />
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                    {/* <Grid className={classes.textMargin} container justify="center" item xs={12}>
                        <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                            <FormattedMessage id="student_stream_mode" />
                        </Typography>
                    </Grid> */}
                </div>
            }
            {content && content.type === ContentType.Activity &&
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard group={sessionId} uniqueId="student" filterGroups={studentModeFilterGroups}>
                        {(rootDivRef && rootDivHeight) ?
                            <RecordedIframe
                                contentId={content.contentId}
                                setStreamId={setStreamId}
                                parentWidth={rootDivWidth}
                                parentHeight={rootDivHeight}
                                openDrawer={openDrawer}
                            /> : undefined}
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                    {/* <Grid className={classes.textMargin} container justify="center" item xs={12}>
                        <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                            <FormattedMessage id="student_activity_mode" />
                        </Typography>
                    </Grid> */}
                </div>
            }
            {/* {content && content.type === ContentType.Audio ? null : null } */}
            {content && content.type === ContentType.Video &&
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard uniqueId="student">
                        <ReplicaMedia type={content.type === "Video" ? MaterialTypename.Video : MaterialTypename.Audio} style={{ width: "100%" }} sessionId={content.contentId} />
                    </Whiteboard>
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Image &&
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard uniqueId="student">
                        <Grid container>
                            <Grid container item style={{
                                height: "100%",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                zIndex: 1,
                                // display: "block",
                                backgroundImage: `url(${content.contentId})`,
                                filter: "blur(8px)",
                                WebkitFilter: "blur(8px)",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                            />
                            <img
                                className={classes.imageFrame}
                                src={content.contentId}
                            />
                        </Grid>
                    </Whiteboard>
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Camera  &&
                <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student">
                        <Stream stream={webrtc.getCameraStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Screen &&
                <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student">
                        <Stream stream={webrtc.getAuxStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>
            }

        </>
    );
}
