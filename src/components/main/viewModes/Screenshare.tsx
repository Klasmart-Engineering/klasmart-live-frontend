import { StyledVideo } from "@/components/interactiveContent/styledVideo";
import { useContent } from "@/data/live/state/useContent";
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
import { FormattedMessage } from "react-intl";
import { useSetRecoilState } from "recoil";

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
    const content = useContent();

    const teacherStream = screenShare.stream;
    const studentStream = content && webrtc.getAuxStream(content.contentId);

    return(
        <Grid
            container
            className={classes.root}>
            <Grid
                item
                xs={12}>
                { teacherStream ? <ScreenshareTeacher stream={teacherStream} /> : <ScreenshareStudent stream={studentStream} /> }
            </Grid>
        </Grid>
    );
}

export default Screenshare;

function ScreenshareTeacher (props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>) {
    const { stream } = props;
    const classes = useStyles();
    const screenShare = useContext(ScreenShareContext);

    const setIsGlobalActionsOpen = useSetRecoilState(isGlobalActionsOpenState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const stopScreenSharing = () => {
        screenShare.stop();
        setIsGlobalActionsOpen(false);
    };

    return(
        <Grid
            container
            justifyContent="center">
            <Grid
                item
                xs={6}>
                <Grid
                    container
                    direction="column"
                    spacing={3}>
                    <Grid item>
                        <div className={classes.icon}>
                            <PresentToAllIcon />
                        </div>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">
                            <FormattedMessage id="screenShare.presenting" />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { stopScreenSharing(); }}
                        >
                            <FormattedMessage id="screenShare.stop" />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={6}
                className={classes.relative}
                hidden={isMdDown}>
                <StyledVideo stream={stream} />
            </Grid>
        </Grid>
    );
}

function ScreenshareStudent (props: { stream?: MediaStream } & React.VideoHTMLAttributes<HTMLMediaElement>) {
    const { stream } = props;
    return <StyledVideo stream={stream} />;
}
