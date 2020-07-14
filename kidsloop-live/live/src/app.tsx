import {Join} from "./pages/join";
import { Room } from "./room";
import { UserContext } from "./entry";
import { webRTCContext } from "./webRTCState";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import React, { useContext } from "react";
import WhiteboardProvider from "./whiteboard/context-provider/WhiteboardContextProvider";

export function App (): JSX.Element {
    const {name, teacher} = useContext(UserContext);
    const webrtc = useContext(webRTCContext); 
    if(!name) {return <Join />;}
    if(!webrtc.isCameraReady()) {
        return (
            <Typography>
                <CircularProgress size={16} />
                <FormattedMessage id="waiting_for_camera" />
            </Typography>
        );
    }
    return (
        <WhiteboardProvider>
            <Room teacher={teacher} />
        </WhiteboardProvider>
    );
}
