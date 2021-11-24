import { GLOBAL_MUTE_QUERY } from "@/data/sfu/queries/useGlobalMuteQuery";
import { useSfuServiceApolloClient } from "@/data/sfu/sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    useMutation,
} from "@apollo/client";

export const GLOBAL_MUTE_MUTATION = gql`
    mutation updateGlobalMute($roomId: String!, $audioGloballyMuted: Boolean, $videoGloballyDisabled: Boolean) {
        updateGlobalMute(roomId: $roomId, audioGloballyMuted: $audioGloballyMuted, videoGloballyDisabled: $videoGloballyDisabled) {
            roomId,
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;

export interface GlobalMuteVideoMutationVariables {
    roomId: string;
    videoGloballyDisabled: boolean;
}

export interface GlobalMuteVideoMutationData {
    updateGlobalMute: {
        roomId: string;
        videoGloballyDisabled: boolean;
    };
}

export const useGlobalMuteVideoMutation = (options?: MutationHookOptions<GlobalMuteVideoMutationData, GlobalMuteVideoMutationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(GLOBAL_MUTE_MUTATION, {
        ...options,
        client,
        refetchQueries: [ GLOBAL_MUTE_QUERY ],
    });

    return mutation;
};

export interface GlobalMuteAudioMutationVariables {
    roomId: string;
    audioGloballyMuted: boolean;
}

export interface GlobalMuteAudioMutationData {
    updateGlobalMute: {
        roomId: string;
        audioGloballyMuted: boolean;
    };
}

export const useGlobalMuteAudioMutation = (options?: MutationHookOptions<GlobalMuteAudioMutationData, GlobalMuteAudioMutationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(GLOBAL_MUTE_MUTATION, {
        ...options,
        client,
        refetchQueries: [ GLOBAL_MUTE_QUERY ],
    });

    return mutation;
};
