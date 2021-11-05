import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const TRANSPORT = gql`
    mutation transport($producer: Boolean!, $params: String!) {
        transport(producer: $producer, params: $params)
    }
`;

export const useTransportMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(TRANSPORT, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
