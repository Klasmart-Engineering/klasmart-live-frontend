import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const WHITEBOARD_SEND_DISPLAY = gql`
  mutation whiteboardSendDisplay($roomId: ID!, $display: Boolean) {
      whiteboardSendDisplay(roomId: $roomId, display: $display)
  }
`;

export const useWhiteboardDisplayMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(WHITEBOARD_SEND_DISPLAY, {
        ...options,
        client,
    });

    return mutation;
};
