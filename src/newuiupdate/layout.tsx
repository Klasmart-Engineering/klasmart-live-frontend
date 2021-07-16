import { Trophy } from "../components/trophies/trophy";
import { AuthTokenProvider } from "../services/auth-token/AuthTokenProvider";
import {
    redirectToLogin,
    refreshAuthenticationCookie,
} from "../utils/authentication";
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import Join from './pages/join';
import ClassProviders from "./providers/classProviders";
import {
    LIVE_LINK,
    LocalSessionContext,
    sessionId,
} from './providers/providers';
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
} from "./states/layoutAtoms";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import React,
{ useContext } from 'react';
import { useRecoilState } from "recoil";

export function getApolloClient (roomId: string) {
    const authToken = AuthTokenProvider.retrieveToken();

    const retryLink = new RetryLink({
        delay: {
            max: 300,
        },
        attempts: {
            max: Infinity,
        },
    });

    const connectionCallback = (errors: Error[] | Error, result?: any) => {
        //Type information seems to wrong, errors may be a single error or array of errors?
        if (!(errors instanceof Array)) { errors = [ errors ]; }

        const authenticationInvalid = errors.some((e) => e.message === `AuthenticationInvalid`);
        if (authenticationInvalid) { redirectToLogin(); }

        const authenticationExpired = errors.some((e) => e.message === `AuthenticationExpired`);
        if (authenticationExpired) { refreshAuthenticationCookie(); }
    };

    const directionalLink = retryLink.split((operation) => operation.getContext().target === LIVE_LINK, new WebSocketLink({
        uri: `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.LIVE_WEBSOCKET_ENDPOINT ||
                window.location.host
        }/graphql`,
        options: {
            connectionCallback,
            reconnect: true,
            connectionParams: {
                authToken,
                sessionId,
            },
        },
    }), new WebSocketLink({
        uri: `${window.location.protocol === `https:` ? `wss` : `ws`}://${process.env.SFU_WEBSOCKET_ENDPOINT ||
                `${window.location.host}/sfu`
        }/${roomId}`,
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

function Layout () {
    const { camera, name } = useContext(LocalSessionContext);
    const [ hasJoinedClassroom, setHasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    if(hasJoinedClassroom || (!name || camera !== undefined)){
        return <ClassWrapper/>;
    }

    return  <Join />;
}

function ClassWrapper () {
    const { roomId } = useContext(LocalSessionContext);
    const apolloClient = getApolloClient(roomId);
    return (
        <ApolloProvider client={apolloClient}>
            <ClassLayout />
        </ApolloProvider>
    );
}

function ClassLayout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if (classLeft) {
        return (<ClassLeft />);
    }

    if (classEnded) {
        return (<ClassEnded />);
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
