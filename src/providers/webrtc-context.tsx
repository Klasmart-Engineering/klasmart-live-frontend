import { WebRtcProvider } from "@kl-engineering/live-state/ui";
import React, {
    ReactChild,
    ReactChildren,
} from "react";

type Props = {
    children: ReactChild | ReactChildren | null;
    enabled: boolean;
    sessionId: string;
    endpoint: URL;
    schedule: any;
    actions: any;
}

export function WebRtcConditionalProvider ({
    children, enabled, sessionId, endpoint, schedule, actions,
}: Props) {
    if(!enabled){
        return (<>{ children }</>);
    }

    return (
        <WebRtcProvider
            key={sessionId}
            sessionId={sessionId}
            endpoint={endpoint}
            onAuthorizationExpired={schedule}
            onAuthorizationInvalid={schedule}
            onAuthenticationInvalid={actions?.refreshAuthenticationToken}
            onAuthenticationExpired={actions?.refreshAuthenticationToken}
            onTokenMismatch={schedule}
        >
            { children }
        </WebRtcProvider>
    );
}
