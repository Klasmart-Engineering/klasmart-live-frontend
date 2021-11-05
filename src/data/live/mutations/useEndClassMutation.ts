import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_ENDCLASS = gql`
    mutation endClass {
        endClass
    }
`;

export const useEndClassMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(MUTATION_ENDCLASS, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
