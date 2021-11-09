import {
    GlobalMuteNotification,
    WebRTCContext,
} from "../WebRTCContext";
import { RoomContext } from "./roomContext";
import { useGlobalMuteMutation } from "@/data/sfu/mutations/useGlobalMuteMutation";
import { useGlobalMuteQuery } from "@/data/sfu/queries/useGlobalMuteQuery";
import {
    audioGloballyMutedState,
    videoGloballyMutedState,
} from "@/store/layoutAtoms";
import React,
{
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRecoilState } from "recoil";

interface Props {
    sessionId: string;
    roomId: string;
}

interface ConferenceState {
    audioGloballyMuted: boolean;
    videoGloballyMuted: boolean;
}

const ConferenceContext= createContext<ConferenceState>({
    audioGloballyMuted: true,
    videoGloballyMuted: true,
});

export const ConferenceContextProvider: React.FC<Props> = ({
    children, sessionId, roomId,
}) => {
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const localSession = sessions.get(sessionId);

    const [ audioGloballyMuted, setAudioGloballyMuted ] = useRecoilState(audioGloballyMutedState);
    const [ videoGloballyMuted, setVideoGloballyMuted ] = useRecoilState(videoGloballyMutedState);

    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);

    const [ globalMuteMutation ] = useGlobalMuteMutation();

    const { data: globalMuteData, refetch } = useGlobalMuteQuery({
        variables: {
            roomId,
        },
    });

    useEffect(() => {
        if (!globalMuteData?.retrieveGlobalMute) return;

        setAudioGloballyMuted(globalMuteData.retrieveGlobalMute.audioGloballyMuted);
        setVideoGloballyMuted(globalMuteData.retrieveGlobalMute.videoGloballyDisabled);

    }, [ globalMuteData ]);

    useEffect(() => {
        if (videoGloballyMuted) {
            toggleVideoStates(videoGloballyMuted);
        }
        if (audioGloballyMuted) {
            toggleAudioStates(audioGloballyMuted);
        }
    }, [ audioGloballyMuted, videoGloballyMuted ]);

    useEffect(() => {
        refetch();
    }, [
        roomId,
        localSession?.isHost,
        webrtc?.inboundStreams.size,
    ]);

    async function toggleVideoStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: undefined,
            videoGloballyDisabled: isOn ?? camerasOn,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const videoGloballyDisabled = data?.data?.updateGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled != null) {
            setCamerasOn(!videoGloballyDisabled);
        }
    }

    async function toggleAudioStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: isOn ?? micsOn,
            videoGloballyDisabled: undefined,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const audioGloballyMuted = data?.data?.updateGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted != null) {
            setMicsOn(!audioGloballyMuted);
        }
    }

    return (
        <ConferenceContext.Provider value={{
            audioGloballyMuted,
            videoGloballyMuted,
        }}>
            { children }
        </ConferenceContext.Provider>
    );
};

export const useConferenceContext = () => useContext(ConferenceContext);
