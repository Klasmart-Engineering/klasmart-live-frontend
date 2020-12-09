import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import React, { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import Loading from "../components/loading";
import { useWebsocketEndpoint } from "./region-select-context";

export interface ILiveSessionContext { 
    client?: ApolloClient<unknown>
}

const LiveSessionContext = createContext<ILiveSessionContext>({});

type Props = {
    children?: ReactChild | ReactChildren | null
    token?: string
    sessionId: string
}

export function LiveSessionLinkProvider({ children, sessionId, token }: Props) {
    const [apolloClient, setApolloClient] = useState<ApolloClient<unknown>>();

    const endpoint = useWebsocketEndpoint("live");

    useEffect(() => {
        const subscriptionClient = new SubscriptionClient(endpoint, {
            reconnect: true,
            connectionParams: {
                authToken: token,
                sessionId
            }
        });

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new WebSocketLink(subscriptionClient)
        });

        setApolloClient(client);

        return () => {
            client.stop();
            subscriptionClient.close();

            setApolloClient(undefined);
        }
    }, [token, sessionId, endpoint]);

    if (!apolloClient) {
        return (<Loading rawText={"Joining live..."} />)
    }

    // TODO: Any way to prevent having to do apolloClient as any when providing the client prop?

    return (
        <ApolloProvider client={apolloClient as any}>
            <LiveSessionContext.Provider value={{client: apolloClient}}>
                {children}
            </LiveSessionContext.Provider>
        </ApolloProvider >
    );
}

export const useLiveSessionLink = () => useContext(LiveSessionContext);
