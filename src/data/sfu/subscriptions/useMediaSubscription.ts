import { ReadMediaDto } from "../dto/readMediaDto";
import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";

const SUBSCRIBE = gql`
    subscription media($roomId: ID!) {
        media(roomId: $roomId) {
            rtpCapabilities,
            producerTransport,
            consumerTransport,
            consumer,
            stream {
                id,
                sessionId,
                producerIds,
            },
            mute {
                roomId,
                sessionId,
                audio,
                video,
            },
        }
    }
`;

export const useMediaSubscription = (options?: SubscriptionHookOptions<ReadMediaDto, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    return useSubscription<ReadMediaDto>(SUBSCRIBE, {
        ...options,
        context: {
            client,
        },
    });
};
