import { Room } from "./room";
import { Trophy } from "@/components/trophies/trophy";
import { LiveServiceApolloClient } from "@/data/live/liveServiceApolloClient";
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
        classType,
    } = useSessionContext();

    return (
        <LiveServiceApolloClient
            token={token}
            sessionId={sessionId}
        >
            { classType == ClassType.STUDY ? <StudyRoom /> : <LiveRoom /> }
        </LiveServiceApolloClient>
    );
}

const LiveRoom: React.FC = () => {
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
};

const StudyRoom: React.FC = () => {
    return (
        <StudyClassProvider>
            <>
                <Room />
                <Trophy />
            </>
        </StudyClassProvider>
    );
};
