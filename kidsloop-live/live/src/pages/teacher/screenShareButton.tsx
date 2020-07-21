import React, {useState, useContext, useCallback} from "react";
import { useMutation } from "@apollo/react-hooks";
import ScreenShareTwoToneIcon from "@material-ui/icons/ScreenShareTwoTone";
import StopScreenShareTwoToneIcon from "@material-ui/icons/StopScreenShareTwoTone";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { FormattedMessage } from "react-intl";
import { MUT_SHOW_CONTENT } from "./teacher";
import { UserContext } from "../../entry";
import { webRTCContext } from "../../webRTCState";

export function ShareScreenButton(): JSX.Element {
    const {roomId, sessionId} = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    const [showContent, {loading}] = useMutation(MUT_SHOW_CONTENT);
    const stream = webrtc.getAux();
    // const [requesting, setRequesting] = useState<boolean>(false);
    // const [requestError, setRequestError] = useState<boolean>(false);

    useCallback;
    function onClick() {
        // if(requesting) {return;}
        console.log("onClick", stream);
        if(stream) {
            for(const track of stream.getTracks()) {
                track.stop();
            }
            webrtc.setAux();
        } else {
            // setRequesting(true);
            // setRequestError(false);
            ((navigator.mediaDevices as any).getDisplayMedia({audio: true, video: true}) as Promise<MediaStream>)
                .then((s) => {
                    webrtc.setAux(s);
                    showContent({variables: { roomId, type: "Video", contentId: sessionId }});
                });
            // .catch((e) => setRequestError(true))
            // .finally(() => setRequesting(false));
        }
    }
    return (
        <ToggleButton
            aria-label="right aligned"
            style={{ padding: "2px 8px", borderRadius: 12  }}
            disabled={!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia}
            onClick={() => onClick()}
        >
            {
                stream ?
                    <StopScreenShareTwoToneIcon style={{ paddingRight: 5 }} />:
                    <ScreenShareTwoToneIcon style={{ paddingRight: 5 }} /> 
            }
            <FormattedMessage id="live_buttonScreen" />
        </ToggleButton>
    );
}