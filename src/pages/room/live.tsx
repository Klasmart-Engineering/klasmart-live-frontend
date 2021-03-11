import React, { useContext } from "react";
import { ContentIndexState, InteractiveModeState, StreamIdState } from "./room";
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
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}

export function Live({
    interactiveModeState,
    streamIdState,
    numColState,
    setNumColState,
}: LiveProps): JSX.Element {
    const { isTeacher } = useContext(LocalSessionContext);
    return (
        <WebRTCSFUContext.Provide>
            <ScreenShare.Provide>
                <GlobalWhiteboardContext>
                    <Layout
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                        numColState={numColState}
                        setNumColState={setNumColState}
                    >
                        {
                            isTeacher
                                ? <Teacher
                                    interactiveModeState={interactiveModeState}
                                    streamIdState={streamIdState}
                                    numColState={numColState}
                                />
                                : <Student />
                        }
                    </Layout>
                </GlobalWhiteboardContext>
            </ScreenShare.Provide>
        </WebRTCSFUContext.Provide>
    );
}
