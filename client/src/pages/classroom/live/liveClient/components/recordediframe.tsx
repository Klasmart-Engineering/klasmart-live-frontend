import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../app";

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
    parentWidth?: any;
    parentHeight?: any;
    maxWidth?: number;
    maxHeight?: number;
    setParentWidth?: Dispatch<SetStateAction<any>>;
    setParentHeight?: Dispatch<SetStateAction<any>>;
}

export function RecordedIframe(props: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(Math.random());
    const {roomId} = useContext(UserContext);
    const { contentId, frameProps, setStreamId, maxWidth, maxHeight,
        parentWidth, parentHeight, setParentHeight, setParentWidth } = props;

    useEffect(() => {
        if (!ref.current) { return; }
        ref.current.onload = () => {
            if (setParentWidth && setParentHeight) {
                setParentHeight("100%");
                setParentWidth("100%");
            }
            if (!ref.current || !ref.current.contentDocument) { return; }
            const doc = ref.current.contentDocument;
            // scaling and resize
            const elementHeight = doc.querySelectorAll(".h5p-container")[0].clientHeight;
            const elementWidth = doc.querySelectorAll(".h5p-container")[0].clientWidth;
            let scale = 1;
            if (parentHeight && parentWidth && maxWidth && maxHeight
                && !isNaN(parentWidth) && !isNaN(parentWidth)) {
                scale = parentHeight / elementHeight;
                if (setParentWidth && setParentHeight) {
                    const newParentHeight = elementHeight * scale;
                    const newParentWidth = elementWidth * scale;
                    setParentHeight(newParentHeight > maxHeight ? maxHeight : newParentHeight + 64);
                    setParentWidth(newParentWidth > maxWidth ? maxWidth : newParentWidth);
                    setKey(Math.random());
                }
            }
        };
    }, [ref.current]);

    useEffect(() => {
        if (!ref.current || !ref.current.contentDocument) { return; }
        const iframe = ref.current;
        function inject() {
            console.log("inject");
            if (!ref.current || !ref.current.contentDocument) { return; }
            const doc = ref.current.contentDocument;
            const script = doc.createElement("script");
            script.setAttribute("type", "text/javascript");
            const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
            const prefix = matches && matches.length >= 2 ? matches[1] : "";
            script.setAttribute("src", `${prefix}record.js`);
            doc.head.appendChild(script);
        }
        iframe.addEventListener("load", inject);
        return () => iframe.removeEventListener("load", inject);
    }, [key]);

    const [sendStreamId] = useMutation(SET_STREAMID);
    useEffect(() => {
        if (!ref.current || !ref.current.contentWindow) { return; }
        function onMessage({data}: MessageEvent) {
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
    }, [ref.current, ref.current && ref.current.contentWindow]);

    return <iframe key={key} ref={ref} src={contentId} {...frameProps}/>;
}
