import { gql } from "@apollo/client";

export const MUTATION_REWARD_TROPHY = gql`
mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
}`;

export const SEND_MESSAGE = gql`
    mutation sendMessage($roomId: ID!, $message: String) {
        sendMessage(roomId: $roomId, message: $message) {
            id,
            message
        }
    }
`;

// TODO : NOT USED YET
export const MUTATION_SET_HOST = gql`
    mutation setHost($roomId: ID!, $hostId: ID!) {
        setHost(roomId: $roomId, hostId: $hostId)
    }
`;

export const SUBSCRIPTION_ENDCLASS = gql`
    subscription endClass($roomId: ID!) {
        endClass(roomId: $roomId) {
            endClass
        }
    }
`;

export const MUTATION_ENDCLASS = gql`
    mutation endClass {
        endClass
    }
`;

export const MUTATION_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;
