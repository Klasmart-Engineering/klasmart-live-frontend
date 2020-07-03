import { ApolloProvider } from "@apollo/react-hooks";
import "@babel/polyfill";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import React, { createContext } from "react";
import { HashRouter } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { App } from "./app";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";

export const sessionId = uuid();
export const sessionIdContext = createContext("");

const authToken = AuthTokenProvider.retrieveToken();

const wsLink = new WebSocketLink({
    options: {
        connectionParams: {
            authToken,
            sessionId,
        },
        reconnect: true,
    },
    uri: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/graphql`,
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink,
} as any);

export default function LiveClient() {
    return (
        <ApolloProvider client={client}>
            <sessionIdContext.Provider value={sessionId}>
                <HashRouter>
                    <App />
                </HashRouter>
            </sessionIdContext.Provider>
        </ApolloProvider>
    );
}
