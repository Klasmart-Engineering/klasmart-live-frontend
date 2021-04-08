import React, { useContext } from "react";
import { InteractiveModeState, StreamIdState } from "./room";
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
    const { isTeacher } = useContext(LocalSessionContext);
    return (
        <WebRTCSFUContext.Provide>
            <ScreenShare.Provide>
                <GlobalWhiteboardContext>
                    <Layout
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                    >
                        {
                            isTeacher
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
