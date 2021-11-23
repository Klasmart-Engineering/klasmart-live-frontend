import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";
import { useSessionContext } from "@/providers/session-context";

const SEND_MESSAGE = gql`
    mutation sendMessage($roomId: ID!, $message: String) {
        sendMessage(roomId: $roomId, message: $message) {
            id,
            message
        }
    }`;

export const useSendMessageMutation = () => {
    const { roomId } = useSessionContext();
    const { client } = useLiveServiceApolloClient();

    const [sendMessage] = useMutation(SEND_MESSAGE, { client });

    return (text: string) => sendMessage({
        variables: {
            roomId,
            message: text,
        },
    })
};
