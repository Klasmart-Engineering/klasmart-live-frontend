import GlobalMuteOverlay from '@/components/globalMuteOverlay';
import { useSessions } from '@/data/live/state/useSessions';
import { useSessionContext } from '@/providers/session-context';
import {
    useCamera,
    useMicrophone,
} from '@kl-engineering/live-state/ui';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    container: {
        alignItems: `center`,
        display: `flex`,
        justifyContent: `space-evenly`,
        position: `absolute`,
        height: `100%`,
        width: `100%`,
        pointerEvents: `none`,
    },
}));

interface Props {

}

export default function GlobalMuteProvider (props: Props) {
    const classes = useStyles();

    const { sessionId } = useSessionContext();

    const camera = useCamera();
    const microphone = useMicrophone();
    const isCameraPausedGlobally = camera.isPausedGlobally;
    const isMicrophonePausedGlobally = microphone.isPausedGlobally;

    const sessions = useSessions();
    const localSession = sessions.get(sessionId);

    if(localSession?.isHost) return null;

    return (
        <div className={classes.container}>
            <GlobalMuteOverlay
                isCameraPausedGlobally={isCameraPausedGlobally}
                isMicrophonePausedGlobally={isMicrophonePausedGlobally}
            />
        </div>
    );
}
