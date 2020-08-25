import { Join } from "./pages/join";
import { Room, RoomContext } from "./room";
import { UserContext } from "./entry";
import { webRTCContext } from "./webRTCState";
import React, { useContext } from "react";
import { Trophy } from "./components/trophies/trophy";

export function App(): JSX.Element {
    const { name, teacher } = useContext(UserContext);
    const webrtc = useContext(webRTCContext);

    if (!name || webrtc.getCamera() === undefined) { return <Join />; }

    return <RoomContext.Provide>
        <Room teacher={teacher} />
        <Trophy />
    </RoomContext.Provide>
}
