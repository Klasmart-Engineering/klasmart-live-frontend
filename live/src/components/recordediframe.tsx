import React, { useRef, useEffect, Dispatch, SetStateAction, useState, useContext } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { UserContext } from '../app'
import IframeResizer from "iframe-resizer-react";

const SET_STREAMID = gql`
    mutation setSessionStreamId($roomId: ID!, $streamId: ID!) {
        setSessionStreamId(roomId: $roomId, streamId: $streamId)
    }
`;

export interface Props {
    contentId: string;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setStreamId?: (streamId: string) => any;
    maxWidth?: number;
    maxHeight?: number;
    parentWidth?: string | number;
    parentHeight?: string | number;
    setParentWidth?: Dispatch<SetStateAction<any>>;
    setParentHeight?: Dispatch<SetStateAction<any>>;
}

export function RecordedIframe(props: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(Math.random());
    const {roomId} = useContext(UserContext);
    const { contentId, setStreamId, setParentWidth, setParentHeight } = props;
    const [width, setWidth] = useState<string | number>("100%");
    const [maxHeight, setMaxHeight] = useState<number>(window.innerHeight * 0.8);
    const [numRenders, setRenders] = useState(0);

    const fitToScreen = (width: number, height: number) => {
        console.log("RESIZING!!!");
        const scale = maxHeight / Number(height);

        console.log(`height ${height}, width ${width}`);
        console.log(`maxHeight ${maxHeight}`);
        console.log(`scale ${scale}`);
        console.log(`NUMBER OF RENDERS ${numRenders}`);
        if (scale < 0.9) {
            setRenders(numRenders + 1);
            setWidth(Number(width) * scale);
            if(setParentHeight && setParentWidth) {
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
            // console.log("inject");
            if (!innerRef || !innerRef.contentDocument) { return; }
            const doc = innerRef.contentDocument;
            const h5pContent = doc.body.getElementsByClassName("h5p-content")[0];
            h5pContent.setAttribute("data-iframe-height", "");

            const script2 = doc.createElement("script");
            script2.setAttribute("type", "text/javascript");
            script2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
            doc.head.appendChild(script2);

            const script3 = doc.createElement("script");
            script3.setAttribute("type", "text/javascript");
            script3.setAttribute("src", "https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js");
            doc.head.appendChild(script3);
        }
        // window.document.addEventListener('load', inject)
        innerRef.addEventListener("load", inject);
        return () => innerRef.removeEventListener("load", inject);
    }, [ref.current]);

    const [sendStreamId] = useMutation(SET_STREAMID);
    useEffect(() => {
        // console.log("sending message");
        // if (!ref.current || !ref.current.contentWindow) { return }
        function onMessage({data}: MessageEvent) {
            // console.log("onMessage: ");
            // console.log(data);
            if (data && data.streamId) {
                if (setStreamId) { setStreamId(data.streamId); }
                sendStreamId({variables: {
                    roomId,
                    streamId: data.streamId,
                },
                });
            }
        }
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [ref.current]);

    function startRecording() {
        const innerRef = window.document.getElementById("recordedIframe-container") as HTMLIFrameElement;
        if (!innerRef ||
            !innerRef.contentWindow ||
            (innerRef.contentWindow as any).kidslooplive ||
            !innerRef.contentDocument) { return; }
        const doc = innerRef.contentDocument;

        const script = doc.createElement("script");
        script.setAttribute("type", "text/javascript");
        const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
        const prefix = matches && matches.length >= 2 ? matches[1] : "";
        script.setAttribute("src", `${prefix}record.js`);
        doc.head.appendChild(script);
    }

    return (
        <IframeResizer
            id="recordedIframe-container"
            // ref={forwardRef}
            forwardRef={ref}
            src={contentId}
            heightCalculationMethod="taggedElement"
            onResized={(e) => {
                startRecording()
                // console.log(e.height);
                // console.log(e.width);
                setWidth(e.width);
                if (e.height > maxHeight && numRenders < 1) {
                    fitToScreen(e.width, e.height);
                }

            }}
            // log
            key={key}
            style={{ width, margin: "0 auto" }}
        />
    );
}
