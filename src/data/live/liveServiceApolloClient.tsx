import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import { useWebsocketEndpoint } from "@/providers/region-select-context";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import React,
{
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { createClient, ClientOptions, CloseCode } from "graphql-ws";

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

interface ErrorData {
    message: string;
}

export const LiveServiceApolloClient: React.FC<Props> = ({
    children, token, sessionId,
}) => {
    const { authenticated } = useAuthenticationContext();
    const endpointLive = useWebsocketEndpoint(`live`);

    const [state, setState] = useState<State>({
        type: `Loading`,
    });

    const { authenticationService } = useServices();

    const connectionCallback = useCallback((event: any) => {
        if (event instanceof CloseEvent) {
            if (event.code === CloseCode.Unauthorized) {
                setState({
                    type: `Loading`,
                });
                authenticationService?.refresh().then(successful => {
                    if (!successful) authenticationService?.signout();
                }).catch(exception => {
                    console.error(exception);
                });
            } else if (event.code === CloseCode.Forbidden) {
                console.log('\nFORBIDDEN ERROR FROM SEVER: ', event.reason, '\n');
                setState({
                    type: `Error`,
                    messages: [event.reason],
                })
            }
        } else {
            setState({
                type: `Error`,
                messages: [event],
            });
        }

        return;

    }, [authenticationService]);

    const client = useMemo(() => {
        setState({
            type: `Loading`,
        });

        const options: ClientOptions = {
            url: `${endpointLive}/graphql`,
            keepAlive: 1000,
            connectionParams: {
                authToken: token,
                sessionId,
            },
            isFatalConnectionProblem: () => {
                return false;
            },
            retryWait: async function waitForServerHealthyBeforeRetry() {
                console.log('console retryWait')
                await new Promise((resolve) =>
                    setTimeout(resolve, 10000),
                );
            },
            on: {
                'connected': () => {
                    setState({
                        type: `Ready`,
                    });
                },
                'closed': connectionCallback,
                'error': (error: unknown) => {
                    if (error instanceof Error) {
                        setState({
                            type: `Error`,
                            messages: [error.message],
                        })
                    }
                    console.error(error);
                }

            }
        };

        const wsClient = createClient(options);
        const link = new GraphQLWsLink(wsClient);
        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link,
        });
        return client;
    }, [endpointLive, authenticated]);

    return (
        <LiveServiceApolloClientContext.Provider value={{
            client,
            isLoading: state.type === `Loading`,
            isError: state.type === `Error`,
        }}
        >
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </LiveServiceApolloClientContext.Provider>
    );
};

export const useLiveServiceApolloClient = () => useContext(LiveServiceApolloClientContext);
