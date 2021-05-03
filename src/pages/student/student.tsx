import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { PreviewPlayer } from "../../components/previewPlayer";
import { RecordedIframe } from "../../components/recordediframe";
import { LocalSessionContext } from "../../entry";
import { MaterialTypename } from "../../lessonMaterialContext";
import { RoomContext } from "../../providers/RoomContext";
import { WebRTCContext } from "../../providers/WebRTCContext";
import { imageFrame } from "../../utils/layerValues";
import { useWindowSize } from "../../utils/viewport";
import { Stream } from "../../webRTCState";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { ContentType, Session } from "../room/room";
import { ReplicaMedia } from "../synchronized-video";
import { ObservationMode } from "../teacher/teacher";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative", // For "absolute" position of <Whiteboard />
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
    const size = useWindowSize();
    const [square, setSquare] = useState(size.width > size.height ? size.height : size.width);

    useEffect(() => {
        setSquare(size.width > size.height ? size.height : size.width);
    }, [size])

    const { content, sessions } = useContext(RoomContext);
    const classes = useStyles();

    const { name, sessionId, isTeacher } = useContext(LocalSessionContext);
    const webrtc = useContext(WebRTCContext)
    const [streamId, setStreamId] = useState<string>();
    const [session, setSession] = useState<Session>();

    const studentModeFilterGroups = useMemo(() => {
        return [sessionId];
    }, [sessionId]);

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
                <div className={classes.root} style={{ width: square, height: square }}>
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
                <div id="player-container" className={classes.root} style={{ width: '100%', height:  '100%' }}>
                    <Whiteboard uniqueId="student" />
                    <PreviewPlayer streamId={content.contentId} width={square} height={square} />
                    {/* <WBToolbar /> */}
                    {/* <Grid className={classes.textMargin} container justify="center" item xs={12}>
                        <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                            <FormattedMessage id="student_stream_mode" />
                        </Typography>
                    </Grid> */}
                </div>
            }
            {content && content.type === ContentType.Activity &&
                <div className={classes.root} style={isTeacher ? undefined : { width: square, height: square }}>
                    {isTeacher ? <ObservationMode /> : <>
                        <Whiteboard group={sessionId} uniqueId="student" filterGroups={studentModeFilterGroups} />
                        <RecordedIframe contentId={content.contentId} setStreamId={setStreamId} square={square} />
                    </>}
                </div>
            }
            {/* {content && content.type === ContentType.Audio ? null : null } */}
            {content && content.type === ContentType.Video &&
                <div className={classes.root} style={{ width: square, height: square }}>
                    <Whiteboard uniqueId="student" />
                    <ReplicaMedia type={content.type === "Video" ? MaterialTypename.Video : MaterialTypename.Audio} style={{ width: "100%" }} sessionId={content.contentId} />
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Image &&
                <div className={classes.root} style={{ width: square, height: square }}>
                    <Whiteboard uniqueId="student" />
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
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Camera &&
                <div className={classes.root} style={{ width: square, height: square }}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student" />
                    <Stream stream={webrtc.getCameraStream(content.contentId)} />
                    <WBToolbar />
                </div>
            }
            {content && content.type === ContentType.Screen &&
                <div className={classes.root} style={{ width: square, height: square }}>
                    <Typography variant="caption" align="center">{session ? session.name : undefined}</Typography>
                    <Whiteboard uniqueId="student" />
                    <Stream stream={webrtc.getAuxStream(content.contentId)} />
                    <WBToolbar />
                </div>
            }

        </>
    );
}
