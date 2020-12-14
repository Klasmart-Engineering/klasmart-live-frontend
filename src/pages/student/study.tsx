import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import Loading from "../../components/loading";
import { State } from "../../store/store";
import { setContentIndex } from "../../store/reducers/control";
import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { useServices } from "../../context-provider/services-provider";
import { useUserContext } from "../../context-provider/user-context";

interface NewProps extends IframeResizer.IframeResizerProps {
    forwardRef: any
}
const IframeResizerNew = IframeResizer as React.FC<NewProps>

export default function Study(): JSX.Element {
    const dispatch = useDispatch();
    const { materials } = useUserContext();

    const { contentService } = useServices();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    // const mats = useSelector((store: State) => store.data.materials)
    const contentIndex = useSelector((store: State) => store.control.contentIndex)

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [recommandUrl, setRecommandUrl] = useState<string>("");

    const liveContentEndpoint = useHttpEndpoint("live");

    function ramdomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    useEffect(() => {
        async function fetchEverything() {
            async function fetchAllLessonMaterials() {
                if (!contentService) return;

                const payload = await contentService.searchContents(selectedOrg.organization_id, "published", "update_at", 1);
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
    }, [contentService])

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        setContentWidth(width);
        setContentHeight(height);
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
            <Grid item xs={1}>
                <IconButton disabled={contentIndex <= 0} aria-label="go to prev activity" onClick={() => dispatch(setContentIndex(contentIndex - 1))}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Grid>
            <Grid
                item
                xs={10}
                style={{
                    position: "relative",
                    margin: "0 auto",
                    height: "100%",
                }}
            >
                <Whiteboard uniqueId="student" />
                {contentWidth && contentHeight ? (
                    <ResizedIframe
                        parentHeight={contentHeight}
                        contentUrl={contentIndex === materials.length
                            ? `${liveContentEndpoint}${recommandUrl}`
                            : `${liveContentEndpoint}${materials[contentIndex].url}`
                        }
                    />
                ) : <Loading rawText={"Loading the lesson material!"} />}
            </Grid>
            <Grid item xs={1}>
                <IconButton disabled={contentIndex >= materials.length} aria-label="go to next activity" onClick={() => dispatch(setContentIndex(contentIndex + 1))}>
                    <ArrowForwardIcon fontSize="large" />
                </IconButton>
            </Grid>
        </Grid>
    )
}

// WIP (Isu)
function ResizedIframe({ parentHeight, contentUrl }: { parentHeight: number, contentUrl: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [key, setKey] = useState(Math.random());
    // const [isFlashCards, setIsFlashCards] = useState(false);
    // const [iframeWidth, setIframeWidth] = useState<number | string>("100%");
    // const [iframeHeight, setIframeHeight] = useState<number | string>(700);
    // const [minHeight, setMinHeight] = useState<number>();
    // const [numRenders, setNumRenders] = useState(0);

    // function scaleToFitParent(iframeWidth: number, iframeHeight: number) {
    //     const scale = parentHeight / iframeHeight;
    //     console.log("scale: ", scale)
    //     if (scale < 0.9) {
    //         const width = iframeWidth * scale;
    //         const height = iframeHeight * scale;
    //         setIframeWidth(width);
    //         setIframeHeight(height);
    //         setKey(Math.random());
    //     }
    // }

    // function inject(iframeElement: HTMLIFrameElement) {
    //     const contentWindow = iframeElement.contentWindow
    //     const contentDoc = iframeElement.contentDocument

    //     if (!contentWindow || !contentDoc) { return; }
    //     // IP Protection
    //     const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
    //     contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);

    //     const isFlashCards = contentDoc.body.getElementsByClassName("h5p-flashcards").length >= 1;
    //     setIsFlashCards(isFlashCards);
    //     const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
    //     // TODO: Is it possible to handle all non-h5p content with this line?
    //     const contentDivCollection = contentDoc.body.getElementsByClassName("content");
    //     if (h5pDivCollection.length > 0) {
    //         const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
    //         h5pContainer.style.overflow = isFlashCards ? "auto" : "hidden";
    //         h5pContainer.setAttribute("data-iframe-height", "");
    //     } else if (contentDivCollection.length > 0) {
    //         contentDivCollection[0].setAttribute("data-iframe-height", "");
    //     } else {
    //         setMinHeight(700);
    //     }

    //     const cdnResizerScript = contentDoc.createElement("script");
    //     cdnResizerScript.setAttribute("type", "text/javascript");
    //     cdnResizerScript.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
    //     contentDoc.head.appendChild(cdnResizerScript);

    //     const h5pResizerScript = contentDoc.createElement("script");
    //     h5pResizerScript.setAttribute("type", "text/javascript");
    //     h5pResizerScript.setAttribute("src", "https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js");
    //     contentDoc.head.appendChild(h5pResizerScript);

    //     return contentWindow.removeEventListener("contextmenu", (e) => blockRightClick(e), false);
    // }

    // useEffect(() => {
    //     const iRef = window.document.getElementById("resized-iframe") as HTMLIFrameElement;
    //     if (!iRef) { return; }

    //     const onIframeLoad = () => {
    //         inject(iRef);
    //     }

    //     iRef.addEventListener("load", onIframeLoad);
    //     return () => iRef.removeEventListener("load", onIframeLoad);
    // }, [key])

    // useEffect(() => {
    //     setIsFlashCards(false);
    //     setKey(Math.random());
    //     setIframeWidth("100%");
    // }, [contentUrl]);

    return (
        <IframeResizerNew
            id="resized-iframe"
            allow="microphone"
            forwardRef={iframeRef}
            src={contentUrl}
            checkOrigin={false}
            scrolling
            draggable
            style={{
                width: "100%",
                height: "100%"
            }}

        // key={key}
        // heightCalculationMethod="taggedElement"
        // minHeight={minHeight}
        // onResized={(e) => {
        //     setNumRenders(numRenders + 1);
        //     const width = Number(e.width), height = Number(e.height);
        //     if (isFlashCards) {
        //         setIframeHeight(height)
        //     } else if (height > parentHeight && numRenders < 2) {
        //         scaleToFitParent(width, height)
        //     }
        // }}
        // onInit={(iframe) => {
        //     // After resizing is complete.                        
        //     setIframeWidth("100%");
        //     setNumRenders(0);
        //     setIsFlashCards(false);
        // }}
        />
    )
}