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
import { DoorOpen as ExitIcon } from "@styled-icons/bootstrap/DoorOpen";

interface StudyProps {
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Study({
    interactiveModeState,
    streamIdState,
}: StudyProps): JSX.Element {
    const { classType: classtype, organizationId, materials } = useSessionContext();
    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());
    const [recommendContent, setRecommendContent] = useState<string>("");
    
    const contentEndpoint = useHttpEndpoint("live");
    const { contentService } = useServices();

    function ramdomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {
        dispatch(setDrawerOpen(classtype === ClassType.STUDY ? false : true));
        if (organizationId) {
            async function fetchEverything() {
                async function fetchAllLessonMaterials() {
                    const payload = await contentService?.getAllLessonMaterials(organizationId);
                    const matList = payload!.list;
                    const dnds = matList.filter((mat: any) => {
                        const obj = JSON.parse(mat.data)
                        return obj.file_type === 5
                    })
                    let randomIdx: number
                    if (dnds.length === 0) {
                        randomIdx = ramdomInt(0, matList.length - 1);
                        const data = JSON.parse(matList[randomIdx].data);
                        const contentHref = getContentHref(data.source, contentEndpoint);
                        setRecommendContent(contentHref);
                    } else {
                        randomIdx = ramdomInt(0, dnds.length - 1);
                        const data = JSON.parse(dnds[randomIdx].data);
                        const contentHref = getContentHref(data.source, contentEndpoint);
                        setRecommendContent(contentHref);
                    }
                }
                try {
                    await Promise.all([fetchAllLessonMaterials()])
                } catch (err) {
                    console.error(`Fail to fetchAllLessonMaterials in Study: ${err}`)
                    setRecommendContent("");
                } finally { }
            }

            fetchEverything();
        }
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
                        recommendUrl={recommendContent ? recommendContent : undefined}
                    />
                </Grid>
            </GlobalWhiteboardContext>
        </RoomProvider>
    );
}
