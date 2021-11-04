import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import { useWebsocketEndpoint } from "@/providers/region-select-context";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import React,
{
    createContext,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { ClientOptions } from "subscriptions-transport-ws";

interface LiveServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
}

const LiveServiceApolloClientContext = createContext<LiveServiceApolloClientState>({});

interface Props {
    sessionId?: string;
    token?: string;
}

export const LiveServiceApolloClient: React.FC<Props> = ({
    children, token, sessionId,
}) => {
    const { authenticated } = useAuthenticationContext();
    const endpointLive = useWebsocketEndpoint(`live`);

    const { authenticationService } = useServices();

    const connectionCallback = useCallback((errors: Error[]) => {
        if (!errors) return;

        const authenticationError = errors.some((e) => e.message === `AuthenticationExpired` || e.message === `AuthenticationInvalid`);
        if (!authenticationError) {
            return;
        }

        authenticationService?.refresh().then(successful => {
            if (!successful) authenticationService?.signout();
        }).catch(exception => {
            console.error(exception);
        });
    }, [ authenticationService ]);

    const client = useMemo(() => {
        const options: ClientOptions = {
            connectionCallback,
            reconnect: true,
            connectionParams: {
                authToken: token,
                sessionId,
            },
        };

        const liveLink = new WebSocketLink({
            uri: `${endpointLive}/graphql`,
            options,
        });

        const retryLink = new RetryLink({
            delay: {
                max: 300,
            },
            attempts: {
                max: Infinity,
            },
        });

        const link = retryLink.concat(liveLink);

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link,
        });

        return client;
    }, [ endpointLive, authenticated ]);

    return (
        <LiveServiceApolloClientContext.Provider value={{
            client,
        }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </LiveServiceApolloClientContext.Provider>
    );
};

export const useLiveServiceApolloClient = () => useContext(LiveServiceApolloClientContext);
