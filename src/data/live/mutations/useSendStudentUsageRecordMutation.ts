import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const MUTATION_SEND_STUDENT_USAGE_RECORD_EVENT = gql`
    mutation sendStudentUsageRecordEvent($roomId: ID!, $materialUrl: String, $activityTypeName: String){
        studentReport(roomId: $roomId, materialUrl: $materialUrl, activityTypeName: $activityTypeName)
    }
`;

export const useSendStudentUsageRecordMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useMutation<void>(MUTATION_SEND_STUDENT_USAGE_RECORD_EVENT, {
        ...options,
        context: {
            client,
        },
    });
};
