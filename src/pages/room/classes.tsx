import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";

import { RoomContext, InteractiveModeState, StreamIdState } from "./room";
import { Layout } from "./layout-new";
import { ClassContentContainer } from "../../components/classContent/classContent";
import { DrawerContainer } from "../../components/drawer/drawer";
import { UserContext } from "../../entry";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";

interface ClassesProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Classes({
    interactiveModeState,
    streamIdState,
}: ClassesProps): JSX.Element {
    const { materials } = useContext(UserContext);
    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());
    const { streamId } = streamIdState;

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
