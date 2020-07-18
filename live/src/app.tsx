import {Join} from "./pages/join";
import { Room } from "./room";
import { UserContext } from "./entry";
import { webRTCContext } from "./webRTCState";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import React, { useContext, useEffect, useState } from "react";

export function App (): JSX.Element {
    const {name, teacher} = useContext(UserContext);
    const webrtc = useContext(webRTCContext); 
    const [done, setDone] = useState(false);
    useEffect(() => {
        if(!navigator.mediaDevices) {return;}
        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then((stream) => {webrtc.setCamera(stream);})
            .catch((e) => {console.error(e);})
            .finally(() => {setDone(true);});
    },[]);
    if(!name) {return <Join />;}
    if(!done) {
        return (
            <Typography>
                <CircularProgress size={16} />
                <FormattedMessage id="waiting_for_camera" />
            </Typography>
        );
    }
    return <Room teacher={teacher} />;
}
