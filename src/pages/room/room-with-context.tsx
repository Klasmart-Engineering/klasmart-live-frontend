import { Trophy } from "../../components/trophies/trophy";
import ClassProviders from "../../providers/classProviders";
import { LiveSessionLinkProvider } from "../../providers/live-session-link-context";
import { useSessionContext } from "../../providers/session-context";
import {
    classEndedState,
    classLeftState,
} from "../../store/layoutAtoms";
import ClassEnded from "../end/classEnded";
import ClassLeft from "../end/classLeft";
import { Room } from "./room";
import React from 'react';
import { useRecoilState } from "recoil";

export function RoomWithContext (): JSX.Element {
    const [ classLeft ] = useRecoilState(classLeftState);
    const [ classEnded ] = useRecoilState(classEndedState);

    const {
        sessionId,
        token,
        roomId,
    } = useSessionContext();

    if (classLeft) {
        return (<ClassLeft />);
    }

    if (classEnded) {
        return (<ClassEnded />);
    }

    return (
        <LiveSessionLinkProvider
            token={token}
            roomId={roomId}
            sessionId={sessionId}>
            <ClassProviders>
                <>
                    <Room />
                    <Trophy />
                </>
            </ClassProviders>
        </LiveSessionLinkProvider>
    );
}