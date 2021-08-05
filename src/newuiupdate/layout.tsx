import { Trophy } from "../components/trophies/trophy";
import Class from '../pages/class/class';
import ClassEnded from '../pages/end/classEnded';
import ClassLeft from '../pages/end/classLeft';
import Join from '../pages/join/join';
import { AuthTokenProvider } from "../services/auth-token/AuthTokenProvider";
import {
    redirectToLogin,
    refreshAuthenticationCookie,
} from "../utils/authentication";
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
