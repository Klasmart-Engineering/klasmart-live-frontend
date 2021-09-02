import { Trophy } from "../../components/trophies/trophy";
import ClassProviders from "../../providers/classProviders";
import { LiveSessionLinkProvider } from "../../providers/live-session-link-context";
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
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if (classLeft) {
        return (<ClassLeft />);
    }

    if (classEnded) {
        return (<ClassEnded />);
    }

    return (
        <LiveSessionLinkProvider>
            <ClassProviders>
                <>
                    <Room />
                    <Trophy />
                </>
            </ClassProviders>
        </LiveSessionLinkProvider>
    );
}
