import { ReadStreamDto } from "../dto/readStreamDto";
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

export const useStreamSubscription = (options?: SubscriptionHookOptions<ReadStreamDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadStreamDto>(SUB_EVENTS, {
        ...options,
        client,
    });
};
