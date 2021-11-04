import { LiveServiceApolloClient } from "./live/liveServiceApolloClient";
import { SfuServiceApolloClient } from "./sfu/sfuServiceApolloClient";
import React, {
    ReactChild,
    ReactChildren,
} from 'react';

type Props = {
    children?: ReactChild | ReactChildren | null;
    token?: string;
    roomId?: string;
    sessionId: string;
}

export function LiveSfuServicesProvider ({
    children, token, roomId, sessionId,
}: Props) {

    return (
        <LiveServiceApolloClient
            token={token}
            sessionId={sessionId}
        >
            <SfuServiceApolloClient
                token={token}
                sessionId={sessionId}
                roomId={roomId}
            >
                {children}
            </SfuServiceApolloClient>
        </LiveServiceApolloClient>
    );
}
