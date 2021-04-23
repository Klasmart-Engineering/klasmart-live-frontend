
import { MUTATION_SET_HOST } from './components/utils/graphql';
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import { LIVE_LINK, LocalSessionContext } from './providers/providers';
import { RoomContext } from './providers/roomContext';
import {
    classEndedState, classLeftState, hasControlsState,
} from "./states/layoutAtoms";
import { useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { useRecoilState } from "recoil";

function Layout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);

    const [ hostMutation ] = useMutation(MUTATION_SET_HOST, {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        if (!host && teachers.length) {
            const hostId = teachers[0].id;
            hostMutation({
                variables: {
                    roomId,
                    hostId,
                },
            });
        }

        if(host?.id === sessionId){
            setHasControls(true);
        }else{
            setHasControls(false);
        }

    }, [ sessions, sessions.size ]);

    if(classLeft){
        return(<ClassLeft />);
    }

    if(classEnded){
        return(<ClassEnded />);
    }

    return (
        <Class />
    );
}

export default Layout;
