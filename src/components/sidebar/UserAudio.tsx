import { useSessions } from '@/data/live/state/useSessions';
import { Session } from '@/pages/utils';
import { useSessionContext } from '@/providers/session-context';
import { useStream } from '@kl-engineering/live-state/ui';
import React,
{
    useEffect,
    useRef,
} from 'react';

interface UserAudio extends Omit<React.MediaHTMLAttributes<HTMLVideoElement>, "onLoad"> {
    user: Session;
}

const UserAudio = ({ user, ...rest }: UserAudio) => {
    const mediaRef = useRef<HTMLVideoElement>(null);
    const { stream: mediaStream } = useStream(user.id);
    const mySession = useSessionContext();
    const isSelf = (user.id === mySession.sessionId);
    const sessions = useSessions();
    const userSession = sessions.get(user.id);

    useEffect(() => {
        if(!mediaRef.current) { return; }
        mediaRef.current.srcObject = mediaStream ?? null;
    }, [ mediaStream ]);

    return (
        <video
            ref={mediaRef}
            autoPlay
            playsInline
            hidden
            muted={isSelf}
            id={`audio:${userSession?.id}`}
            {...rest}
        />
    );
};

export default UserAudio;
