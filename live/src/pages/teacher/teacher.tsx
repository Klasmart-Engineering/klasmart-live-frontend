import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState, useContext, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { RecordedIframe } from "../../components/recordediframe";
import { ControlButtons } from "./controlButtons";
import { Session, Content } from "../../room";
import { Theme, Button, IconButton, Card, useTheme, CardContent, useMediaQuery } from "@material-ui/core";
import { PreviewPlayer } from "../../components/preview-player";
import clsx from "clsx";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { Cameras, webRTCContext } from "../../webRTCState";
import { UserContext } from "../../entry";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import CenterAlignChildren from "../../components/centerAlignChildren";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { MaterialSelection } from "./materialSelection";
import { BroadcastVideo } from "./broadcastVideo";
import PermissionControls from "../../whiteboard/components/PermissionControls";

const drawerWidth = 340;

const MUT_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
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
        content: {
            flexGrow: 1,
            padding: theme.spacing(2),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginRight: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        },
    })
);

interface Props {
    content: Content;
    users: Map<string, Session>;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: {
        contentIndex: number;
        setContentIndex: React.Dispatch<React.SetStateAction<number>>;
    };
}


export function Teacher (props: Props): JSX.Element {
    const {roomId, sessionId, materials} = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
    const { content, users, openDrawer, handleOpenDrawer, contentIndexState } = props;

    const [streamId, setStreamId] = useState<string>();
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    const { contentIndex, setContentIndex } = contentIndexState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;
    
    useEffect(() => {
        const containerRef = window.document.getElementById("iframe-container");
        if (containerRef) {
            setHeight(containerRef.getBoundingClientRect().height);
            setWidth(containerRef.getBoundingClientRect().width);
        }
    }, []);

    const [selectedButton, setSelectedButton] = useState<number>(0);
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT);
    useEffect(()=>{
        if (selectedButton === 0) {
            showContent({variables: { roomId, type: "Blank", contentId: "" }});
        }
    },[roomId,selectedButton]);

    useEffect(()=>{
        if (selectedButton === 1 && material) {
            if(material.video) {
                showContent({variables: { roomId, type: "Video", contentId: sessionId }});
            } else if(material.url) {
                showContent({variables: { roomId, type: "Stream", contentId: streamId }});
            }
        }
    },[roomId,selectedButton,material,streamId]);

    useEffect(()=>{
        if (selectedButton === 2 && material && material.url) {
            showContent({variables: { roomId, type: "Activity", contentId: material.url }});
        }
    },[roomId,selectedButton, material]);

    function Toolbar() {
        return (
            <Grid item xs={12} style={{ padding: 0 }}>
                <Grid
                    container
                    justify="space-between"
                    // eslint-disable-next-line react/prop-types
                    className={clsx(classes.toolbar, content.type === "Activity" ? classes.toolbarActivityFrame : classes.toolbarFrame)}
                >
                    <Grid item>
                        <ControlButtons 
                            setSelectedButton={setSelectedButton}
                            selectedButton={selectedButton}
                            loading={loading}
                            disablePresent={!(streamId || (material && material.video))}
                            disableActivity={!(material && material.url)}
                        />
                    </Grid>
                    <Grid item style={{ marginLeft: "auto" }}>
                        <Button
                            aria-label="open preview drawer" 
                            onClick={() => handleOpenDrawer()}
                            size="small"
                            style={{ 
                                color: "black", 
                                padding: "2px 5px", 
                                borderRadius: 12,
                                margin: "2px 8px",
                            }}
                        >
                            <MenuOpenIcon style={{ paddingRight: 5 }} />
                            <FormattedMessage id={openDrawer ? "close_preview_drawer" : "open_preview_drawer"} />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }


    return (
        <div className={classes.root}>
            <main
                id="iframe-container"
                className={
                    clsx(classes.content, { [classes.contentShift]: open })
                }
            >
                <MaterialSelection materials={materials} contentIndex={contentIndex} setContentIndex={setContentIndex} />
                { content.type === "Activity" ? <Toolbar /> : null }
                <Grid 
                    container 
                    direction="row"
                    className={content.type === "Activity" ? "" : classes.activityFrame}
                    spacing={1}
                >
                    { content.type === "Activity" ?
                        <>
                            <Grid item xs={12}>
                                <Typography variant="caption" color="textSecondary" gutterBottom>
                                    Interactive View
                                </Typography> 
                            </Grid>
                            {
                                [...users.entries()].filter(([,s]) => s.id !== sessionId).map(([id,session]) => (
                                    <Grid item xs={12} md={6} key={id}>
                                        <Card>
                                            <CardContent>
                                                <Grid item xs={12} style={{ height: drawerWidth, width: drawerWidth, margin: "0 auto"}}>
                                                    {
                                                        session.streamId
                                                            ? <PreviewPlayer streamId={session.streamId} height={drawerWidth} width={drawerWidth} />
                                                            : undefined
                                                    }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Cameras id={session.id} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <CenterAlignChildren center>
                                                        <FaceTwoToneIcon style={{ marginRight: theme.spacing(1) }} />
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
                        <>
                            <Whiteboard height="100%">
                                {material && material.url ?
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
                            </Whiteboard>
                        </>
                        
                    }
                    { content.type !== "Activity" ? <Toolbar /> : null }
                </Grid>
                {/* { content.type !== "Activity" ? 
                    <Grid item>
                        { users.size === 0 ? 
                            <Typography>
                                <FormattedMessage id="waiting_for_students" />
                            </Typography> :
                            <Grid container direction="row" style={{ height: "100%", width: "100%", padding: 4 }}>
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>
                                        Students
                                    </Typography> 
                                </Grid>
                                {
                                    [...users.entries()].filter(([,s]) => s.id !== sessionId).map(([id,session]) => (
                                        <Grid item xs={6} md={4} lg={2} xl={1} key={id}>
                                            <Card>
                                                <CardContent>
                                                    <Grid item xs={12}>
                                                        <Cameras id={session.id} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CenterAlignChildren center>
                                                            <FaceTwoToneIcon style={{ marginRight: theme.spacing(1) }} />
                                                            <Typography variant="body2" align="center">
                                                                {session.name}
                                                            </Typography>
                                                        </CenterAlignChildren>
                                                    </Grid>
                                                    { session.name ? 
                                                        <Grid item xs={12}>
                                                            <PermissionControls otherUserId={session.name} />
                                                        </Grid>
                                                        : <></> 
                                                    }
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }
                    </Grid> : null
                } */}
            </main>
        </div>
    );
}
