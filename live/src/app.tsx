import React, { useContext } from "react";
import {Join} from "./pages/join";
import { Room } from "./room";
import { UserContext } from "./entry";
import { WebRTCContext } from "./webRTCState";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";

export function App (): JSX.Element {
    const {name, teacher} = useContext(UserContext);
    if(!name) {return <Join />;}
    if(WebRTCContext.stream === undefined) {
        return (
            <Typography>
                <FormattedMessage id="waiting_for_camera" />
                <CircularProgress />
            </Typography>
        );
    }
    return <Room teacher={teacher} />;
}
