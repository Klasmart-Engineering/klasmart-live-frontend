import { QueryGlobalMuteDto } from "../dto/queryGlobalMuteDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    OperationVariables,
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

const GLOBAL_MUTE_QUERY = gql`
    query retrieveGlobalMute($roomId: String!) {
        retrieveGlobalMute(roomId: $roomId) {
            roomId,
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;

export const useGlobalMuteQuery = (options?: QueryHookOptions<QueryGlobalMuteDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const query = useQuery<QueryGlobalMuteDto>(GLOBAL_MUTE_QUERY, {
        ...options,
        context: {
            client,
        },
    });

    return query;
};
