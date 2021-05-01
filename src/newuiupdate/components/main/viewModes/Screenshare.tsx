import { LocalSessionContext } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import { ScreenShareContext } from "../../../providers/screenShareProvider";
import { WebRTCContext } from "../../../providers/WebRTCContext";
import UserCamera from "../../userCamera/userCamera";
import { StyledVideo } from "../../utils/styledVideo";
import {
    Button,
    Grid, makeStyles, Theme, Typography,
} from "@material-ui/core";
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import React, {
    useContext, useEffect, useRef,
} from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        border: `5px solid gren`,
        textAlign: `center`,
    },
    icon:{
        color: theme.palette.text.primary,
        "& svg": {
            fontSize: `3rem`,
        },
    },
    button:{},
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
                    {screenShare.stream ? (
                        <Grid
                            container
                            direction="column"
                            spacing={3}
                        >
                            <Grid item>
                                <div className={classes.icon}>
                                    <PresentToAllIcon />
                                </div>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Your are presenting to everyone</Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => screenShare.stop()}
                                >Stop presenting</Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <StyledVideo stream={screenshareVideo} />
                        </>
                    )}
                </Grid>
            </Grid>
        );
    }

    return(null);

}

export default Screenshare;
