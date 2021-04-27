import React, { useEffect, useRef, useState } from "react";
import { useWindowSize } from "../utils/viewport";

export interface Props {
    contentId: string;
}

enum LoadStatus {
    Error,
    Loading,
    Finished,
}

export function ResizedIframe(props: Props): JSX.Element {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { contentId } = props;

    const [transformScale, setTransformScale] = useState<number>(1);
    const [contentWidth, setContentWidth] = useState(1600);
    const [contentHeight, setContentHeight] = useState(1400);
    const size = useWindowSize();

    useEffect(() => {
        scale(contentWidth, contentHeight);
    }, [size])

    useEffect(() => {
        const iRef = window.document.getElementById("resizediframe") as HTMLIFrameElement;
        iRef.addEventListener("load", onLoad);
        return () => iRef.removeEventListener("load", onLoad);
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

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);
        const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
            h5pContainer.setAttribute("data-iframe-height", "");
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
            setContentWidth(h5pWidth);
            setContentHeight(h5pHeight);
            scale(h5pWidth, h5pHeight);
        }
    }

    return (
        <iframe
            id="resizediframe"
            src={contentId}
            ref={iframeRef}
            style={{
                width: contentWidth,
                height: contentHeight,
                position: `absolute`,
                top: 0,
                left: 0,
                transformOrigin: "top left",
                transform: `scale(${transformScale})`,
            }}
        />
    );
}
