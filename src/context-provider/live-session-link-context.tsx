import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import React, { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import Loading from "../components/loading";
import { useWebsocketEndpoint } from "./region-select-context";

export const SESSION_LINK_LIVE = "live";
export const SESSION_LINK_SFU = "sfu";

export interface ILiveSessionContext {
    client?: ApolloClient<unknown>
}

const LiveSessionContext = createContext<ILiveSessionContext>({});

type Props = {
    children?: ReactChild | ReactChildren | null
    token?: string
    roomId?: string
    sessionId: string
}

export function LiveSessionLinkProvider({ children, sessionId, token, roomId }: Props) {
    const [apolloClient, setApolloClient] = useState<ApolloClient<unknown>>();

    const endpointLive = useWebsocketEndpoint("live");
    const endpointSfu = useWebsocketEndpoint("sfu");

    useEffect(() => {
        const liveLink = new WebSocketLink({
            uri: `${endpointLive}/graphql`,
            options: {
                reconnect: true,
                connectionParams: { authToken: token, sessionId },
            },
        });

        const sfuLink = new WebSocketLink({
            uri: `${endpointSfu}/sfu/${roomId}`,
            options: {
                reconnect: true,
                connectionParams: { authToken: token, sessionId },
            },
        });

        const link = new RetryLink().split(
            (operation) => operation.getContext().target === SESSION_LINK_LIVE,
            liveLink, 
            sfuLink
        );

        const client = new ApolloClient({
            cache: new InMemoryCache(), link
        });

        setApolloClient(client);

        return () => {
            client.stop();

            setApolloClient(undefined);
        }
    }, [token, sessionId, endpointLive, endpointSfu, roomId]);

    if (!apolloClient) {
        return (<Loading messageId={"join_live"} />)
    }

    return (
        <ApolloProvider client={apolloClient}>
            <LiveSessionContext.Provider value={{ client: apolloClient }}>
                {children}
            </LiveSessionContext.Provider>
        </ApolloProvider >
    );
}

export const useLiveSessionLink = () => useContext(LiveSessionContext);
