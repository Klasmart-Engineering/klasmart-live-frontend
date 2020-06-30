import { Grid, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "../app";
import { Player } from "../components/player";
import { RecordedIframe } from "../components/recordediframe";
import { Content } from "../room";

const useStyles = makeStyles(() =>
    createStyles({
        iframeContainer: {
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            margin: "0 auto",
        },
    }),
);

interface Props { content: Content; }
export function Student({ content }: Props): JSX.Element {

    const classes = useStyles();
    const { name } = useContext(UserContext);
    const [width, setWidth] = useState<string | number>("100%");
    const [height, setHeight] = useState<string | number>("100%");

    useEffect(() => {
        const containerRef = window.document.getElementById("player-container");
        if (containerRef) {
            setWidth(containerRef.getBoundingClientRect().width);
            setHeight(containerRef.getBoundingClientRect().width * 0.5625);
        }
    }, []);

    switch (content.type) {
    case "Blank":
        return <>
            <Typography><FormattedMessage id={"live_hello"} values={{ name }} /></Typography>
            <Typography><FormattedMessage id={"live_waitingForClass"} /></Typography>
        </>;
    case "Stream":
        return <Grid
            id="player-container"
            className={classes.iframeContainer}
            style={{ border: "5px solid green", width, height }}
        >
            <Player
                streamId={content.contentId}
                parentWidth={width}
                parentHeight={height}
                setParentWidth={setWidth}
                setParentHeight={setHeight}
            />
        </Grid>;
    case "Activity":
        return (
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
        );
    }
}
