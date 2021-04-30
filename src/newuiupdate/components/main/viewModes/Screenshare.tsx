import { LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import { ScreenShareContext } from "../../../providers/screenShareProvider";
import { WebRTCContext } from "../../../providers/WebRTCContext";
import UserCamera from "../../userCamera/userCamera";
import { StyledVideo } from "../../utils/styledVideo";
import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import React, {
    useContext, useEffect, useRef,
} from "react";

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
    const { content, sessions } = useContext(RoomContext);

    const screenshareVideo = screenShare.stream ? screenShare.stream : content && webrtc.getAuxStream(content?.contentId);

    // Local ScreenShare Stream
    if(screenshareVideo){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid item>
                    <StyledVideo stream={screenshareVideo} />
                </Grid>
            </Grid>
        );
    }

    return(<div>TEST</div>);

}

export default Screenshare;
