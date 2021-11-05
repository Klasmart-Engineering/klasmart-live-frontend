import { UpdateGlobalMuteDto } from "../dto/updateGlobalMuteDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
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

export const useGlobalMuteMutation = (options?: MutationHookOptions<UpdateGlobalMuteDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(GLOBAL_MUTE_MUTATION, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
