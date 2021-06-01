import { getApolloClient } from "../entry";
import { Trophy } from './components/others/trophies/trophy';
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import Join from './pages/join';
import ClassProviders from "./providers/classProviders";
import { LocalSessionContext } from './providers/providers';
import { classEndedState, classLeftState } from "./states/layoutAtoms";
import { ApolloProvider } from "@apollo/client";
import React, { useContext } from 'react';
import { useRecoilState } from "recoil";

function Layout () {
    const { camera, name } = useContext(LocalSessionContext);

    if (!name || camera === undefined) {
        return <Join />;
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
