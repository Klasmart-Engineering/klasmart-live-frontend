import { GlobalWhiteboardContext } from "../whiteboard/context-providers/GlobalWhiteboardContext";
import { RoomProvider } from "./roomContext";
import { ScreenShareProvider } from "./screenShareProvider";
import { SnackbarProvider } from "kidsloop-px";
import React, { ReactChild, ReactChildren } from 'react';
import { useIntl } from "react-intl";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

function ClassProviders ({ children }: Props) {
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
            <RoomProvider>
                <ScreenShareProvider>
                    <GlobalWhiteboardContext>
                        <>
                            {children}
                        </>
                    </GlobalWhiteboardContext>
                </ScreenShareProvider>
            </RoomProvider>
        </SnackbarProvider>
    );
}

export default ClassProviders;
