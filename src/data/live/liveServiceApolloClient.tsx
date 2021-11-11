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
    useState,
} from "react";
import { ClientOptions } from "subscriptions-transport-ws";

interface LiveServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
    isLoading: boolean;
    isError: boolean;
}

const LiveServiceApolloClientContext = createContext<LiveServiceApolloClientState>({
    isLoading: true,
    isError: false,
});

interface Props {
    sessionId?: string;
    token?: string;
}

interface ConnectionCallbackData {
    message: string;
}

export const LiveServiceApolloClient: React.FC<Props> = ({
    children, token, sessionId,
}) => {
    const { authenticated } = useAuthenticationContext();
    const endpointLive = useWebsocketEndpoint(`live`);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isError, setIsError ] = useState(false);

    const { authenticationService } = useServices();

    const isTokenError = (data: ConnectionCallbackData) => {
        return data.message === `Error: Missing JWT token` ||
            data.message === `Error: JWT Payload is incorrect` ||
            data.message === `Error: JWT Issuer is incorrect` ||
            data.message === `Error: JWT IssuerOptions are incorrect`;
    };

    const connectionCallback = useCallback((result: Error[] | ConnectionCallbackData | undefined) => {
        setIsLoading(false);

        const errors = result as Error[] | undefined;
        const data = result as ConnectionCallbackData | undefined;

        let isAuthenticationError = false;
        if (data?.message && data.message.startsWith(`Error: `)) {
            isAuthenticationError = isTokenError(data);
            setIsError(true);
        } else if (errors?.length) {
            setIsError(true);
            isAuthenticationError = errors.some((e) => e.message === `AuthenticationExpired` || e.message === `AuthenticationInvalid`);
        }

        if (isAuthenticationError) {
            setIsLoading(true);
            authenticationService?.refresh().then(successful => {
                if (!successful) authenticationService?.signout();
            }).catch(exception => {
                console.error(exception);
            });
        }
    }, [ authenticationService ]);

    const client = useMemo(() => {
        setIsLoading(true);
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
            isLoading,
            isError,
        }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </LiveServiceApolloClientContext.Provider>
    );
};

export const useLiveServiceApolloClient = () => useContext(LiveServiceApolloClientContext);
