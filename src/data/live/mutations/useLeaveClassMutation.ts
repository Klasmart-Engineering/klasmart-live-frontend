import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_LEAVECLASS = gql`
    mutation leaveClass {
        leaveClass
    }
`;

export const useLeaveClassMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(MUTATION_LEAVECLASS, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
