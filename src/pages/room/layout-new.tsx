import React, { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { LessonMaterial } from "../../lessonMaterialContext"
import { ContentIndexState, InteractiveModeState, StreamIdState } from "./room";
import { ClassContentContainer } from "../../components/classContent/classContent";
import { DrawerContainer } from "../../components/drawer/drawer";
import { LocalSession } from "../../entry";
import { ClassType } from "../../store/actions";
import { setDrawerOpen } from "../../store/reducers/control";

interface LayoutProps {
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
    material: LessonMaterial | undefined;
    materialKey: number;
    setMaterialKey: React.Dispatch<React.SetStateAction<number>>;
    tabIndex: number;
    setTabIndex: React.Dispatch<React.SetStateAction<number>>;
    recommandUrl?: string;
}

export function Layout({
    contentIndexState,
    interactiveModeState,
    streamIdState,
    material,
    materialKey,
    setMaterialKey,
    tabIndex,
    setTabIndex,
    recommandUrl,
}: LayoutProps): JSX.Element {
    const { classtype } = useContext(LocalSession);
    const dispatch = useDispatch();
    const { streamId } = streamIdState;

    useEffect(() => {
        dispatch(setDrawerOpen(classtype === ClassType.STUDY ? false : true));
    }, [])

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            wrap="nowrap"
            style={{ flexGrow: 1, overflow: "hidden", height: "100%" }}
        >
            <ClassContentContainer
                contentIndexState={contentIndexState}
                materialKey={materialKey}
                recommandUrl={recommandUrl}
            />
            {classtype === ClassType.STUDY ? null :
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
    );
}
