import { useSfuServiceApolloClient } from "../sfuServiceApolloClient";
import {
    gql,
    MutationHookOptions,
    OperationVariables,
    useMutation,
} from "@apollo/client";

const SEND_RTP_CAPABILITIES = gql`
    mutation rtpCapabilities($rtpCapabilities: String!) {
        rtpCapabilities(rtpCapabilities: $rtpCapabilities)
    }
`;

export const useSendRtpCapabilitiesMutation = (options?: MutationHookOptions<void, OperationVariables>) => {
    const { client } = useSfuServiceApolloClient();

    const mutation = useMutation(SEND_RTP_CAPABILITIES, {
        ...options,
        context: {
            client,
        },
    });

    return mutation;
};
