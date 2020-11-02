import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import { UserContext } from "../../entry";
import { LessonMaterial, MaterialTypename } from "../../lessonMaterialContext";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { State } from "../../store/store";
import { setContentIndex } from "../../store/reducers/control";

interface NewProps extends IframeResizer.IframeResizerProps {
    forwardRef: any
}
const IframeResizerNew = IframeResizer as React.FC<NewProps>

export default function Study(): JSX.Element {
    const dispatch = useDispatch();

    const { materials } = useContext(UserContext);
    const mats = useSelector((store: State) => store.data.materials)
    const contentIndex = useSelector((store: State) => store.control.contentIndex)
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState<number>(0);
    const [recommandUrl, setRecommandUrl] = useState<string>("");

    function ramdomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async function getAllLessonMaterials() {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`v1/contents?publish_status=published&content_type=1`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
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
                console.error(`Fail to fetchAllLessonMaterials: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [])

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [rootDivRef.current]);

    return (
        <Grid
            id="study-content-container"
            ref={rootDivRef}
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item
            xs={12}
            style={{ width: "100%", height: "100%" }}
        >
            <Grid item>
                <IconButton disabled={contentIndex <= 0} aria-label="go to prev activity" onClick={() => dispatch(setContentIndex(contentIndex - 1))}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Grid>
            <Grid
                item
                style={squareSize ? {
                    position: "relative",
                    margin: "0 auto",
                    width: squareSize,
                    height: squareSize
                } : {
                        position: "relative",
                        margin: "0 auto",
                        height: "100%"
                    }
                }>
                <Whiteboard uniqueId="student" />
                {contentIndex === mats.length ?
                    <IframeResizerNew
                        forwardRef={iframeRef}
                        src={recommandUrl}
                        style={{ width: "100%", height: "100%" }}
                    /> :
                    <IframeResizerNew
                        forwardRef={iframeRef}
                        src={mats[contentIndex].url}
                        style={{ width: "100%", height: "100%" }}
                    />
                }
            </Grid>
            <Grid item>
                <IconButton disabled={contentIndex >= mats.length} aria-label="go to next activity" onClick={() => dispatch(setContentIndex(contentIndex + 1))}>
                    <ArrowForwardIcon fontSize="large" />
                </IconButton>
            </Grid>
        </Grid>
    )
}
