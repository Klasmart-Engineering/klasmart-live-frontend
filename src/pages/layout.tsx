import { Trophy } from "../components/trophies/trophy";
import ClassProviders from "../providers/classProviders";
import { useSessionContext } from "../providers/session-context";
import {
    classEndedState,
    classLeftState,
    hasJoinedClassroomState,
} from "../store/layoutAtoms";
import Class from './class/class';
import ClassEnded from './end/classEnded';
import ClassLeft from './end/classLeft';
import Join from './join/join';
import React from 'react';
import { useRecoilState } from "recoil";
import { LiveSessionLinkProvider } from "src/providers/live-session-link-context";

function Layout () {
    const { camera, name } = useSessionContext();
    const [ hasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    if(hasJoinedClassroom || (!name || camera !== undefined)){
        return (
            <LiveSessionLinkProvider>
                <ClassLayout />
            </LiveSessionLinkProvider>
        );
    }

    return  <Join />;
}

function ClassLayout () {
    const [ classLeft ] = useRecoilState(classLeftState);
    const [ classEnded ] = useRecoilState(classEndedState);

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
