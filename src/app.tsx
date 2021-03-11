import Join from "./pages/join/join";
import { Room, RoomContext } from "./pages/room/room";
import { LocalSessionContext } from "./entry";
import React, { useContext } from "react";
import { Trophy } from "./components/trophies/trophy";

export function App(): JSX.Element {
    const { camera, name } = useContext(LocalSessionContext);

    if (!name || camera === undefined) { return <Join />; }

    return <RoomContext.Provide>
        <Room />
        <Trophy />
    </RoomContext.Provide>
}
