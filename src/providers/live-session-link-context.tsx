import Loading from '../components/loading';
import {
    LIVE_LINK,
    LocalSessionContext,
    sessionId,
} from '../providers/providers';
import { AuthTokenProvider } from "../services/auth-token/AuthTokenProvider";
import {
    redirectToLogin,
    refreshAuthenticationCookie,
} from "../utils/authentication";
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
    useContext,
} from 'react';

export function getApolloClient (roomId: string) {

    // TODO : App variables
    // const endpointLive = useWebsocketEndpoint("live");
    // const endpointSfu = useWebsocketEndpoint("sfu");

    const authToken = AuthTokenProvider.retrieveToken();

    const endpointLive = `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.LIVE_WEBSOCKET_ENDPOINT || window.location.host}`;
    const endpointSfu = `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.SFU_WEBSOCKET_ENDPOINT || window.location.host}/sfu`;

    const retryLink = new RetryLink({
        delay: {
            max: 300,
        },
        attempts: {
            max: Infinity,
        },
    });

    const connectionCallback = async (errors: Error[] | Error, result?: any) => {
        //Type information seems to wrong, errors may be a single error or array of errors?
        if (!(errors instanceof Array)) { errors = [ errors ]; }

        const authenticationError = errors.some((e) => e.message === `AuthenticationExpired` || e.message === `AuthenticationInvalid`);

        if (authenticationError) {
            const success = await refreshAuthenticationCookie();
            if(!success) { redirectToLogin(); }
        }
    };

    const directionalLink = retryLink.split((operation) => operation.getContext().target === LIVE_LINK, new WebSocketLink({
        uri: `${endpointLive}/graphql`,
        options: {
            connectionCallback,
            reconnect: true,
            connectionParams: {
                authToken,
                sessionId,
            },
        },
    }), new WebSocketLink({
        uri: `${endpointSfu}/${roomId}`,
        options: {
            connectionCallback,
            reconnect: true,
            connectionParams: {
                authToken,
                sessionId,
            },
        },
    }));

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: directionalLink,
    } as any);
}

export interface ILiveSessionContext {
    client?: ApolloClient<unknown>;
}

const LiveSessionContext = createContext<ILiveSessionContext>({});

type Props = {
    children?: ReactChild | ReactChildren | null;
}

export function LiveSessionLinkProvider ({ children }: Props) {

    const { roomId } = useContext(LocalSessionContext);
    const apolloClient = getApolloClient(roomId);

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
