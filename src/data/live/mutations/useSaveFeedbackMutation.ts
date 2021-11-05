import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_SAVE_FEEDBACK = gql`
mutation saveFeedback($stars: Int!, $feedbackType: FeedbackType!, $comment: String, $quickFeedback: [QuickFeedbackInput]) {
    saveFeedback(stars: $stars, feedbackType: $feedbackType, comment: $comment, quickFeedback: $quickFeedback)
}`;

export const useSaveFeedbackMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(MUTATION_SAVE_FEEDBACK, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
