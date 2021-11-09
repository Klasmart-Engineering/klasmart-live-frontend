import { ReadWhiteboardEventsDto } from "../dto/readWhiteboardEventsDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUBSCRIBE_WHITEBOARD_EVENTS = gql`
  subscription whiteboardEvents($roomId: ID!) {
    whiteboardEvents(roomId: $roomId) {
      type
      id
      generatedBy
      objectType
      param
    }
  }
`;

export const useWhiteboardEventsSubscription = (options?: SubscriptionHookOptions<ReadWhiteboardEventsDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadWhiteboardEventsDto>(SUBSCRIBE_WHITEBOARD_EVENTS, {
        ...options,
        client,
    });
};
