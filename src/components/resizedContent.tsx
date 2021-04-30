import React, { useEffect, useRef, useState } from "react";
import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useWindowSize } from "../utils/viewport";
import { imageFrame } from "../utils/layerValues";
import { LessonMaterial } from "../lessonMaterialContext";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageFrame: {
            zIndex: imageFrame,
            maxWidth: "99%",
            maxHeight: `calc(100vh - ${theme.spacing(5)}px)`,
            margin: "0 auto",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
        },
    })
);

export interface Props {
    contentId: string;
}

export function ResizedIframe(props: Props): JSX.Element {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { contentId } = props;

    const [transformScale, setTransformScale] = useState<number>(1);
    const [contentWidth, setContentWidth] = useState(1600);
    const [contentHeight, setContentHeight] = useState(1400);
    const [cssTransform, setCssTransform] = useState(`scale(1.8)`);
    const [enableResize, setEnableResize] = useState(true);

    const size = useWindowSize();

    useEffect(() => {
        if(enableResize){
            scale(contentWidth, contentHeight);
        }
    }, [size])

    useEffect(() => {
        const iRef = window.document.getElementById("resizediframe") as HTMLIFrameElement;
        iRef.addEventListener("load", onLoad);
        return () =>  iRef.removeEventListener("resize", onLoad);
    }, [contentId]);

    const scale = (innerWidth: number, innerHeight: number) => {
        let currentWidth: number = size.width, currentHeight: number = size.height;

            const iRef = window.document.getElementById("classes-content-container") as HTMLIFrameElement;
            if (iRef) {
                currentWidth = iRef.getBoundingClientRect().width;
                currentHeight = iRef.getBoundingClientRect().height;
            }

        const shrinkRatioX = (currentWidth / innerWidth) > 1 ? 1 : currentWidth / innerWidth;
        const shrinkRatioY = (currentHeight / innerHeight) > 1 ? 1 : currentHeight / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    }

    function onLoad() {
        // TODO the client-side rendering version of H5P is ready! we can probably delete this function and the scale function above
        // if we switch over to it! Ask me (Daiki) about the details.
        const iframeElement = window.document.getElementById("resizediframe") as HTMLIFrameElement;
        const contentWindow = iframeElement.contentWindow
        const contentDoc = iframeElement.contentDocument
        if (!contentWindow || !contentDoc) { return; }

        // Custom styles when needed
        var style = document.createElement('style');
        style.innerHTML = `
        .h5p-content{
            display: inline-block !important;
            width: auto !important;
        }
        .h5p-course-presentation .h5p-wrapper{
            min-width: 1600px !important;
            min-height: 900px !important
        }
        .h5p-single-choice-set{
            max-height: 300px !important;
        }
        .h5p-multichoice .h5p-answers{
            display: flex;
        }
        .h5p-column .h5p-dragquestion > .h5p-question-content > .h5p-inner{
            width: 100% !important
        }
        `;
        contentDoc.head.appendChild(style);
        
        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);
        const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
        const h5pTypeColumn = contentDoc.body.getElementsByClassName("h5p-column").length;

        if(h5pTypeColumn){
            setEnableResize(false)
            h5pDivCollection[0].setAttribute("style", "width: 100% !important;");
        }else{
            setEnableResize(true)
             h5pDivCollection[0].setAttribute("style", "width: auto !important;");
        }

        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
            h5pContainer.setAttribute("data-iframe-height", "");
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
             setContentWidth(h5pWidth);
             setContentHeight(h5pHeight);
             scale(h5pWidth, h5pHeight);
        }

        // Listen to acvitity clicks (that change the height of h5p)
        contentDoc.addEventListener('mouseup', function(){
            setTimeout(function(){ 
                const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
                h5pContainer.setAttribute("data-iframe-height", "");
                const h5pWidth = h5pContainer.getBoundingClientRect().width;
                const h5pHeight = h5pContainer.getBoundingClientRect().height;

                setContentWidth(h5pWidth);
                setContentHeight(h5pHeight);
            }, 2000);
        }, false);           

    }

    return (
        <iframe
            id="resizediframe"
            src={contentId}
            ref={iframeRef}
            data-h5p-width={contentWidth}
            data-h5p-height={contentWidth}
            style={{
                width: enableResize ? contentWidth : '100%',
                height: enableResize ? contentHeight : '100%',
                position: enableResize ? `absolute` : 'static',
                transformOrigin: "center center",
                transform: enableResize ? `scale(${transformScale})` : `scale(0.8)`,
                minWidth: '100%',
                minHeight: '100%',
            }}
        />
    );
}

export function ImageFrame({ material }: { material: LessonMaterial }) {
    const { imageFrame } = useStyles();

    return (
        <Grid container>
            <Grid container item style={{
                height: "100%",
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundImage: `url(${material.url})`,
                filter: "blur(8px)",
                WebkitFilter: "blur(8px)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
            />
            <img
                className={imageFrame}
                src={material.url}
            />
        </Grid>
    )
}