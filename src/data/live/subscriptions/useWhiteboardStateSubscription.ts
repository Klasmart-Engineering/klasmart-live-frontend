import { ReadWhiteboardStateDto } from "../dto/readWhiteboardStateDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUBSCRIBE_WHITEBOARD_STATE = gql`
  subscription whiteboardState($roomId: ID!) {
      whiteboardState(roomId: $roomId) {
          display
      }
  }`;

export const useWhiteboardStateSubscription = (options?: SubscriptionHookOptions<ReadWhiteboardStateDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadWhiteboardStateDto>(SUBSCRIBE_WHITEBOARD_STATE, {
        ...options,
        context: {
            client,
        },
    });
};
