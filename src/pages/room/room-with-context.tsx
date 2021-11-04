import { Room } from "./room";
import { Trophy } from "@/components/trophies/trophy";
import EndClass from "@/pages/end/endClass";
import LiveClassProvider from "@/providers/liveClassProvider";
import { LiveSessionLinkProvider } from "@/providers/live-session-link-context";
import { useSessionContext } from "@/providers/session-context";
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
    } = useSessionContext();

    return (
        <LiveSessionLinkProvider
            token={token}
            roomId={roomId}
            sessionId={sessionId}>
            <ClassRoom />
        </LiveSessionLinkProvider>
    );
}

function ClassRoom (): JSX.Element {
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
