import { QueryIndividualMuteDto } from "../dto/queryIndividualMuteDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useQuery,
} from "@apollo/client";

export const INDIVIDUAL_MUTE_QUERY = gql`
    query retrieveMuteStatuses {
        retrieveMuteStatuses {
            roomId,
            sessionId,
            audio,
            video,
        }
    }
`;

export const useIndividualMuteQuery = (options?: MutationHookOptions<QueryIndividualMuteDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useQuery(INDIVIDUAL_MUTE_QUERY, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
