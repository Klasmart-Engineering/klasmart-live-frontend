const qs = require("qs");
import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";

import { RoomContext, InteractiveModeState, StreamIdState, ContentIndexState } from "./room";
import { Layout } from "./layout-new";
import { LocalSessionContext } from "../../entry";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import { ClassType } from "../../store/actions";
import { setDrawerOpen } from "../../store/reducers/control";

interface StudyProps {
    contentIndexState: ContentIndexState;
    interactiveModeState: InteractiveModeState;
    streamIdState: StreamIdState;
}

export function Study({
    contentIndexState,
    interactiveModeState,
    streamIdState,
}: StudyProps): JSX.Element {
    const { classtype, org_id, materials } = useContext(LocalSessionContext);
    const dispatch = useDispatch();
    const { contentIndex } = contentIndexState;
    const material = contentIndex >= 0 && contentIndex < materials.length ? materials[contentIndex] : undefined;

    const { streamId } = streamIdState;
    const [tabIndex, setTabIndex] = useState(0);
    const [materialKey, setMaterialKey] = useState(Math.random());
    const [recommandUrl, setRecommandUrl] = useState<string>("");

    function ramdomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // https://swagger-ui.kidsloop.net/#/content/searchContents
    async function getAllLessonMaterials() {
        const CMS_ENDPOINT = `${process.env.ENDPOINT_CMS}`;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const encodedParams = qs.stringify({
            publish_status: "published",
            order_by: "update_at",
            content_type: 1,
            org_id,
        }, { encodeValuesOnly: true });
        const response = await fetch(`${CMS_ENDPOINT}/v1/contents?${encodedParams}`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        dispatch(setDrawerOpen(classtype === ClassType.STUDY ? false : true));
        if (org_id) {
            async function fetchEverything() {
                async function fetchAllLessonMaterials() {
                    const payload = await getAllLessonMaterials();
                    const matList = payload.list;
                    const dnds = matList.filter((mat: any) => {
                        const obj = JSON.parse(mat.data)
                        return obj.file_type === 5
                    })
                    let randomIdx: number
                    if (dnds.length === 0) {
                        randomIdx = ramdomInt(0, matList.length - 1);
                        const data = JSON.parse(matList[randomIdx].data);
                        setRecommandUrl(`/h5p/play/${data.source}`);
                    } else {
                        randomIdx = ramdomInt(0, dnds.length - 1);
                        const data = JSON.parse(dnds[randomIdx].data);
                        setRecommandUrl(`/h5p/play/${data.source}`);
                    }
                }
                try {
                    await Promise.all([fetchAllLessonMaterials()])
                } catch (err) {
                    console.error(`Fail to fetchAllLessonMaterials in Study: ${err}`)
                    setRecommandUrl("");
                } finally { }
            }

            fetchEverything();
        }
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
                    <Layout
                        contentIndexState={contentIndexState}
                        interactiveModeState={interactiveModeState}
                        streamIdState={streamIdState}
                        material={material}
                        materialKey={materialKey}
                        setMaterialKey={setMaterialKey}
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        recommandUrl={recommandUrl ? recommandUrl : undefined}
                    />
                </Grid>
            </GlobalWhiteboardContext>
        </RoomContext.Provide>
    );
}
