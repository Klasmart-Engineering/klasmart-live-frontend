
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

    // TODO :
    // 1) Change the settimeout logic ? (added because it is conflicting with the give room controls logic)
    // 2) Move to a provider ?
    let setDefaultHost:any;

    useEffect(() => {
        setDefaultHost = setTimeout(function (){
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

                hostId === sessionId ? setHasControls(true) : setHasControls(false);
            }
        }, 1000);

        return function cleanup (){
            clearTimeout(setDefaultHost);
        };
    }, [ sessions.size ]);

    useEffect(() => {
        const teachers = [ ...sessions.values() ].filter(session => session.isTeacher === true).sort((a, b) => a.joinedAt - b.joinedAt);
        const host = teachers.find(session => session.isHost === true);
        host?.id === sessionId ? setHasControls(true) : setHasControls(false);
    }, [ sessions ]);

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
