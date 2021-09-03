import { useWebsocketEndpoint } from "../app/context-provider/region-select-context";
import { useServices } from "../app/context-provider/services-provider";
import Loading from '../components/loading';
import { LIVE_LINK } from '../providers/providers';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import React, {
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

export interface ILiveSessionContext {
    client?: ApolloClient<unknown>;
}

const LiveSessionContext = createContext<ILiveSessionContext>({});

type Props = {
    children?: ReactChild | ReactChildren | null;
    token?: string;
    roomId?: string;
    sessionId: string;
}

export function LiveSessionLinkProvider ({
    children, token, roomId, sessionId,
}: Props) {
    const [ apolloClient, setApolloClient ] = useState<ApolloClient<unknown>>();

    // TODO: These ways of selecting endpoints need to be supported in region-select-context
    // const endpointLive = `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.LIVE_WEBSOCKET_ENDPOINT || window.location.host}`;
    // const endpointSfu = `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.SFU_WEBSOCKET_ENDPOINT || window.location.host}/sfu`;

    const endpointLive = useWebsocketEndpoint(`live`);
    const endpointSfu = useWebsocketEndpoint(`sfu`);

    const { authenticationService } = useServices();

    const connectionCallback = useCallback((errors: Error[] | Error) => {
        // TODO: We need to test this and make sure if the errors parameter is array or not. According to both documentation and type information it's array.
        if (!(errors instanceof Array)) { errors = [ errors ]; }

        const authenticationError = errors.some((e) => e.message === `AuthenticationExpired` || e.message === `AuthenticationInvalid`);
        if (!authenticationError) {
            return;
        }

        authenticationService?.refresh().then(successful => {
            // TODO: We should present some sort of message / error to the user about the failed connection. Not good to just throw them back to login page without notice.
            // TODO: Redirect user to login page.
            if (!successful) console.error(`error refreshing token`);
        }).catch(exception => {
            console.exception(exception);
        });
    }, [ authenticationService ]);

    useEffect(() => {
        const options = {
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

        const sfuLink = new WebSocketLink({
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

        const link = retryLink.split((operation) => operation.getContext().target === LIVE_LINK, liveLink, sfuLink);

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link,
        });

        setApolloClient(client);

        return () => {
            client.stop();

            setApolloClient(undefined);
        };
    }, [
        connectionCallback,
        endpointLive,
        endpointSfu,
        token,
        roomId,
        sessionId,
    ]);

    if (!apolloClient) {
        return (<Loading messageId={`join_live`} />);
    }

    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider >
    );
}

export const useLiveSessionLink = () => useContext(LiveSessionContext);
