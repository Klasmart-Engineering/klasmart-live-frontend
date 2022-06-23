import { RoomProvider } from "../room/roomContext";
import { GlobalWhiteboardContext } from "@/whiteboard/context-providers/GlobalWhiteboardContext";
import React,
{
    ReactChild,
    ReactChildren,
} from 'react';

type Props = {
    children?: ReactChild | ReactChildren | null;
}

function LiveClassProvider ({ children }: Props) {
    return (

        <GlobalWhiteboardContext>
            <RoomProvider enableConferencing>
                {children}
            </RoomProvider>
        </GlobalWhiteboardContext>

    );
}

export default LiveClassProvider;
