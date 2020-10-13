import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Theme, Card, useTheme, CardContent, Hidden } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";

import { Face as FaceIcon } from "@styled-icons/material/Face";
import { ZoomIn as ZoomInIcon } from "@styled-icons/material/ZoomIn";
import { ZoomOut as ZoomOutIcon } from "@styled-icons/material/ZoomOut";
import { QuestionMarkCircleOutline as QuestionIcon } from "@styled-icons/evaicons-outline/QuestionMarkCircleOutline";

import { ScreenShare } from "./screenShareProvider";
import { UserContext } from "../../entry";
import { Session, ContentIndexState, InteractiveModeState, StreamIdState, RoomContext } from "../room/room";
import { MaterialTypename } from "../../lessonMaterialContext";
import { RecordedIframe } from "../../components/h5p/recordediframe";
import { PreviewPlayer } from "../../components/h5p/preview-player";
import { ReplicatedMedia } from "../../components/media/synchronized-video";
import VideoStream from "../../components/media/videoStream";
import { imageFrame } from "../../utils/layerValues";
import { useMaterialToHref } from "../../utils/contentUtils";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";

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
            position: "relative",
        },
        test: {
            backgroundColor: "#fffb7d",
            border: "2px solid black",
            paddingTop: "56.25%",
        },
        imageFrame: {
            zIndex: imageFrame,
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
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
    numColState: number;
}

export function Teacher(props: Props): JSX.Element {
    const { roomId, sessionId, materials, name } = useContext(UserContext);
    const screenShare = ScreenShare.Consume()
    const { content, users } = RoomContext.Consume()

    const classes = useStyles();
    const { openDrawer, handleOpenDrawer, contentIndexState, interactiveModeState, streamIdState, numColState } = props;

    const { streamId, setStreamId } = streamIdState;
    const { interactiveMode } = interactiveModeState;
    const { contentIndex } = contentIndexState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [rootDivWidth, setRootDivWidth] = useState<number>(0);
    const [rootDivHeight, setRootDivHeight] = useState<number>(0);

    const [contentHref] = useMaterialToHref(material);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        setRootDivWidth(rootDivRef.current.clientWidth);
        setRootDivHeight(rootDivRef.current.clientHeight);
    }, [rootDivRef.current]);

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
            } else if (material.__typename === MaterialTypename.Audio) {
                showContent({ variables: { roomId, type: "Audio", contentId: sessionId } });
            } else if (material.__typename === MaterialTypename.Image) {
                showContent({ variables: { roomId, type: "Image", contentId: material.url } });
            } else if ((material.__typename === MaterialTypename.Iframe || (material.__typename === undefined && material.url)) && streamId) {
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
        <div ref={rootDivRef} className={classes.root}>
            {content && content.type === "Activity" ?
                <>
                    <Typography variant="caption" color="textSecondary" gutterBottom>
                        <FormattedMessage id="student_mode" />
                    </Typography>
                    <Grid container direction="row" spacing={1} item xs={12}>
                        {[...users.entries()].filter(([, s]) => s.id !== sessionId).map(([id, session]) =>
                            <StudentPreviewCard key={id} sessionId={sessionId} session={session} numColState={numColState} />
                        )}
                    </Grid>
                </> :
                <Whiteboard uniqueId="global" height={rootDivHeight}>
                    {
                        //TODO: tidy up the conditions of what to render
                        interactiveMode === 3 ?
                            <VideoStream stream={screenShare.getStream()} /> :
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
                                        </Grid> :
                                        material.__typename === MaterialTypename.Video ||
                                            material.__typename === MaterialTypename.Audio ||
                                            (material.__typename === undefined && material.video) ? //Legacy Format TODO: Deprecate
                                            <ReplicatedMedia
                                                type={material.__typename || MaterialTypename.Video}
                                                src={contentHref}
                                                style={{ width: "100%" }}
                                            /> :
                                            (material.__typename === MaterialTypename.Iframe || material.__typename === undefined) && material.url ? //Legacy Format TODO: Deprecate
                                                (rootDivWidth && rootDivWidth) ?
                                                    <RecordedIframe
                                                        contentId={contentHref}
                                                        setStreamId={setStreamId}
                                                        parentWidth={rootDivWidth}
                                                        parentHeight={rootDivHeight}
                                                        openDrawer={openDrawer}
                                                    /> : undefined
                                                : undefined : //Unknown Material
                                    undefined //No Material
                                }
                            </>
                    }
                </Whiteboard>
            }
        </div >
    );
}

function StudentPreviewCard({ sessionId, session, numColState }: { sessionId: string, session: Session, numColState: number }) {
    const theme = useTheme();

    const cardConRef = useRef<HTMLDivElement>(null);
    const [zoomin, setZoomin] = useState(false);
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    const filterGroups = useMemo(() => {
        return [session.id];
    }, [session]);

    useEffect(() => {
        if (cardConRef.current) {
            const contWidth = cardConRef.current.offsetWidth;
            const contHeight = cardConRef.current.offsetHeight;
            setWidth(contWidth);
            setHeight(Math.min(contWidth, contWidth * 0.5625));
        }
    }, [cardConRef.current, zoomin, numColState]);

    const handleOnClickZoom = () => {
        // Automatically scroll top when clicking Zoom In
        if (!zoomin) { window.scrollTo(0, 0) }
        setZoomin(!zoomin)
    }

    return (
        <Grid item xs={12} md={zoomin ? 12 : (12 / numColState as (2 | 4 | 6))} style={{ order: zoomin ? -1 : 0 }}>
            <Card>
                <CardContent >
                    <Grid ref={cardConRef} item xs={12} style={{ margin: "0 auto" }}>
                        {session.streamId ?
                            <Whiteboard group={session.id} uniqueId={session.id} width={width} height={height} filterGroups={filterGroups}>
                                <PreviewPlayer width={width} height={height} streamId={session.streamId} />
                            </Whiteboard> : undefined
                        }
                    </Grid>
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
                    {session.name ?
                        <Tooltip placement="bottom" title={session.name}>
                            <Typography variant="body2" noWrap>
                                <FaceIcon size="1.25rem" style={{ marginRight: theme.spacing(1) }} />{session.name}
                            </Typography>
                        </Tooltip> :
                        <Typography variant="body2">
                            <QuestionIcon size="1.25rem" style={{ marginRight: theme.spacing(1) }} />
                            <FormattedMessage id="error_unknown_user" />
                        </Typography>
                    }
                    <Hidden smDown>
                        <Grid>
                            <IconButton aria-label="Zoom In student screen" onClick={handleOnClickZoom}>
                                {zoomin
                                    ? <ZoomOutIcon size="1.25rem" color="#0E78D5" />
                                    : <ZoomInIcon size="1.25rem" color="#0E78D5" />
                                }
                            </IconButton>
                        </Grid>
                    </Hidden>
                </CardActions>
            </Card>
        </Grid>
    )
}