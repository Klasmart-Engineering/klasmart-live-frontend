import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import React, { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from "react";
import Loading from "../components/loading";


export interface ILiveSessionContext { 
    client?: ApolloClient<unknown>
}

const LiveSessionContext = createContext<ILiveSessionContext>({});

type Props = {
    children?: ReactChild | ReactChildren | null
    token?: string
    endpoint: string
    sessionId: string
}

// process.env.ENDPOINT_WEBSOCKET || `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/graphql`,
export function LiveSessionLinkProvider({ children, sessionId, endpoint, token }: Props) {
    const [apolloClient, setApolloClient] = useState<ApolloClient<unknown>>();

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
    }, [token, sessionId]);

    // TODO: Any way to prevent having to do apolloClient as any when providing the client prop?

    if (!apolloClient) {
        return (<Loading rawText={"Joining live..."} />)
    }

    return (
        <ApolloProvider client={apolloClient as any}>
            <LiveSessionContext.Provider value={{client: apolloClient}}>
                {children}
            </LiveSessionContext.Provider>
        </ApolloProvider >
    );
}

export const useLiveSessionLink = () => useContext(LiveSessionContext);
