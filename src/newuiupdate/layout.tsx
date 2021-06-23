import { AuthTokenProvider } from "../services/auth-token/AuthTokenProvider";
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import Join from './pages/join';
import ClassProviders from "./providers/classProviders";
import {
    LIVE_LINK, LocalSessionContext, sessionId,
} from './providers/providers';
import { classEndedState, classLeftState } from "./states/layoutAtoms";
import {
    ApolloClient, ApolloProvider, InMemoryCache, HttpLink
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import React, { useContext } from 'react';
import { useRecoilState } from "recoil";
import { Trophy } from "../components/trophies/trophy";

export function getApolloClient (roomId: string) {
    const authToken = AuthTokenProvider.retrieveToken();
    const retryOptions = {
        delay: {
            max: 300,
        },
        attempts: {
            max: Infinity,
        },
    };
    const directionalLink = new RetryLink(retryOptions).split((operation) => operation.getContext().target === LIVE_LINK, new WebSocketLink({
        uri:
                process.env.ENDPOINT_WEBSOCKET ||
                `${window.location.protocol === `https:` ? `wss` : `ws`}://${
                    window.location.host
                }/graphql`,
        options: {
            reconnect: true,
            connectionParams: {
                authToken,
                sessionId,
            },
        },
    }), new WebSocketLink({
        uri: `${window.location.protocol === `https:` ? `wss` : `ws`}://${
            window.location.host
        }/sfu/${roomId}`,
        options: {
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


export const clientAPI = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: `${process.env.ENDPOINT_API}/user/`,
         credentials: 'include'
    }),
});

function Layout () {
    const { camera, name } = useContext(LocalSessionContext);

    if (!name || camera === undefined) {
        // return  <ApolloProvider client={clientAPI}><Join /></ApolloProvider>;
         return  <Join />;
    }
    return <ClassWrapper/>;
}

function ClassWrapper () {
    const { roomId } = useContext(LocalSessionContext);
    const apolloClient = getApolloClient(roomId);
    return (
        <ApolloProvider client={apolloClient}>
            <ClassLayout/>
        </ApolloProvider>
    );
}

function ClassLayout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if(classLeft){
        return(<ClassLeft />);
    }

    if(classEnded){
        return(<ClassEnded />);
    }

    return (
        <ClassProviders>
            <>
                <Class />
                <Trophy />
            </>
        </ClassProviders>
    );
}

export default Layout;
