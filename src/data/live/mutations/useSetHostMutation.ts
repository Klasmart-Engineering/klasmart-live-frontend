import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_SET_HOST = gql`
    mutation setHost($roomId: ID!, $nextHostId: ID!) {
        setHost(roomId: $roomId, nextHostId: $nextHostId)
    }
`;

export const useSetHostMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(MUTATION_SET_HOST, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
