
import { ClassType } from "../store/actions";
import { MUTATION_SET_HOST } from './components/utils/graphql';
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import Join from './pages/join-new';
import { LIVE_LINK, LocalSessionContext, SFU_LINK } from './providers/providers';
import { RoomContext } from './providers/roomContext';
import {
    classEndedState, classLeftState, hasControlsState, isLessonPlanOpenState,
} from "./states/layoutAtoms";
import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { GlobalMuteNotification, GLOBAL_MUTE_MUTATION, GLOBAL_MUTE_QUERY, WebRTCContext } from "./providers/WebRTCContext";

function Layout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);
    
    const {
        camera, name, roomId, sessionId, classtype,
    } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const webrtc = useContext(WebRTCContext);

    const localSession = sessions.get(sessionId);

    const [ hostMutation ] = useMutation(MUTATION_SET_HOST, {
        context: {
            target: LIVE_LINK,
        },
    });

    const [ globalMuteMutation ] = useMutation(GLOBAL_MUTE_MUTATION, {
        context: {
            target: SFU_LINK,
        },
    });

    const { refetch: refetchGlobalMute } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
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

    useEffect(() => {
        if(classtype === ClassType.CLASSES){
            setIsLessonPlanOpen(true);
        }
    }, [ classtype ]);


    const enforceGlobalMute = async () => {
        const { data } = await refetchGlobalMute();
        const videoGloballyDisabled = data?.retrieveGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled) {
            toggleVideoStates(videoGloballyDisabled);
        }
        const audioGloballyMuted = data?.retrieveGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted) {
            toggleAudioStates(audioGloballyMuted);
        }
    };

    useEffect(() => {
        enforceGlobalMute();
    }, [
        roomId,
        localSession?.isHost,
        webrtc?.inboundStreams.size,
    ]);

    async function toggleVideoStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: undefined,
            videoGloballyDisabled: isOn ?? camerasOn,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const videoGloballyDisabled = data?.data?.updateGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled != null) {
            setCamerasOn(!videoGloballyDisabled);
        }
    }

    async function toggleAudioStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: isOn ?? micsOn,
            videoGloballyDisabled: undefined,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const audioGloballyMuted = data?.data?.updateGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted != null) {
            setMicsOn(!audioGloballyMuted);
        }
    }



    if (!name || camera === undefined) {
        return <Join />;
    }

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
