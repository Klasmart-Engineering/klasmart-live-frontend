import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const CONSUMER = gql`
    mutation consumer($id: String!, $pause: Boolean) {
        consumer(id: $id, pause: $pause)
    }
`;

export const useConsumerMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(CONSUMER, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
