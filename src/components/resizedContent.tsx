import React, { useEffect, useRef, useState } from "react";
import { Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { imageFrame } from "../utils/layerValues";
import { LessonMaterial } from "../lessonMaterialContext";
import { useMaterialToHref } from "../utils/contentUtils";
import { injectIframeScript } from "../utils/injectIframeScript";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imageFrame: {
            zIndex: imageFrame,
            maxWidth: `100%`,
            maxHeight: `100%`,
            height: `auto`,
            display: `block`,
            margin: "0 auto",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
        },
    })
);

export interface Props {
    contentHref: string;
}

export function ResizedIframe(props: Props): JSX.Element {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { contentHref } = props;

    const isPdfContent = contentHref.endsWith(`.pdf`);

    const [contentWidth, setContentWidth] = useState(1600);
    const [contentHeight, setContentHeight] = useState(1400);
    const [useDoubleSize, setUseDoubleSize] = useState<boolean>(false);

    useEffect(() => {
        const iRef = window.document.getElementById("resizediframe") as HTMLIFrameElement;
        iRef.addEventListener("load", onLoad);
        return () => iRef.removeEventListener("resize", onLoad);
    }, [contentHref]);

    function onLoad() {
        // TODO the client-side rendering version of H5P is ready! we can probably delete this function and the scale function above
        // if we switch over to it! Ask me (Daiki) about the details.
        const iframeElement = window.document.getElementById("resizediframe") as HTMLIFrameElement;
        const contentWindow = iframeElement.contentWindow
        const contentDoc = iframeElement.contentDocument
        if (!contentWindow || !contentDoc) { return; }

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);
        const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
        const h5pTypeColumn = contentDoc.body.getElementsByClassName("h5p-column").length;

        setUseDoubleSize(h5pTypeColumn > 0);

        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;

            h5pContainer.setAttribute("style", "width: 100% !important;");

            h5pContainer.setAttribute("data-iframe-height", "");
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
            setContentWidth(h5pWidth);
            setContentHeight(h5pHeight);
        }

        // Listen to acvitity clicks (that change the height of h5p)
        contentDoc.addEventListener('mouseup', function () {
            setTimeout(function () {
                const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
                h5pContainer.setAttribute("data-iframe-height", "");
                const h5pWidth = h5pContainer.getBoundingClientRect().width;
                const h5pHeight = h5pContainer.getBoundingClientRect().height;

                setContentWidth(h5pWidth);
                setContentHeight(h5pHeight);
            }, 2000);
        }, false);

        if (!isPdfContent) {
            injectIframeScript(iframeElement, "h5presize");
        }
    }

    return (
        <iframe
            id="resizediframe"
            src={isPdfContent ? `pdfviewer.html?pdfSrc=${contentHref}` : contentHref}
            ref={iframeRef}
            allow="microphone"
            data-h5p-width={contentWidth}
            data-h5p-height={contentHeight}
            style={{
                width: isPdfContent ? `100%` : (useDoubleSize ? `50%` : `100%`),
                height: isPdfContent ? `100%` : (useDoubleSize ? `50%` : `100%`),
                position: 'static',
                transformOrigin: "center center",
                transform: isPdfContent ? `scale(1)` : (useDoubleSize ? `scale(2)` : `scale(1)`),
            }}
        />
    );
}

export function ImageFrame({ material }: { material: LessonMaterial }) {
    const { imageFrame } = useStyles();

    const [contentHref] = useMaterialToHref(material);

    return (
        <Grid container style={{ height: "100%" }}>
            <Grid container item style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundImage: `url(${contentHref})`,
                filter: "blur(8px)",
                WebkitFilter: "blur(8px)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
            />
            <div className="image-container" style={{ maxWidth: "100%", maxHeight: "100%", zIndex: 994, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img
                    className={imageFrame}
                    src={contentHref}
                />
            </div>
        </Grid>
    )
}