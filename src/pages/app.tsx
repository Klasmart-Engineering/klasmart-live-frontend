import { LocalSessionContext } from "../providers/providers";
import { hasJoinedClassroomState } from "../store/layoutAtoms";
import Join from './join/join';
import { RoomWithContext } from './room/room-with-context';
import React,
{ useContext } from 'react';
import { useRecoilState } from "recoil";

export function App () {
    const { camera, name } = useContext(LocalSessionContext);
    const [ hasJoinedClassroom, setHasJoinedClassroom ] = useRecoilState(hasJoinedClassroomState);

    if(hasJoinedClassroom || (!name || camera !== undefined)){
        return (
            <RoomWithContext />
        );
    }

    return  <Join />;
}
