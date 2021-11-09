import { ReadRoomDto } from "../dto/readRoomDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
            message { id, message, session { name, isTeacher } },
            content { type, contentId },
            join { id, name, streamId, isTeacher, isHost, joinedAt },
            leave { id },
            session { webRTC { sessionId, description, ice, stream { name, streamId } } },
            sfu,
            trophy { from, user, kind },
        }
    }
`;

export const useRoomSubscription = (options?: SubscriptionHookOptions<ReadRoomDto, OperationVariables>) => {
    const { client } = useLiveServiceApolloClient();

    return useSubscription<ReadRoomDto>(SUB_ROOM, {
        ...options,
        client,
    });
};
