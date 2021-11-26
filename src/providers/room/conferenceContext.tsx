import { useSessionContext } from "../session-context";
import { StreamDescription } from "../WebRTCContext";
import { RoomContext } from "./roomContext";
import {
    AUDIO_GLOBALLY_MUTED_DEFAULT,
    VIDEO_GLOBALLY_MUTED_DEFAULT,
} from "@/config";
import {
    GlobalMuteAudioMutationData,
    GlobalMuteVideoMutationData,
    useGlobalMuteAudioMutation,
    useGlobalMuteVideoMutation,
} from "@/data/sfu/mutations/useGlobalMuteMutation";
import { useGlobalMuteQuery } from "@/data/sfu/queries/useGlobalMuteQuery";
import { FetchResult } from "@apollo/client";
import React,
{
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface ConferenceState {
    audioGloballyMuted: boolean;
    videoGloballyMuted: boolean;
    setGlobalMuteVideo?: (status: boolean) => Promise<FetchResult<GlobalMuteVideoMutationData>>;
    setGlobalMuteAudio?: (status: boolean) => Promise<FetchResult<GlobalMuteAudioMutationData>>;
    inboundStreams: Map<string, StreamDescription>;
    setInboundStreams: React.Dispatch<React.SetStateAction<Map<string, StreamDescription>>>;
}

const ConferenceContext = createContext<ConferenceState>({
    audioGloballyMuted: AUDIO_GLOBALLY_MUTED_DEFAULT,
    videoGloballyMuted: VIDEO_GLOBALLY_MUTED_DEFAULT,
    inboundStreams: new Map<string, StreamDescription>(),
    setInboundStreams: () => console.log(`setInboundStreams not initialized`),
});

interface Props {
    roomId: string;
}

export const ConferenceContextProvider: React.FC<Props> = ({ children, roomId }) => {

    const { sessionId } = useSessionContext();
    const { sessions } = useContext(RoomContext);
    const localSession = sessions.get(sessionId);

    const [ inboundStreams, setInboundStreams ] = useState(new Map<string, StreamDescription>());

    const [ globalMuteAudioMutation ] = useGlobalMuteAudioMutation();
    const [ globalMuteVideoMutation ] = useGlobalMuteVideoMutation();

    const { data: globalMuteData } = useGlobalMuteQuery({
        variables: {
            roomId,
        },
    });

    const audioGloballyMuted = globalMuteData?.retrieveGlobalMute.audioGloballyMuted ?? AUDIO_GLOBALLY_MUTED_DEFAULT;
    const videoGloballyMuted = globalMuteData?.retrieveGlobalMute.videoGloballyDisabled ?? VIDEO_GLOBALLY_MUTED_DEFAULT;

    const setGlobalMuteVideo = (status: boolean) => {
        return globalMuteVideoMutation({
            variables: {
                roomId,
                videoGloballyDisabled: status,
            },
        });
    };

    const setGlobalMuteAudio = (status: boolean) => {
        return globalMuteAudioMutation({
            variables: {
                roomId,
                audioGloballyMuted: status,
            },
        });
    };

    // Temporary enforce global mute on the FE side (KLL-1971)
    const enforceGlobalMute = () => {
        if (videoGloballyMuted) setGlobalMuteVideo(true);
        if (audioGloballyMuted) setGlobalMuteAudio(true);
    };

    useEffect(() => {
        if (!localSession?.isHost) return;
        enforceGlobalMute();
    }, [ inboundStreams.size ]);

    const value = {
        audioGloballyMuted,
        videoGloballyMuted,
        setGlobalMuteVideo,
        setGlobalMuteAudio,
        inboundStreams,
        setInboundStreams,
    };

    return (
        <ConferenceContext.Provider value={value}>
            { children }
        </ConferenceContext.Provider>
    );
};

export const useConferenceContext = () => useContext(ConferenceContext);
