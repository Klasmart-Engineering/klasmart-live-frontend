import React, { useContext } from "react";
import Layout from "../../components/layout";
import { LocalSessionContext } from "../../entry";
import { RoomContext } from "../../providers/RoomContext";
import { WebRTCProvider } from "../../providers/WebRTCContext";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { Student } from "../student/student";
import { ScreenShareProvider } from "../teacher/screenShareProvider";
import { InteractiveModeState, StreamIdState } from "./room";

interface LiveProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Live({
    interactiveModeState,
    streamIdState
}: LiveProps): JSX.Element {
    const { sessions } = useContext(RoomContext);
    const { sessionId } = useContext(LocalSessionContext);
    const localSession = sessions.get(sessionId);
    const isHostTeacher = localSession?.isTeacher && localSession?.isHost;

    return (
        <WebRTCProvider>
            <ScreenShareProvider>
                <GlobalWhiteboardContext>
                    <Layout
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                    >
                        <Student />
                    </Layout>
                </GlobalWhiteboardContext>
            </ScreenShareProvider>
        </WebRTCProvider>
    );
}
