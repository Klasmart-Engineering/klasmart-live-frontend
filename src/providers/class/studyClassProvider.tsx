import { RoomProvider } from "../room/roomContext";
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

function StudyClassProvider ({ children }: Props) {
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
                <RoomProvider enableConferencing={false}>
                    <>
                        {children}
                    </>
                </RoomProvider>
            </GlobalWhiteboardContext>
        </SnackbarProvider>
    );
}

export default StudyClassProvider;
