import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

export const useShowContentMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useMutation<void>(MUTATION_SHOW_CONTENT, {
        ...options,
        context: {
            client,
        },
    });
};
