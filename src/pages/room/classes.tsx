import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { LocalSessionContext } from "../../entry";
import { RoomProvider } from "../../providers/RoomProvider";
import { State } from "../../store/store";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { Layout } from "./layout-new";
import { InteractiveModeState, StreamIdState } from "./room";

interface ClassesProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Classes({
    interactiveModeState,
    streamIdState,
}: ClassesProps): JSX.Element {
    const { materials } = useContext(LocalSessionContext);
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;
    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());

    return (
        <RoomProvider>
            <GlobalWhiteboardContext>
                <Layout
                    interactiveModeState={interactiveModeState}
                    streamIdState={streamIdState}
                    material={material}
                    materialKey={materialKey}
                    setMaterialKey={setMaterialKey}
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                />
            </GlobalWhiteboardContext>
        </RoomProvider>
    );
}
