import { StyledVideo } from "@/components/interactiveContent/styledVideo";
import Loading from "@/components/loading";
import { InteractiveMode } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    interactiveModeState,
    isGlobalActionsOpenState,
} from "@/store/layoutAtoms";
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
import {
    useMediaStreamTracks,
    useScreenshare,
    useStream,
} from "kidsloop-live-state/ui";
import React,
{
    useEffect,
    VoidFunctionComponent,
} from "react";
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

const Screenshare: VoidFunctionComponent<{
    sessionId: string;
}> = ({ sessionId }) => {
    const classes = useStyles();
    const { sessionId: mySessionId } = useSessionContext();
    return(
        <Grid
            container
            className={classes.root}>
            <Grid
                item
                xs={12}
            >
                {
                    sessionId === mySessionId
                        ? <ScreensharePresent />
                        : <ScreenshareView sessionId={sessionId} />
                }
            </Grid>
        </Grid>
    );
};

export default Screenshare;

const ScreensharePresent: VoidFunctionComponent<{}>  = () => {
    const classes = useStyles();

    const setInteractiveMode = useSetRecoilState(interactiveModeState);
    const setIsGlobalActionsOpen = useSetRecoilState(isGlobalActionsOpenState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const screenshare = useScreenshare();
    useEffect(() => {
        screenshare.setSending.execute(true);
        return () => { screenshare.setSending.execute(false); };
    }, []);

    const stopScreenshare = () => {
        screenshare.setSending.execute(false);
        setInteractiveMode(InteractiveMode.ONSTAGE);
        setIsGlobalActionsOpen(false);
    };

    const stream = useMediaStreamTracks(screenshare.track);
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
                            onClick={stopScreenshare}
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
                hidden={isMdDown}
            >
                <StyledVideo stream={stream} />
            </Grid>
        </Grid>
    );
};

const ScreenshareView: VoidFunctionComponent<{
    sessionId: string;
}>  = ({ sessionId }) => {
    const { stream } = useStream(sessionId, `screenshare`);
    return (
        <StyledVideo stream={stream} />
    );
};
