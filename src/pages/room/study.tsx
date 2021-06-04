import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { useServices } from "../../context-provider/services-provider";
import { useSessionContext } from "../../context-provider/session-context";
import { RoomProvider } from "../../providers/RoomContext";
import { ClassType } from "../../store/actions";
import { setDrawerOpen } from "../../store/reducers/control";
import { State } from "../../store/store";
import { getContentHref } from "../../utils/contentUtils";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { Layout } from "./layout-new";
import { InteractiveModeState, StreamIdState } from "./room";

interface StudyProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Study({
    interactiveModeState,
    streamIdState,
}: StudyProps): JSX.Element {
    const { classType: classtype, materials } = useSessionContext();
    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());

    useEffect(() => {
        dispatch(setDrawerOpen(classtype === ClassType.STUDY ? false : true));
    }, [])

    return (
        <RoomProvider>
            <GlobalWhiteboardContext>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    wrap="nowrap"
                    style={{ flexGrow: 1, overflow: "hidden", height: "100%", backgroundColor: "white" }}
                >
                    <Layout
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                        material={material}
                        materialKey={materialKey}
                        setMaterialKey={setMaterialKey}
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                    />
                </Grid>
            </GlobalWhiteboardContext>
        </RoomProvider>
    );
}
