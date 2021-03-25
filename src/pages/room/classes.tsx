import React, { useState, useContext } from "react";
import { RoomContext, InteractiveModeState, StreamIdState } from "./room";
import { useSelector } from "react-redux";
import { State } from "../../store/store";
import { Layout } from "./layout-new";
import { LocalSessionContext } from "../../entry";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";

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
        <RoomContext.Provide>
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
        </RoomContext.Provide>
    );
}
