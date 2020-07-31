import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState, useContext } from "react";
import { RecordedIframe } from "../../components/recordediframe";
import { Session, Content, ContentIndexState, InteractiveModeState, StreamIdState } from "../../room";
import { Theme, Card, useTheme, CardContent, useMediaQuery, Divider } from "@material-ui/core";
import { PreviewPlayer } from "../../components/preview-player";
import { Cameras, webRTCContext, Stream } from "../../webRTCState";
import { UserContext } from "../../entry";
import CenterAlignChildren from "../../components/centerAlignChildren";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { MaterialSelection } from "./materialSelection";
import { ScreenShareContext } from "./screenShareProvider";
import { ReplicatedMedia } from "../synchronized-video";
import { Face as FaceIcon } from "@styled-icons/material/Face";
import { MaterialTypename } from "../../lessonMaterialContext";

const drawerWidth = 340;

export const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
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
        toolbar: {
            margin: "0 auto",
            width: "100%"
        },
        toolbarFrame: {
            borderTop: "1px solid gray",
            borderRadius: 0,
        },
        toolbarActivityFrame: {
            border: "1px solid gray",
            borderRadius: 12,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
    })
);

interface Props {
    content: Content;
    users: Map<string, Session>;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}


export function Teacher(props: Props): JSX.Element {
    const { roomId, sessionId, materials, name } = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    const screenShare = useContext(ScreenShareContext);

    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { content, users, openDrawer, handleOpenDrawer, contentIndexState, interactiveModeState, streamIdState } = props;

    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    const { streamId, setStreamId } = streamIdState;
    const { interactiveMode, setInteractiveMode } = interactiveModeState;
    const { contentIndex, setContentIndex } = contentIndexState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    useEffect(() => {
        const containerRef = window.document.getElementById("iframe-container");
        if (containerRef) {
            setHeight(containerRef.getBoundingClientRect().height);
            setWidth(containerRef.getBoundingClientRect().width);
        }
    }, []);

    const [showContent, { loading }] = useMutation(MUT_SHOW_CONTENT);
    useEffect(() => {
        if (!interactiveMode) {
            showContent({ variables: { roomId, type: "Camera", contentId: sessionId } });
        }
    }, [roomId, interactiveMode]);

    useEffect(() => {
        if (interactiveMode === 1 && material) {
            if (material.__typename === MaterialTypename.Video || (material.__typename === undefined && material.video)) {
                showContent({ variables: { roomId, type: "Video", contentId: sessionId } });
            } else if(material.__typename === MaterialTypename.Audio) {
                showContent({ variables: { roomId, type: "Audio", contentId: sessionId } });
            } else if(material.__typename === MaterialTypename.Image) {
                showContent({ variables: { roomId, type: "Image", contentId: material.url } });
            } else if ((material.__typename === MaterialTypename.Iframe || material.__typename === undefined) && material.url) {
                showContent({ variables: { roomId, type: "Stream", contentId: streamId } });
            }
        }
    }, [roomId, interactiveMode, material, streamId]);

    useEffect(() => {
        if (interactiveMode === 2 && material && material.url) {
            showContent({ variables: { roomId, type: "Activity", contentId: material.url } });
        }
    }, [roomId, interactiveMode, material]);

    useEffect(() => {
        if (interactiveMode === 3) {
            showContent({ variables: { roomId, type: "Screen", contentId: sessionId } });
        }
    }, [roomId, interactiveMode, sessionId]);

    return (
        <div className={classes.root}>
            {/* <MaterialSelection materials={materials} contentIndex={contentIndex} setContentIndex={setContentIndex} /> */}
            <Grid
                container
                direction="row"
                className={(material && material.__typename === MaterialTypename.Iframe) ? classes.activityFrame : "" }
                spacing={1}
            >
                {content.type === "Activity" ?
                    <>
                        <Grid item xs={12}>
                            <Typography variant="caption" color="textSecondary" gutterBottom>
                                Interactive View
                            </Typography>
                        </Grid>
                        {
                            [...users.entries()].filter(([, s]) => s.id !== sessionId).map(([id, session]) => (
                                <Grid item xs={12} md={6} key={id}>
                                    <Card>
                                        <CardContent>
                                            <Grid item xs={12} style={{ height: drawerWidth, width: drawerWidth, margin: "0 auto" }}>
                                                {
                                                    session.streamId
                                                        ? <Whiteboard width={drawerWidth} height={drawerWidth} filterUsers={[sessionId, session.id]}>
                                                            <PreviewPlayer streamId={session.streamId} height={drawerWidth} width={drawerWidth} />
                                                        </Whiteboard>
                                                        : undefined
                                                }
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Cameras id={session.id} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CenterAlignChildren center>
                                                    <FaceIcon style={{ marginRight: theme.spacing(1) }} />
                                                    <Typography variant="body2" align="center">
                                                        {session.name}
                                                    </Typography>
                                                </CenterAlignChildren>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </> :
                    <Whiteboard height="100%">
                        {
                            //TODO: tidy up the conditions of what to render
                            interactiveMode === 3 ?
                                <Stream stream={screenShare.getStream()} /> :
                                <>
                                        {material ?
                                            material.__typename === MaterialTypename.Image ?
                                                <Grid container>
                                                    <Grid container item style={{
                                                            height: "100%",
                                                            position: "absolute",
                                                            left: 0,
                                                            right: 0,
                                                            zIndex: 1,
                                                            // display: "block",
                                                            backgroundImage: `url(${material.url})`,
                                                            filter: "blur(8px)",
                                                            WebkitFilter: "blur(8px)",
                                                            backgroundPosition: "center",
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundSize: "cover",
                                                        }}
                                                    />
                                                    <img
                                                        className={classes.imageFrame}
                                                        src={material.url}
                                                    />
                                                </Grid> :
                                            material.__typename === MaterialTypename.Video ||
                                            material.__typename === MaterialTypename.Audio ||
                                            (material.__typename === undefined && material.video) ? //Legacy Format TODO: Deprecate
                                                <ReplicatedMedia
                                                    type={material.__typename||MaterialTypename.Video}
                                                    src={(material.__typename === undefined && material.video)||material.url}
                                                    style={{width:"100%"}}
                                                /> :
                                            (material.__typename === MaterialTypename.Iframe || material.__typename === undefined) && material.url ? //Legacy Format TODO: Deprecate
                                            <RecordedIframe
                                                contentId={material.url}
                                                setStreamId={setStreamId}
                                                parentWidth={width}
                                                parentHeight={height}
                                                setParentWidth={setWidth}
                                                setParentHeight={setHeight}
                                            />:
                                            undefined : //Unknown Material
                                            undefined //No Material
                                        }
                                </>
                        }
                    </Whiteboard>
                }
            </Grid>
        </div>
    );
}
