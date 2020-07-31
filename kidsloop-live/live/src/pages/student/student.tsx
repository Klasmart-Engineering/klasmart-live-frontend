import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../../entry";
import { Content, Session } from "../../room";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { webRTCContext, Stream } from "../../webRTCState";
import { PreviewPlayer } from "../../components/preview-player";
import { RecordedIframe } from "../../components/recordediframe";
import CameraContainer from "../../components/cameraContainer";
import { ReplicaMedia } from "../synchronized-video";
import { MaterialTypename } from "../../lessonMaterialContext";

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
        activityFrame: {
            border: "1px solid gray",
            borderRadius: 12,
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
            margin: "16px 0"
        }
    }),
);

interface Props {
    content: Content;
    users: Map<string,Session>
}

export function Student(props: Props): JSX.Element {
    const { content, users } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { name,  } = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    const [streamId, setStreamId] = useState<string>();
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");
    const [maxWidth, setMaxWidth] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
        const containerRef = window.document.getElementById("player-container");
        if (containerRef) {
            const contWidth = containerRef.getBoundingClientRect().width;
            const contHeight = containerRef.getBoundingClientRect().height;
            setWidth(contWidth);
            setHeight(Math.min(contWidth, contWidth * 0.5625));
            setMaxWidth(contWidth);
            setMaxHeight(contHeight);
        }
    }, []);

    switch (content.type) {
        case "Blank":
            return (
                <div className={classes.root}>
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
            return (<>
                <div id="player-container" className={classes.activityFrame}>
                    <div style={{ width: width, height: height }}>
                        <Whiteboard width={width} height={height}>
                            <PreviewPlayer streamId={content.contentId} height={height} width={width} />
                            {/* <WBToolbar /> */}
                        </Whiteboard>
                    </div>
                </div>
                <Grid className={classes.textMargin} container justify="center" item xs={12}>
                    <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                        <FormattedMessage id="student_stream_mode" />
                    </Typography>
                </Grid>
            </>);
        case "Activity":
            return (<>
                <Grid
                    container
                    direction="row"
                    className={classes.activityFrame}
                    spacing={1}
                >
                    <Whiteboard height={height}>
                        <RecordedIframe
                            contentId={content.contentId}
                            setStreamId={setStreamId}
                            parentWidth={width}
                            parentHeight={height}
                            setParentWidth={setWidth}
                            setParentHeight={setHeight}
                        />
                        {/* <WBToolbar /> */}
                    </Whiteboard>
                </Grid>
                <Grid className={classes.textMargin} container justify="center" item xs={12}>
                    <Typography variant="caption" color="primary" align="center" style={{ margin: "0 auto" }}>
                        <FormattedMessage id="student_activity_mode" />
                    </Typography>
                </Grid>
            </>);
        case "Audio":
        case "Video":
            return <>
                <Whiteboard height={height}>
                    <ReplicaMedia type={content.type === "Video"?MaterialTypename.Video:MaterialTypename.Audio} style={{width:"100%"}} sessionId={content.contentId}/>
                </Whiteboard>
                <WBToolbar />
            </>;
        case "Image":
            return <>
                <Whiteboard height={height}>
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
            </>;
        case "Camera":
            {
                const session = users.get(content.contentId)
                return <>
                <Typography variant="h6" align="center">{session?session.name:undefined}</Typography>
                <Whiteboard height={height}>
                    <Stream stream={webrtc.getCameraStream(content.contentId)}/>
                </Whiteboard>
                <WBToolbar />
            </>;
            }
        case "Screen":
            {
                const session = users.get(content.contentId)
                return <>
                <Typography variant="h6" align="center">{session?session.name:undefined}</Typography>
                <Whiteboard height={height}>
                    <Stream stream={webrtc.getAuxStream(content.contentId)}/>
                </Whiteboard>
                <WBToolbar />
            </>;
            }
    }
}
