import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const SEND_VIDEO_MESSAGE = gql`
      mutation sendMessage(
        $roomId: ID!
        $sessionId: ID!
        $src: String
        $play: Boolean
        $offset: Float
      ) {
        video(
          roomId: $roomId
          sessionId: $sessionId
          src: $src
          play: $play
          offset: $offset
        )
      }
    `;

export const useSendVideoMessageMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    const mutation = useMutation(SEND_VIDEO_MESSAGE, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
