import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { RoomContext, InteractiveModeState, StreamIdState } from "./room";
import { ClassContentContainer } from "../../components/classContent/classContent";
import { DrawerContainer } from "../../components/drawer/drawer";
import { UserContext } from "../../entry";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { setDrawerOpen } from "../../store/reducers/control";

interface ClassesProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Classes({
    interactiveModeState,
    streamIdState,
}: ClassesProps): JSX.Element {
    const { classType, materials } = useContext(UserContext);
    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());
    const { streamId } = streamIdState;

    useEffect(() => {
        dispatch(setDrawerOpen(classType === ClassType.STUDY ? false : true));
    }, [])

    return (
        <RoomContext.Provide>
            <GlobalWhiteboardContext>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    wrap="nowrap"
                    style={{ flexGrow: 1, overflow: "hidden", height: "100%" }}
                >
                    <ClassContentContainer materialKey={materialKey} />
                    {classType === ClassType.STUDY ? null :
                        <DrawerContainer
                            interactiveModeState={interactiveModeState}
                            streamId={streamId}
                            material={material}
                            tabIndex={tabIndex}
                            setTabIndex={setTabIndex}
                            setMaterialKey={setMaterialKey}
                        />
                    }
                </Grid>
            </GlobalWhiteboardContext>
        </RoomContext.Provide>
    );
}
