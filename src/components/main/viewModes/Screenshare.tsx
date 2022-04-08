/* eslint-disable react/no-multi-comp */
import { StyledVideo } from "@/components/interactiveContent/styledVideo";
import { InteractiveMode } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    interactiveModeState,
    isGlobalActionsOpenState,
} from "@/store/layoutAtoms";
import {
    useMediaStreamTracks,
    useScreenshare,
    useStream,
} from "@kl-engineering/live-state/ui";
import {
    Box,
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
{
    useEffect,
    VoidFunctionComponent,
} from "react";
import { FormattedMessage } from "react-intl";
import { useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        color: theme.palette.text.primary,
        "& svg": {
            fontSize: `3rem`,
        },
    },
    screenshareViewVideo: {
        position: `absolute`,
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
    },
}));

const Screenshare: VoidFunctionComponent<{
    sessionId: string;
}> = ({ sessionId }) => {
    const { sessionId: mySessionId } = useSessionContext();
    return(
        <Box
            height="100%"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            position="relative"
        >
            {sessionId === mySessionId
                ? <ScreensharePresent />
                : <ScreenshareView sessionId={sessionId} />
            }
        </Box>
    );
};

export default Screenshare;

const ScreensharePresent: VoidFunctionComponent = () => {
    const classes = useStyles();

    const setInteractiveMode = useSetRecoilState(interactiveModeState);
    const setIsGlobalActionsOpen = useSetRecoilState(isGlobalActionsOpenState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const screenshare = useScreenshare();

    const stopScreenshare = () => {
        screenshare.setSending.execute(false);
        setInteractiveMode(InteractiveMode.ONSTAGE);
        setIsGlobalActionsOpen(false);
    };

    useEffect(() => {
        if (!screenshare.track) return;
        screenshare.track.onended = () => {
            stopScreenshare();
        };
    }, [ screenshare.track ]);

    const stream = useMediaStreamTracks(screenshare.track);
    return(
        <Grid
            container
            justifyContent="center"
            spacing={4}
            xs={12}
        >
            <Grid
                item
                xs={6}
            >
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
                hidden={isMdDown}
            >
                <StyledVideo stream={stream} />
            </Grid>
        </Grid>
    );
};

const ScreenshareView: VoidFunctionComponent<{
    sessionId: string;
}> = ({ sessionId }) => {
    const classes = useStyles();
    const { stream } = useStream(sessionId, `screenshare`);
    return (
        <StyledVideo
            stream={stream}
            className={classes.screenshareViewVideo}
        />
    );
};
