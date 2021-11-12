import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import { useWebsocketEndpoint } from "@/providers/region-select-context";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";
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

interface Loading {
    type: `Loading`;
}

interface Error {
    type: `Error`;
    messages: string[];
}

interface Ready {
    type: `Ready`;
}

type State = Loading | Error | Ready;

interface SfuServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
    isLoading: boolean;
    isError: boolean;
}

const SfuServiceApolloClientContext = createContext<SfuServiceApolloClientState>({
    isLoading: true,
    isError: false,
});

interface Props {
    sessionId?: string;
    token?: string;
    roomId?: string;
}

interface ErrorData {
    message: string;
}

export const SfuServiceApolloClient: React.FC<Props> = ({
    children, token, sessionId, roomId,
}) => {
    const { authenticated } = useAuthenticationContext();
    const endpointSfu = useWebsocketEndpoint(`sfu`);

    const [ state, setState ] = useState<State>({
        type: `Loading`,
    });

    const { authenticationService } = useServices();

    const isJwtTokenError = (error: ErrorData) => {
        return error.message === `Error: Missing JWT token` ||
            error.message === `Error: JWT Payload is incorrect` ||
            error.message === `Error: JWT Issuer is incorrect` ||
            error.message === `Error: JWT IssuerOptions are incorrect`;
    };

    const isAuthenticationError = (error: ErrorData) => {
        return error.message === `AuthenticationExpired` || error.message === `AuthenticationInvalid`;
    };

    const connectionCallback = useCallback((errors?: ErrorData[] | ErrorData) => {
        if (!errors) {
            setState({
                type: `Ready`,
            });

            return;
        }

        if (!(errors instanceof Array)) { errors = [ errors ]; }

        const refreshAuthToken = errors.some((e) => {
            return isAuthenticationError(e) || isJwtTokenError(e);
        });

        if (!refreshAuthToken) {
            setState({
                type: `Error`,
                messages: errors.map(e => e.message),
            });

            return;
        }

        setState({
            type: `Loading`,
        });

        authenticationService?.refresh().then(successful => {
            if (!successful) authenticationService?.signout();
        }).catch(exception => {
            console.error(exception);
        });
    }, [ authenticationService ]);

    const client = useMemo(() => {
        setState({
            type: `Loading`,
        });

        const options: ClientOptions = {
            connectionCallback,
            reconnect: true,
            connectionParams: {
                authToken: token,
                sessionId,
            },
        };

        const link = new WebSocketLink({
            uri: `${endpointSfu}/${roomId}`,
            options,
        });

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link,
        });

        return client;
    }, [ endpointSfu, authenticated ]);

    return (
        <SfuServiceApolloClientContext.Provider value={{
            client,
            isLoading: state.type === `Loading`,
            isError: state.type === `Error`,
        }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SfuServiceApolloClientContext.Provider>
    );
};

export const useSfuServiceApolloClient = () => useContext(SfuServiceApolloClientContext);
