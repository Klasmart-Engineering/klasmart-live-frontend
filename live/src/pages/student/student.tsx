import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { UserContext } from "../../entry";
import { RoomContext } from "../room/room";
import { MaterialTypename } from "../../lessonMaterialContext";
import { PreviewPlayer } from "../../components/h5p/preview-player";
import { RecordedIframe } from "../../components/h5p/recordediframe";
import { ReplicaMedia } from "../../components/media/synchronized-video";
import VideoStream from "../../components/media/videoStream";
import { imageFrame } from "../../utils/layerValues";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { useContentToHref } from "../../utils/contentUtils";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";

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

export function Student(): JSX.Element {
    const { content, users } = RoomContext.Consume();
    const classes = useStyles();

    const { name, sessionId } = useContext(UserContext);
    const webrtc = WebRTCSFUContext.Consume()

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [rootDivWidth, setRootDivWidth] = useState<number>(0);
    const [rootDivHeight, setRootDivHeight] = useState<number>(0);

    const [contentHref] = useContentToHref(content);

    const studentModeFilterGroups = useMemo(() => {
        return [sessionId];
    }, [sessionId]);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        setRootDivWidth(rootDivRef.current.clientWidth);
        setRootDivHeight(rootDivRef.current.clientHeight);
    }, [rootDivRef.current]);

    if (!content || content.type == "Blank") {
        return (
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
        );
    }

    switch (content.type) {
        case "Stream":
            return (
                <div ref={rootDivRef} id="player-container" className={classes.root}>
                    <Whiteboard uniqueId="student" height={rootDivHeight}>
                        <PreviewPlayer streamId={content.contentId} width={rootDivWidth} height={rootDivHeight} />
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                </div>
            );
        case "Activity":
            return (
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard group={sessionId} uniqueId="student" height={rootDivHeight} filterGroups={studentModeFilterGroups}>
                        {(rootDivRef && rootDivHeight) ?
                            <RecordedIframe
                                contentId={contentHref}
                                setStreamId={setStreamId}
                                parentWidth={rootDivWidth}
                                parentHeight={rootDivHeight}
                            /> : undefined}
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                </div>
            );
        case "Audio":
        case "Video":
            return (
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard uniqueId="student" height={rootDivHeight}>
                        <ReplicaMedia type={content.type === "Video" ? MaterialTypename.Video : MaterialTypename.Audio} style={{ width: "100%" }} sessionId={content.contentId} />
                    </Whiteboard>
                    <WBToolbar />
                </div>
            );
        case "Image":
            return <div ref={rootDivRef} className={classes.root}>
                <Whiteboard uniqueId="student" height={rootDivHeight}>
                    <Grid container>
                        <Grid container item style={{
                            height: "100%",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            zIndex: 1,
                            // display: "block",
                            backgroundImage: `url(${contentHref})`,
                            filter: "blur(8px)",
                            WebkitFilter: "blur(8px)",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                        />
                        <img
                            className={classes.imageFrame}
                            src={contentHref}
                        />
                    </Grid>
                </Whiteboard>
                <WBToolbar />
            </div>;
        case "Camera":
            {
                const session = users.get(content.contentId)
                return <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student" height={rootDivHeight}>
                        <VideoStream stream={webrtc.getCameraStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>;
            }
        case "Screen":
            {
                const session = users.get(content.contentId)
                return <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student" height={rootDivHeight}>
                        <VideoStream stream={webrtc.getAuxStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>;
            }
    }
}
