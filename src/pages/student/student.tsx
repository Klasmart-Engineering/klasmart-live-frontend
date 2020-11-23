import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { RoomContext } from "../room/room";
import { MaterialTypename } from "../../lessonMaterialContext";
import PreviewPlayer from "../../components/h5p/preview-player";
import { RecordedIframe } from "../../components/h5p/recordediframe";
import { ReplicaMedia } from "../../components/media/synchronized-video";
import VideoStream from "../../components/media/videoStream";
import { imageFrame } from "../../utils/layerValues";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { useContentToHref } from "../../utils/contentUtils";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { useUserContext } from "../../context-provider/user-context";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative",
            height: "100%",
            margin: "0px auto",
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
            maxHeight: "99%",
            // maxHeight: `calc(100vh - ${theme.spacing(5)}px)`,
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

    const { name, sessionId } = useUserContext();
    const webrtc = WebRTCSFUContext.Consume()
    const [streamId, setStreamId] = useState<string>();

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState<number>(0);

    const [contentHref] = useContentToHref(content);

    const studentModeFilterGroups = useMemo(() => {
        return [sessionId];
    }, [sessionId]);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [rootDivRef.current]);

    if (!content || content.type == "Blank") {
        return (
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
        );
    } else {
        switch (content.type) {
            case "Stream":
                return (
                    <Grid
                        id="student-class-content-container"
                        ref={rootDivRef}
                        container direction="column"
                        item xs={12}
                        className={classes.root}
                        style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                    >
                        <Whiteboard uniqueId="student" />
                        <PreviewPlayer streamId={content.contentId} parentWidth={squareSize} parentHeight={squareSize} />
                    </Grid>
                );
            case "Activity":
                return (
                    <Grid
                        id="student-class-content-container"
                        ref={rootDivRef}
                        container direction="column"
                        item xs={12}
                        className={classes.root}
                        style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                    >
                        <Whiteboard group={sessionId} uniqueId="student" filterGroups={studentModeFilterGroups} />
                        {(rootDivRef && squareSize) ?
                            <RecordedIframe
                                contentId={contentHref}
                                setStreamId={setStreamId}
                                parentWidth={squareSize}
                                parentHeight={squareSize}
                            /> : undefined}
                    </Grid>
                );
            case "Audio":
            case "Video":
                return (
                    <Grid
                        id="student-class-content-container"
                        ref={rootDivRef}
                        container direction="column"
                        item xs={12}
                        className={classes.root}
                        style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                    >
                        <Whiteboard uniqueId="student" />
                        <ReplicaMedia type={content.type === "Video" ? MaterialTypename.Video : MaterialTypename.Audio} style={{ width: "100%" }} sessionId={content.contentId} />
                    </Grid >
                );
            case "Image":
                return (
                    <Grid
                        id="student-class-content-container"
                        ref={rootDivRef}
                        container direction="column"
                        item xs={12}
                        className={classes.root}
                        style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                    >
                        <Whiteboard uniqueId="student" />
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
                            <img className={classes.imageFrame} src={contentHref} />
                        </Grid>
                    </Grid>
                );
            case "Camera":
                {
                    const session = users.get(content.contentId)
                    return (
                        <Grid
                            id="student-class-content-container"
                            ref={rootDivRef}
                            container direction="column"
                            item xs={12}
                            className={classes.root}
                            style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                        >
                            <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                            <Whiteboard uniqueId="student" />
                            <VideoStream stream={webrtc.getCameraStream(content.contentId)} />
                        </Grid>
                    );
                }
            case "Screen":
                {
                    const session = users.get(content.contentId)
                    return (
                        <Grid
                            id="student-class-content-container"
                            ref={rootDivRef}
                            container direction="column"
                            item xs={12}
                            className={classes.root}
                            style={squareSize ? { width: squareSize, height: squareSize } : undefined}
                        >
                            <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                            <Whiteboard uniqueId="student" />
                            <VideoStream stream={webrtc.getAuxStream(content.contentId)} />
                        </Grid>
                    );
                }
        }
    }
}
