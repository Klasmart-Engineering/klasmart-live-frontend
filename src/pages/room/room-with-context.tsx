import { Room } from "./room";
import { Trophy } from "@/components/trophies/trophy";
import { LiveServiceApolloClient } from "@/data/live/liveServiceApolloClient";
import { LiveSfuServicesProvider } from "@/data/liveSfuServicesProvider";
import EndClass from "@/pages/end/endClass";
import LiveClassProvider from "@/providers/class/liveClassProvider";
import StudyClassProvider from "@/providers/class/studyClassProvider";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
} from "@/store/layoutAtoms";
import React from 'react';
import { useRecoilState } from "recoil";

export function RoomWithContext (): JSX.Element {

    const {
        sessionId,
        token,
        roomId,
        classType,
    } = useSessionContext();

    return (
        classType === ClassType.STUDY ?
            <LiveServiceApolloClient
                token={token}
                sessionId={sessionId}
            >
                <StudyRoom />
            </LiveServiceApolloClient> :
            <LiveSfuServicesProvider
                token={token}
                roomId={roomId}
                sessionId={sessionId}>
                <LiveRoom />
            </LiveSfuServicesProvider>
    );
}

function LiveRoom (): JSX.Element {
    const [ classLeft ] = useRecoilState(classLeftState);
    const [ classEnded ] = useRecoilState(classEndedState);

    if(classLeft || classEnded){
        return <EndClass />;
    }

    return (
        <LiveClassProvider>
            <>
                <Room />
                <Trophy />
            </>
        </LiveClassProvider>
    );
}

function StudyRoom (): JSX.Element {
    return (
        <StudyClassProvider>
            <>
                <Room />
                <Trophy />
            </>
        </StudyClassProvider>
    );
}
