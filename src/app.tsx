import React, { useContext } from "react";
import { Trophy } from "./components/trophies/trophy";
import { LocalSessionContext } from "./entry";
import Join from "./pages/join/join";
import { Room } from "./pages/room/room";
import { RoomProvider } from "./providers/RoomProvider";

export function App(): JSX.Element {
    const { camera, name } = useContext(LocalSessionContext);

    if (!name || camera === undefined) {
        return <Join />;
    }

    return (
        <RoomProvider>
            <Room />
            <Trophy />
        </RoomProvider>
    );
}
