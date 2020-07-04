import IframeResizer from "iframe-resizer-react";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export interface Props {
    contentId: string;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
    parentWidth?: string | number;
    parentHeight?: string | number;
    setParentWidth?: Dispatch<SetStateAction<any>>;
    setParentHeight?: Dispatch<SetStateAction<any>>;
}

export default function ResizedIframe(props: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(Math.random());
    const { contentId, frameProps, parentWidth, parentHeight, setParentWidth, setParentHeight } = props;
    const [width, setWidth] = useState<string | number>("100%");
    const [maxHeight, setMaxHeight] = useState<number>(window.innerHeight * 0.8);
    const [numRenders, setRenders] = useState(0);

    const fitToScreen = (width: number, height: number) => {
        const scale = maxHeight / Number(height);

        if (scale < 0.9) {
            setRenders(numRenders + 1);
            setWidth(Number(width) * scale);
            if (setParentHeight && setParentWidth) {
                setParentHeight(maxHeight);
                setParentWidth(width);
            }
            setKey(Math.random());
        }
    };

    useEffect(() => {
        setWidth("100%");
        setRenders(0);
    }, [contentId]);

    useEffect(() => {
        const innerRef = window.document.getElementById("recordedIframe-container") as HTMLIFrameElement;
        if (!innerRef) { return; }
        innerRef.addEventListener("load", inject);

        function inject() {
            if (!innerRef || !innerRef.contentDocument) { return; }
            const doc = innerRef.contentDocument;
            const h5pContent = doc.body.getElementsByClassName("h5p-content")[0];
            h5pContent.setAttribute("data-iframe-height", "");

            const script = doc.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
            doc.head.appendChild(script);
        }
        innerRef.addEventListener("load", inject);
        return () => innerRef.removeEventListener("load", inject);
    }, [ref.current]);

    return (
        <IframeResizer
            id="recordedIframe-container"
            forwardRef={ref}
            src={`/h5p/play/${contentId}`}
            heightCalculationMethod="taggedElement"
            onResized={(e) => {
                setWidth(e.width);
                if (e.height > maxHeight && numRenders < 1) {
                    fitToScreen(e.width, e.height);
                }
            }}
            key={key}
            style={{ width, margin: "0 auto" }}
        />
    );
}
