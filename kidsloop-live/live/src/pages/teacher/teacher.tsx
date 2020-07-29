import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { RecordedIframe } from "../../components/recordediframe";
import { ControlButtons } from "./controlButtons";
import { Session, Content, ContentIndexState, InteractiveModeState, StreamIdState } from "../../room";
import { Theme, Button, IconButton, Card, useTheme, CardContent, useMediaQuery } from "@material-ui/core";
import { PreviewPlayer } from "../../components/preview-player";
import clsx from "clsx";
import { Cameras, webRTCContext, Stream } from "../../webRTCState";
import { UserContext } from "../../entry";
import CenterAlignChildren from "../../components/centerAlignChildren";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { MaterialSelection } from "./materialSelection";
import { BroadcastVideo } from "./broadcastVideo";
import PermissionControls from "../../whiteboard/components/PermissionControls";
import { ScreenShareContext } from "./screenShareProvider";

import { MenuOpen as MenuOpenIcon } from "@styled-icons/material/MenuOpen";
import { Face as FaceIcon } from "@styled-icons/material/Face";

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
            showContent({ variables: { roomId, type: "Blank", contentId: "" } });
        }
    }, [roomId, interactiveMode]);

    useEffect(() => {
        if (interactiveMode === 1 && material) {
            if (material.video) {
                showContent({ variables: { roomId, type: "Video", contentId: sessionId } });
            } else if (material.url) {
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
            showContent({ variables: { roomId, type: "Video", contentId: sessionId } });
        }
    }, [roomId, interactiveMode, sessionId]);

    return (
        <div className={classes.root}>
            {/* <MaterialSelection materials={materials} contentIndex={contentIndex} setContentIndex={setContentIndex} /> */}
            <Grid
                container
                direction="row"
                className={content.type === "Activity" ? "" : classes.activityFrame}
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
                                    {content.type !== "Video" && material && material.url ?
                                        <RecordedIframe
                                            contentId={material.url}
                                            setStreamId={setStreamId}
                                            parentWidth={width}
                                            parentHeight={height}
                                            setParentWidth={setWidth}
                                            setParentHeight={setHeight}
                                        />
                                        : undefined}
                                    {material && material.video ? <BroadcastVideo src={material.video} /> : undefined}
                                </>
                        }
                    </Whiteboard>
                }
            </Grid>
        </div>
    );
}
