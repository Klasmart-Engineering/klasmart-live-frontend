import { RoomProvider } from "../roomContext";
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
            <RoomProvider>
                <GlobalWhiteboardContext>
                    <>
                        {children}
                    </>
                </GlobalWhiteboardContext>
            </RoomProvider>
        </SnackbarProvider>
    );
}

export default StudyClassProvider;
