import Layout from "../../components/layout";
import { LocalSessionContext } from "../../entry";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import {
    InteractiveModeState,
    StreamIdState,
} from "./room";
import React,
{ useContext } from "react";

interface LiveProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Live ({
    interactiveModeState,
    streamIdState,
}: LiveProps): JSX.Element {
    const { sessionId } = useContext(LocalSessionContext);

    return (
        <GlobalWhiteboardContext>

        </GlobalWhiteboardContext>
    );
}
