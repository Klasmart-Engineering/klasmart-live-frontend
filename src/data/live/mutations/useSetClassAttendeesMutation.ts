import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

export const MUTATION_SET_CLASS_ATTENDEES = gql`
mutation setClassAttendees($roomId: ID!, $userIds: [String]) {
    setClassAttendees(roomId: $roomId, userIds: $userIds)
}`;

export const useSetClassAttendeesMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useMutation(MUTATION_SET_CLASS_ATTENDEES, {
        ...options,
        client,
    });
};
