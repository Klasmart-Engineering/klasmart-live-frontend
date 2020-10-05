import { Join } from "./pages/join";
import { Room, RoomContext } from "./room";
import { UserContext } from "./entry";
import React, { useContext } from "react";
import { Trophy } from "./components/trophies/trophy";
import useCordovaInitialize from "./cordova-initialize";

export function App(): JSX.Element {
    const [cordovaReady] = useCordovaInitialize();
    const { camera, name, teacher } = useContext(UserContext);

    if (!cordovaReady) { return <>Loading...</> }
    if (!name || camera === undefined) { return <Join /> }

    return <RoomContext.Provide>
        <Room teacher={teacher} />
        <Trophy />
    </RoomContext.Provide>
}
