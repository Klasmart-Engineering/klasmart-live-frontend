import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { RecordedIframe } from "../../components/recordediframe";
import { ControlButtons } from "./controlButtons";
import { Session, Message, Content } from "../../room";
import { Theme, Button, Hidden, IconButton, Card, Avatar, useTheme, CardContent } from "@material-ui/core";
import { sessionIdContext } from "../../entry";
import { PreviewPlayer } from "../../components/preview-player";
import clsx from "clsx";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import { InviteButton } from "../../components/invite";
import { MyCamera, Cameras } from "../../webRTCState";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import { UserContext } from "../../app";
import FaceTwoToneIcon from "@material-ui/icons/FaceTwoTone";
import CenterAlignChildren from "../../components/centerAlignChildren";

const drawerWidth = 340;

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
    setOpenDrawer: () => void;
}


export function Teacher (props: Props): JSX.Element {
    const classes = useStyles();
    const theme = useTheme();
    const {materials} = useContext(UserContext);
    const { content, users, openDrawer, setOpenDrawer } = props;
  
    const sessionId = useContext(sessionIdContext);
    const [streamId, setStreamId] = useState<string>();
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    const [selectedButton, setSelectedButton] = useState<number>(0);
    const [contentId, setContentId] = useState(materials.length === 0 ? "" : materials[0].url);
    const [contentIndex, setContentIndex] = useState<number>(0);
    
    useEffect(() => {
        const containerRef = window.document.getElementById("iframe-container");
        if (containerRef) {
            setHeight(containerRef.getBoundingClientRect().height);
            setWidth(containerRef.getBoundingClientRect().width);
        }
    }, []);

    // console.log(content);


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
                            contentId={contentId} 
                            streamId={streamId} 
                            selectedButton={selectedButton}
                            setSelectedButton={setSelectedButton}
                        />
                    </Grid>
                    <Grid item style={{ marginLeft: "auto" }}>
                        <Button
                            aria-label="open preview drawer" 
                            onClick={() => setOpenDrawer()}
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
                <Grid container direction="row">
                    <Grid item xs={10} style={{ paddingRight: "10px" }}>
                        <Select value={contentIndex} fullWidth disabled={materials.length == 0} onChange={(e) => {
                            if (materials.length === 0) { return; }
                            const index = e.target.value as number;
                            setContentIndex(index);
                            setContentId(materials[index].url);
                        }}>
                            {materials.map(({ name, url }, i) => <MenuItem value={i} key={`${name}-${url}`}>{name}</MenuItem>)}
                        </Select>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton aria-label="delete" disabled={materials.length == 0} color="primary" onClick={() => {
                            if (materials.length === 0) { return; }
                            const newIndex = contentIndex ? Math.max(0, contentIndex - 1) : 0;
                            setContentIndex(newIndex);
                            setContentId(materials[newIndex].url);
                        }}>
                            <SkipPreviousTwoToneIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton aria-label="next" disabled={materials.length == 0} color="primary" onClick={() => {
                            if (materials.length === 0) { return; }
                            const newIndex = contentIndex !== undefined ? Math.min(materials.length - 1, contentIndex + 1) : 0;
                            setContentIndex(newIndex);
                            setContentId(materials[newIndex].url);
                        }}>
                            <SkipNextTwoToneIcon />
                        </IconButton>
                    </Grid>
                </Grid>
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
                                                    <Cameras id={session.id} noBackground />
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
                        <RecordedIframe
                            contentId={contentId}
                            setStreamId={setStreamId}
                            parentWidth={width}
                            parentHeight={height}
                            setParentWidth={setWidth}
                            setParentHeight={setHeight}
                        />
                    }
                    { content.type !== "Activity" ? <Toolbar /> : null }
                </Grid>
                { content.type !== "Activity" ? 
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
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }
                    </Grid> : null
                }
            </main>
        </div>
    );
}
