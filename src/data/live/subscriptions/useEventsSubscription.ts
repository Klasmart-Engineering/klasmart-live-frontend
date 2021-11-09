import { ReadEventDto } from "../dto/readEventDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUB_EVENTS = gql`
  subscription stream($streamId: ID!) {
    stream(streamId: $streamId) {
      id,
      event
    }
  }
`;

export const useEventsSubscription = (options?: SubscriptionHookOptions<ReadEventDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadEventDto>(SUB_EVENTS, {
        ...options,
        client,
    });
};
