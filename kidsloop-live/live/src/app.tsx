import {Join} from "./pages/join";
import { Room } from "./room";
import { UserContext } from "./entry";
import { webRTCContext } from "./webRTCState";
import React, { useContext } from "react";

export function App (): JSX.Element {
    const {name, teacher} = useContext(UserContext);
    const webrtc = useContext(webRTCContext);

    if(!name || webrtc.getCamera() === undefined) {return <Join />;}

    return <Room teacher={teacher} />;
}
