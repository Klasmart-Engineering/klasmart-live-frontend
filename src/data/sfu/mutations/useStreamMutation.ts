import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const STREAM = gql`
    mutation stream($id: String!, $producerIds: [String]!) {
        stream(id: $id, producerIds: $producerIds)
    }
`;

export const useStreamMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(STREAM, {
        ...options,
        client,
    });

    return mutation;
};
