import { StyledVideo } from "@/components/interactiveContent/styledVideo";
import { RoomContext } from "@/providers/roomContext";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import { WebRTCContext } from "@/providers/WebRTCContext";
import { isGlobalActionsOpenState } from "@/store/layoutAtoms";
import {
    Button,
    Grid,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        textAlign: `center`,
    },
    icon:{
        color: theme.palette.text.primary,
        "& svg": {
            fontSize: `3rem`,
        },
    },
    button:{},
    relative:{
        position: `relative`,
    },
}));

function Screenshare () {
    const classes = useStyles();
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(WebRTCContext);
    const { content } = useContext(RoomContext);

    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);

    const screenshareVideo = screenShare.stream ? screenShare.stream : content && webrtc.getAuxStream(content?.contentId);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    // Local ScreenShare Stream
    if(screenshareVideo){
        return(
            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    style={{
                        width: `100%`,
                    }}>
                    {screenShare.stream ? (
                        <Grid
                            container
                            justifyContent="center">
                            <Grid
                                item
                                xs={6}>
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
                                            onClick={() => {screenShare.stop(); setIsGlobalActionsOpen(false);}}
                                        >Stop presenting</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                className={classes.relative}
                                hidden={isMdDown}
                            >
                                <StyledVideo stream={screenshareVideo} />
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
