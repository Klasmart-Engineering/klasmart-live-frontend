import { ReadWhiteboardPermissionsDto } from "../dto/readWhiteboardPermissionsDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUBSCRIBE_WHITEBOARD_PERMISSIONS = gql`
  subscription whiteboardPermissions($roomId: ID! $userId: ID!) {
      whiteboardPermissions(roomId: $roomId, userId: $userId)
  }`;

export const useWhiteboardPermissionsSubscription = (options?: SubscriptionHookOptions<ReadWhiteboardPermissionsDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadWhiteboardPermissionsDto>(SUBSCRIBE_WHITEBOARD_PERMISSIONS, {
        ...options,
        context: {
            client,
        },
    });
};
