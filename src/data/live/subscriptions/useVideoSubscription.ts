import { ReadVideoDto } from "../dto/readVideoDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const VIDEO_SUBSCRIPTION = gql`
      subscription video($roomId: ID!, $sessionId: ID!) {
        video(roomId: $roomId, sessionId: $sessionId) {
          src
          play
          offset
        }
      }
    `;

export const useVideoSubscription = (options?: SubscriptionHookOptions<ReadVideoDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadVideoDto>(VIDEO_SUBSCRIPTION, {
        ...options,
        context: {
            client,
        },
    });
};
