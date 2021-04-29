import { Stream } from "../../../../webRTCState";
import { RoomContext } from "../../../providers/roomContext";
import { ScreenShareContext } from "../../../providers/screenShareProvider";
import { WebRTCContext } from "../../../providers/WebRTCContext";
import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        border: `5px solid gren`,
    },
}));

function Screenshare () {
    const classes = useStyles();
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(WebRTCContext);
    const { content } = useContext(RoomContext);

    /*
    useEffect(()=>{
        console.log(`--------`);
        if(content){
            console.log(webrtc.getAuxStream(content.contentId));
        }
        console.log(`--------`);
    }, [ webrtc ]);
    */

    // Local ScreenShare Stream
    if(screenShare.stream){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid item>
                    <Stream stream={screenShare.stream} />
                </Grid>
            </Grid>
        );
    }

    if(content){
        return(
            <>
            TEST
            </>
            // <Stream stream={webrtc.getAuxStream(content.contentId)} />
        );
    }

    return(null);

}

export default Screenshare;
