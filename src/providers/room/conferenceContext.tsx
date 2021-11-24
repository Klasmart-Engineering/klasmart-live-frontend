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
} from "react";

interface ConferenceState {
    audioGloballyMuted: boolean;
    videoGloballyMuted: boolean;
    toggleVideoStates?: () => Promise<FetchResult<GlobalMuteVideoMutationData>>;
    toggleAudioStates?: () => Promise<FetchResult<GlobalMuteAudioMutationData>>;
}

const ConferenceContext = createContext<ConferenceState>({
    audioGloballyMuted: AUDIO_GLOBALLY_MUTED_DEFAULT,
    videoGloballyMuted: VIDEO_GLOBALLY_MUTED_DEFAULT,
});

interface Props {
    roomId: string;
}

export const ConferenceContextProvider: React.FC<Props> = ({ children, roomId }) => {

    const [ globalMuteAudioMutation ] = useGlobalMuteAudioMutation();
    const [ globalMuteVideoMutation ] = useGlobalMuteVideoMutation();

    const { data: globalMuteData } = useGlobalMuteQuery({
        variables: {
            roomId,
        },
    });

    const audioGloballyMuted = globalMuteData?.retrieveGlobalMute.audioGloballyMuted ?? AUDIO_GLOBALLY_MUTED_DEFAULT;
    const videoGloballyMuted = globalMuteData?.retrieveGlobalMute.videoGloballyDisabled ?? VIDEO_GLOBALLY_MUTED_DEFAULT;

    const toggleVideoStates = () => {
        return globalMuteVideoMutation({
            variables: {
                roomId,
                videoGloballyDisabled: !videoGloballyMuted,
            },
        });
    };

    const toggleAudioStates = () => {
        return globalMuteAudioMutation({
            variables: {
                roomId,
                audioGloballyMuted: !audioGloballyMuted,
            },
        });
    };

    const value = {
        audioGloballyMuted,
        videoGloballyMuted,
        toggleAudioStates,
        toggleVideoStates,
    };

    return (
        <ConferenceContext.Provider value={value}>
            { children }
        </ConferenceContext.Provider>
    );
};

export const useConferenceContext = () => useContext(ConferenceContext);
