import { CircularProgress, Grid, Hidden, Paper, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../app";
import { Player } from "../components/player";
import { PreviewPlayer } from "../components/preview-player";
import { RecordedIframe } from "../components/recordediframe";
import { Messages } from "../messages";
import { Content, Message } from "../room";
import { SendMessage } from "../sendMessage";
import { Cameras } from "../webRTCState";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iframeContainer: {
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            // paddingTop: '56.25%',
            margin: "0 auto",
            // width: '85%',
            // height: '85%'
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
            height: 240,
            padding: theme.spacing(2),
        },
    }),
);

interface Props {
    content: Content;
    messages: Map<string, Message>;
}

export function Student(props: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const classes = useStyles();

    const { content, messages } = props;
    const { name } = useContext(UserContext);
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");
    const [maxWidth, setMaxWidth] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);

    useEffect(() => {
        const containerRef = window.document.getElementById("player-container");
        if (containerRef) {
            setWidth(containerRef.getBoundingClientRect().width);
            setHeight(containerRef.getBoundingClientRect().width * 0.5625);
            setMaxHeight(containerRef.getBoundingClientRect().height);
            setMaxWidth(containerRef.getBoundingClientRect().width);
        }
    }, []);

    switch (content.type) {
    case "Blank":
        return (
            <Grid container>
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
                                <Typography><FormattedMessage id={"live_hello"} values={{ name }} /></Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <CircularProgress />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <SendMessage />
                <Messages messages={messages} />
            </Grid>
        );
    case "Stream":
        return (
            <Grid container>
                {/* <Grid
                        id="player-container"
                        className={classes.iframeContainer}
                        style={{ border: '5px solid green', width, height }}
                    >
                        <Player
                            streamId={content.contentId}
                            parentWidth={width}
                            parentHeight={height}
                            setParentWidth={setWidth}
                            setParentHeight={setHeight}
                        />

                </Grid> */}
                <Grid item xs={12} md={8} style={{ height, width, margin: "0 auto", border: "5px solid green" }}>
                    <PreviewPlayer streamId={content.contentId} height={typeof height === "string" ? 700 : height} width={typeof width === "string" ? 700 : width} />
                </Grid>
                <Hidden mdDown>
                    <Grid item md={4}>
                        <Cameras />
                    </Grid>
                </Hidden>
                <Grid item xs={12}>
                    <SendMessage />
                    <Messages messages={messages} />
                </Grid>
            </Grid>
        );
    case "Activity":
        return (
            <>
                <Grid
                    id="iframe-container"
                    className={classes.iframeContainer}
                    style={{ border: "5px solid rgb(200,0,0)", width: 800, height: 800 }}
                >
                    <RecordedIframe
                        contentId={content.contentId}
                        frameProps={{ width: "100%", height: "100%" }}
                    />

                </Grid>
                <SendMessage />
                <Messages messages={messages} />
            </>
        );
    }
}
