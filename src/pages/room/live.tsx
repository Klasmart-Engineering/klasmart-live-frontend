import React, { useContext } from "react";
import { InteractiveModeState, RoomContext, StreamIdState } from "./room";
import Layout from "../../components/layout";
import { Student } from "../student/student";
import { Teacher } from "../teacher/teacher";
import { ScreenShare } from "../teacher/screenShareProvider";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { LocalSessionContext } from "../../entry";

interface LiveProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Live({
    interactiveModeState,
    streamIdState
}: LiveProps): JSX.Element {
    const { sessions } = RoomContext.Consume();
    const { sessionId } = useContext(LocalSessionContext);
    const localSession = sessions.get(sessionId);
    const isHostTeacher = localSession?.isTeacher && localSession?.isHost;

    return (
        <WebRTCSFUContext.Provide>
            <ScreenShare.Provide>
                <GlobalWhiteboardContext>
                    <Layout
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                    >
                        {
                            isHostTeacher
                                ? <Teacher
                                    interactiveModeState={interactiveModeState}
                                    streamIdState={streamIdState}
                                />
                                : <Student />
                        }
                    </Layout>
                </GlobalWhiteboardContext>
            </ScreenShare.Provide>
        </WebRTCSFUContext.Provide>
    );
}
