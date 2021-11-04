import Join from './join/join';
import { RoomWithContext } from './room/room-with-context';
import { useSessionContext } from "@/providers/session-context";
import { hasJoinedClassroomState } from "@/store/layoutAtoms";
import React from 'react';
import { useRecoilState } from "recoil";

export function App () {
    const { camera, name } = useSessionContext();
    const [ hasJoinedClassroom, setHasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    if(hasJoinedClassroom || (!name || camera !== undefined)){
        return (
            <RoomWithContext />
        );
    }

    return <Join />;
}
