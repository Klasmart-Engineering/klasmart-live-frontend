import { ProducerMutationDto } from "../dto/producerMutationDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const PRODUCER = gql`
    mutation producer($params: String!) {
        producer(params: $params)
    }
`;

export const useProducerMutation = (options?: MutationHookOptions<ProducerMutationDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(PRODUCER, {
        ...options,
        client,
    });

    return mutation;
};
