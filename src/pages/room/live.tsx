import React from "react";
import { ContentIndexState, InteractiveModeState, StreamIdState } from "./room";
import Layout from "../../components/layout";
import { Student } from "../student/student";
import { Teacher } from "../teacher/teacher";
import { ScreenShare } from "../teacher/screenShareProvider";
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";

interface LiveProps {
    isTeacher: boolean;
    openDrawer: boolean;
    handleOpenDrawer: (open?: boolean) => void;
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
    numColState: number;
    setNumColState: React.Dispatch<React.SetStateAction<number>>;
}

export function Live({
    isTeacher,
    openDrawer,
    handleOpenDrawer,
    contentIndexState,
    interactiveModeState,
    streamIdState,
    numColState,
    setNumColState,
}: LiveProps): JSX.Element {
    return (
        <WebRTCSFUContext.Provide>
            <ScreenShare.Provide>
                <GlobalWhiteboardContext>
                    <Layout
                        isTeacher={isTeacher}
                        openDrawer={openDrawer}
                        handleOpenDrawer={handleOpenDrawer}
                        contentIndexState={contentIndexState}
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                        numColState={numColState}
                        setNumColState={setNumColState}
                    >
                        {
                            isTeacher
                                ? <Teacher
                                    openDrawer={openDrawer}
                                    handleOpenDrawer={handleOpenDrawer}
                                    contentIndexState={contentIndexState}
                                    interactiveModeState={interactiveModeState}
                                    streamIdState={streamIdState}
                                    numColState={numColState}
                                />
                                : <Student openDrawer={openDrawer} />
                        }
                    </Layout>
                </GlobalWhiteboardContext>
            </ScreenShare.Provide>
        </WebRTCSFUContext.Provide>
    );
}
