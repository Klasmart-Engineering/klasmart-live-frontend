import { gql } from "@apollo/client";

export const MUTATION_REWARD_TROPHY = gql`
mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
}`;

export const MUTATION_SAVE_FEEDBACK = gql`
mutation saveFeedback($stars: Int!, $feedbackType: FeedbackType!, $comment: String, $quickFeedback: [QuickFeedbackInput]) {
    saveFeedback(stars: $stars, feedbackType: $feedbackType, comment: $comment, quickFeedback: $quickFeedback)
}`;

export const SEND_MESSAGE = gql`
    mutation sendMessage($roomId: ID!, $message: String) {
        sendMessage(roomId: $roomId, message: $message) {
            id,
            message
        }
    }
`;

export const MUTATION_SET_HOST = gql`
    mutation setHost($roomId: ID!, $nextHostId: ID!) {
        setHost(roomId: $roomId, nextHostId: $nextHostId)
    }
`;

export const MUTATION_ENDCLASS = gql`
    mutation endClass {
        endClass
    }
`;

export const MUTATION_LEAVECLASS = gql`
    mutation leaveClass {
        leaveClass
    }
`;

export const MUTATION_SHOW_CONTENT = gql`
    mutation showContent($roomId: ID!, $type: ContentType!, $contentId: ID) {
        showContent(roomId: $roomId, type: $type, contentId: $contentId)
    }
`;

export const ORGANIZATION_BRANDING_QUERY = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            branding{
                iconImageURL
                faviconImageURL
                primaryColor
            }
        }
    }
`;
