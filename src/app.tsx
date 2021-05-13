import React, { useContext } from "react";
import { useSessionContext } from "./context-provider/session-context";
import Join from "./pages/join/join";
import { RoomWithContext } from "./pages/room/room";

export function App(): JSX.Element {
    const { camera, name } = useSessionContext();

    if (!name || camera === undefined) {
        return <Join />;
    }

    return <RoomWithContext />;        
}
