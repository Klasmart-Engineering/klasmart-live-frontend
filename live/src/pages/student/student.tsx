import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect, useContext, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../../entry";
import { Content, Session } from "../../room";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { webRTCContext, Stream } from "../../webRTCState";
import { ReplicaMedia } from "../synchronized-video";
import { MaterialTypename } from "../../lessonMaterialContext";
import { PreviewPlayer } from "../../components/preview-player";
import { RecordedIframe } from "../../components/recordediframe";

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
            zIndex: 999,
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

interface Props {
    content: Content;
    users: Map<string, Session>
}

export function Student(props: Props): JSX.Element {
    const { content, users } = props;
    const classes = useStyles();

    const { name } = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    const [streamId, setStreamId] = useState<string>();

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [rootDivWidth, setRootDivWidth] = useState<number>(0);
    const [rootDivHeight, setRootDivHeight] = useState<number>(0);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        setRootDivWidth(rootDivRef.current.clientWidth);
        setRootDivHeight(rootDivRef.current.clientHeight);
    }, [rootDivRef]);

    switch (content.type) {
        case "Blank":
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
        case "Stream":
            return (
                <div ref={rootDivRef} id="player-container" className={classes.root}>
                    <Whiteboard height={rootDivHeight}>
                        <PreviewPlayer streamId={content.contentId} width={rootDivWidth} height={rootDivHeight} />
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                    <Grid className={classes.textMargin} container justify="center" item xs={12}>
                        <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                            <FormattedMessage id="student_stream_mode" />
                        </Typography>
                    </Grid>
                </div>
            );
        case "Activity":
            return (
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard height={rootDivHeight}>
                        {(rootDivRef && rootDivHeight) ?
                            <RecordedIframe
                                contentId={content.contentId}
                                setStreamId={setStreamId}
                                parentWidth={rootDivWidth}
                                parentHeight={rootDivHeight}
                            /> : undefined}
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                    <Grid className={classes.textMargin} container justify="center" item xs={12}>
                        <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                            <FormattedMessage id="student_activity_mode" />
                        </Typography>
                    </Grid>
                </div>
            );
        case "Audio":
        case "Video":
            return (
                <div ref={rootDivRef} className={classes.root}>
                    <Whiteboard height={rootDivHeight}>
                        <ReplicaMedia type={content.type === "Video" ? MaterialTypename.Video : MaterialTypename.Audio} style={{ width: "100%" }} sessionId={content.contentId} />
                    </Whiteboard>
                    <WBToolbar />
                </div>
            );
        case "Image":
            return <div ref={rootDivRef} className={classes.root}>
                <Whiteboard height={rootDivHeight}>
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
            </div>;
        case "Camera":
            {
                const session = users.get(content.contentId)
                return <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard height={rootDivHeight}>
                        <Stream stream={webrtc.getCameraStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>;
            }
        case "Screen":
            {
                const session = users.get(content.contentId)
                return <div ref={rootDivRef} className={classes.root}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard height={rootDivHeight}>
                        <Stream stream={webrtc.getAuxStream(content.contentId)} />
                    </Whiteboard>
                    <WBToolbar />
                </div>;
            }
    }
}
