import { RoomProvider } from "../room/roomContext";
import { GlobalWhiteboardContext } from "@/whiteboard/context-providers/GlobalWhiteboardContext";
import { SnackbarProvider } from "kidsloop-px";
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
                    {children}
                </RoomProvider>
            </GlobalWhiteboardContext>
        </SnackbarProvider>
    );
}

export default LiveClassProvider;
