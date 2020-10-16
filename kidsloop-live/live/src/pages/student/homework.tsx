import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { UserContext } from "../../entry";
import { RoomContext } from "../room/room";
import { MaterialTypename } from "../../lessonMaterialContext";
import { RecordedIframe } from "../../components/h5p/recordediframe";
import { ReplicaMedia } from "../../components/media/synchronized-video";
import VideoStream from "../../components/media/videoStream";
import { imageFrame } from "../../utils/layerValues";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import WBToolbar from "../../whiteboard/components/Toolbar";
import { State } from "../../store/store";

import IframeResizer from "iframe-resizer-react";
interface NewProps extends IframeResizer.IframeResizerProps {
    forwardRef: any
}
const IframeResizerNew = IframeResizer as React.FC<NewProps>

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
        }
    }),
);

export default function Homework(): JSX.Element {
    const classes = useStyles();
    const { content } = RoomContext.Consume();
    const { materials } = useContext(UserContext);
    const mats = materials.filter(mat => mat.__typename !== undefined && mat.__typename !== MaterialTypename.Image)
    const contentIndex = useSelector((store: State) => store.control.contentIndex)
    console.log("content: ", content)
    console.log("mats: ", mats)

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // TODO
    // useEffect(() => {
    //     if (!iframeRef.current) { return; }
    //     iframeRef.current.onload = (e) => {
    //         if (!iframeRef.current || !iframeRef.current.contentDocument) { return; }
    //         const H5P = (iframeRef.current.contentWindow as any).H5P;
    //         handleH5PStep(H5P);
    //     };
    // }, [contentIndex]);

    // function handleH5PStep(H5P: any) {
    //     H5P.externalDispatcher.on("xAPI", (event: any) => {
    //         // console.log("event: ", event);

    //         const verb = event.getVerb();
    //         const result = event.data.statement.result;
    //         // console.log("verb: ", verb)
    //         // console.log("result: ", result)
    //     });
    // }

    return (
        <div className={classes.root}>
            <IframeResizerNew
                forwardRef={iframeRef}
                src={mats[contentIndex].url}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    )
}
