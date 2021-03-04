import Join from "./pages/join/join";
import { Room, RoomContext } from "./pages/room/room";
import { LocalSession } from "./entry";
import React, { useContext } from "react";
import { Trophy } from "./components/trophies/trophy";

export function App(): JSX.Element {
    const { camera, name, isTeacher } = useContext(LocalSession);

    if (!name || camera === undefined) { return <Join />; }

    return <RoomContext.Provide>
        <Room isTeacher={isTeacher} />
        <Trophy />
    </RoomContext.Provide>
}
