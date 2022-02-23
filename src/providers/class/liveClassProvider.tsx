import { RoomProvider } from "../room/roomContext";
import { ScreenShareProvider } from "../screenShareProvider";
import { WebRTCProvider } from "../WebRTCContext";
import { GlobalWhiteboardContext } from "@/whiteboard/context-providers/GlobalWhiteboardContext";
import { SnackbarProvider } from "@kl-engineering/kidsloop-px";
import React,
{
    ReactChild,
    ReactChildren,
} from 'react';
import { useIntl } from "react-intl";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

function LiveClassProvider ({ children }: Props) {
    const intl = useIntl();

    return (
        <SnackbarProvider
            anchorOrigin={{
                vertical: `top`,
                horizontal: `center`,
            }}
            closeButtonLabel={intl.formatMessage({
                id: `common_dismiss`,
            })}>
            <GlobalWhiteboardContext>
                <RoomProvider enableConferencing={true}>
                    <WebRTCProvider>
                        <ScreenShareProvider>
                            <>
                                {children}
                            </>
                        </ScreenShareProvider>
                    </WebRTCProvider>
                </RoomProvider>
            </GlobalWhiteboardContext>
        </SnackbarProvider>
    );
}

export default LiveClassProvider;
