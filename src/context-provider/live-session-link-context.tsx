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
    offline?: boolean
}

export function LiveSessionLinkProvider({ children, sessionId, endpoint, token, offline }: Props) {
    const [apolloClient, setApolloClient] = useState<ApolloClient<unknown>>();

    useEffect(() => {
        if (offline) return;

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

    if (offline) {
        return <>{ children }</>
    }

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
