import { UpdateMuteDto } from "../dto/updateMuteDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

export const MUTE = gql`
    mutation mute($roomId: String!, $sessionId: String!, $audio: Boolean, $video: Boolean) {
        mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video) {
            roomId,
            sessionId,
            audio,
            video,
        }
    }
`;

export const useMuteMutation = (options?: MutationHookOptions<UpdateMuteDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(MUTE, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
