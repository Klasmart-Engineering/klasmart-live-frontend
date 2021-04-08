import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { RecordedIframe } from "../../components/recordediframe";
import { Session, InteractiveModeState, StreamIdState, InteractiveMode, ContentType } from "../room/room";
import { Theme, Card, useTheme, CardContent, Hidden } from "@material-ui/core";
import { PreviewPlayer } from "../../components/previewPlayer";
import { Stream } from "../../webRTCState";
import { LocalSessionContext } from "../../entry";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { ScreenShare } from "./screenShareProvider";
import { ReplicatedMedia } from "../synchronized-video";
import { Face as FaceIcon } from "@styled-icons/material/Face";
import { ZoomIn as ZoomInIcon } from "@styled-icons/material/ZoomIn";
import { ZoomOut as ZoomOutIcon } from "@styled-icons/material/ZoomOut";
import { QuestionMarkCircleOutline as QuestionIcon } from "@styled-icons/evaicons-outline/QuestionMarkCircleOutline";
import { MaterialTypename } from "../../lessonMaterialContext";
import { imageFrame } from "../../utils/layerValues";
import { State } from "../../store/store";
import { useSelector } from "react-redux";
import { useWindowSize } from "../../utils/viewport";
import { RoomContext } from "../../providers/RoomProvider";

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
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Teacher(props: Props): JSX.Element {
    const size = useWindowSize();
    const [square, setSquare] = useState(size.width > size.height ? size.height : size.width);

    useEffect(() => {
        setSquare(size.width > size.height ? size.height : size.width);
    }, [size])

    const { roomId, sessionId, materials, name } = useContext(LocalSessionContext);
    const screenShare = ScreenShare.Consume()
    const { content, sessions } = useContext(RoomContext)
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

    const classes = useStyles();
    const { interactiveModeState, streamIdState } = props;

    const { streamId, setStreamId } = streamIdState;
    const { interactiveMode } = interactiveModeState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [rootDivWidth, setRootDivWidth] = useState<number>(0);
    const [rootDivHeight, setRootDivHeight] = useState<number>(0);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        setRootDivWidth(rootDivRef.current.clientWidth);
        setRootDivHeight(rootDivRef.current.clientHeight);
    }, [rootDivRef.current]);

    const [showContent, { loading }] = useMutation(MUT_SHOW_CONTENT);

    useEffect(() => {
        if (interactiveMode === InteractiveMode.Blank) {
            showContent({ variables: { roomId, type: ContentType.Camera, contentId: sessionId } });
        } else if (interactiveMode === InteractiveMode.Present && material) {
            if (material.__typename === MaterialTypename.Video || (material.__typename === undefined && material.video)) {
                showContent({ variables: { roomId, type: ContentType.Video, contentId: sessionId } });
            } else if (material.__typename === MaterialTypename.Audio) {
                showContent({ variables: { roomId, type: ContentType.Audio, contentId: sessionId } });
            } else if (material.__typename === MaterialTypename.Image) {
                showContent({ variables: { roomId, type: ContentType.Image, contentId: material.url } });
            } else if ((material.__typename === MaterialTypename.Iframe || (material.__typename === undefined && material.url)) && streamId) {
                showContent({ variables: { roomId, type: ContentType.Stream, contentId: streamId } });
            }
        } else if (interactiveMode === InteractiveMode.Observe && material && material.url) {
            showContent({ variables: { roomId, type: ContentType.Activity, contentId: material.url } });
        } else if (interactiveMode === InteractiveMode.ShareScreen) {
            showContent({ variables: { roomId, type: ContentType.Screen, contentId: sessionId } });
        }
    }, [roomId, interactiveMode, material, streamId, sessionId]);

    return (
        <div ref={rootDivRef} className={classes.root}>
            {content && content.type === ContentType.Activity ? <ObservationMode /> :
                <div
                    style={{
                        display: "flex",
                        position: "relative", // For "absolute" position of <Whiteboard />
                        width: square,
                        height: square
                    }}
                >
                    <Whiteboard uniqueId="global" />
                    {
                        //TODO: tidy up the conditions of what to render
                        interactiveMode === InteractiveMode.ShareScreen ?
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
                                                type={material.__typename || MaterialTypename.Video}
                                                src={(material.__typename === undefined && material.video) || material.url}
                                                style={{ width: "100%" }}
                                            /> :
                                            (material.__typename === MaterialTypename.Iframe || material.__typename === undefined) && material.url ? //Legacy Format TODO: Deprecate
                                                (rootDivWidth && rootDivWidth) ?
                                                    <RecordedIframe
                                                        contentId={material.url}
                                                        setStreamId={setStreamId}
                                                        square={square}
                                                    /> : undefined
                                                : undefined : //Unknown Material
                                    undefined //No Material
                                }
                            </>
                    }
                </div>
            }
        </div>
    );
}

export function ObservationMode() {
    const { sessionId } = useContext(LocalSessionContext);
    const { sessions } = RoomContext.Consume();
    const [studentSessions, setStudentSessions] = useState<Session[]>([]);

    useEffect(() => {
        const students = [...sessions.values()].filter(session => session.isTeacher !== true);
        setStudentSessions(students);
    }, [sessions, sessions.size])

    return (
        <>
            <Typography variant="caption" align="center" color="textSecondary" gutterBottom>
                <FormattedMessage id="live_buttonObserveFull" />
            </Typography>
            <Grid container direction="row" spacing={1} item xs={12}>
                {[...studentSessions.values()].filter(s => s.id !== sessionId).map(session =>
                    <StudentPreviewCard key={session.id} session={session} />
                )}
            </Grid>
        </>
    )
}

function StudentPreviewCard({ session }: { session: Session }) {
    const theme = useTheme();
    const colsObserve = useSelector((store: State) => store.control.colsObserve);

    const cardConRef = useRef<HTMLDivElement>(null);
    const [zoomin, setZoomin] = useState(false);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const filterGroups = useMemo(() => {
        return [session.id];
    }, [session]);

    useEffect(() => {
        if (cardConRef.current) {
            const contWidth = cardConRef.current.getBoundingClientRect().width;
            setWidth(contWidth);
            setHeight(contWidth);
        }
    }, [cardConRef.current, zoomin, colsObserve]);

    const handleOnClickZoom = () => {
        // Automatically scroll top when clicking Zoom In
        if (!zoomin) { window.scrollTo(0, 0) }
        setZoomin(!zoomin)
    }

    return (
        <Grid item xs={12} md={zoomin ? 12 : (12 / colsObserve as (2 | 4 | 6))} style={{ order: zoomin ? 0 : 1 }}>
            <Card>
                <CardContent >
                    <Grid ref={cardConRef} item xs={12} style={{ position: "relative", margin: "0 auto" }}>
                        {session.streamId && <>
                            <Whiteboard group={session.id} uniqueId={session.id} filterGroups={filterGroups} />
                            <PreviewPlayer width={width} height={height} streamId={session.streamId} />
                        </>}
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