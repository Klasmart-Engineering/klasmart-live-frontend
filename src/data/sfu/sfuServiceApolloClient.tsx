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

interface SfuServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
}

const SfuServiceApolloClientContext = createContext<SfuServiceApolloClientState>({});

interface Props {
    sessionId?: string;
    token?: string;
    roomId?: string;
}

export const SfuServiceApolloClient: React.FC<Props> = ({
    children, token, sessionId, roomId,
}) => {
    const { authenticated } = useAuthenticationContext();
    const endpointSfu = useWebsocketEndpoint(`sfu`);

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
            uri: `${endpointSfu}/${roomId}`,
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
    }, [ endpointSfu, authenticated ]);

    return (
        <SfuServiceApolloClientContext.Provider value={{
            client,
        }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SfuServiceApolloClientContext.Provider>
    );
};

export const useSfuServiceApolloClient = () => useContext(SfuServiceApolloClientContext);
