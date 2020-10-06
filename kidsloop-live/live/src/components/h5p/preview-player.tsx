import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Typography from "@material-ui/core/Typography";
import Loading from "../loading";

const SUB_EVENTS = gql`
  subscription stream($streamId: ID!) {
    stream(streamId: $streamId) {
      id,
      event
    }
  }
`;

export interface Props {
    streamId: string;
    width?: number | string;
    height?: number | string;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>
}

export function PreviewPlayer({ streamId, frameProps, width, height }: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [{ frameWidth, frameHeight }, setWidthHeight] = useState({ frameWidth: 0, frameHeight: 0 });

    // Buffer events until we have a page ready to render them
    const { current: bufferedEvents } = useRef<string[]>([]);
    function sendEvent(event?: string) {
        if (ref.current && ref.current.contentWindow && ((ref.current.contentWindow as any).PLAYER_READY)) {
            while (bufferedEvents.length > 0) {
                const event = bufferedEvents.shift();
                ref.current.contentWindow.postMessage({ event }, "*");
            }
            if (event) { ref.current.contentWindow.postMessage({ event }, "*"); }
        } else if (event) {
            bufferedEvents.push(event);
        }
    }

    // When the page is ready, start sending buffered events
    useEffect(() => {
        if (!ref.current || !ref.current.contentWindow || !ref.current.contentWindow) { return; }
        const iframeWindow = ref.current.contentWindow;
        const listener = (e: MessageEvent) => { if (e.data === "ready") { sendEvent(); } };
        iframeWindow.addEventListener("message", listener);
        return () => {
            if (iframeWindow && iframeWindow.removeEventListener) {
                iframeWindow.removeEventListener("message", listener);
            }
        }
    }, [ref.current, ref.current && ref.current.contentWindow]);

    const { loading, error } = useSubscription(SUB_EVENTS, {
        onSubscriptionData: e => sendEvent(e.subscriptionData.data.stream.event),
        variables: { streamId },
    });

    const [scale, setScale] = useState(1);
    useEffect(() => {
        if (ref.current == null || ref.current.contentWindow == null) { return; }
        window.addEventListener("message", ({ data }) => {
            if (!data || !data.width || !data.height) { return; }
            const fWidth = Number(data.width.replace("px", ""));
            const fHeight = Number(data.height.replace("px", ""));
            setWidthHeight({ frameWidth: fWidth, frameHeight: fHeight });
            if (width && height) {
                setScale(Math.min(Number(width) / fWidth, Number(height) / fHeight));
            }
        });
    }, [ref.current, ref.current && ref.current.contentWindow]);

    useEffect(() => {
        if (typeof width === "number" && typeof height === "number") {
            setScale(Math.min(width / frameWidth, height / frameHeight));
        }
    }, [width, height]);

    if (loading) { return <Loading />; }
    if (error) { return <Typography><FormattedMessage id="failed_to_connect" />: {JSON.stringify(error)}</Typography>; }
    return <div id="preview-iframe-container" style={{ width, height }}>
        <iframe
            key={streamId}
            ref={ref}
            style={{
                visibility: loading ? "hidden" : "visible",
                transformOrigin: "top left",
                transform: `scale(${scale})`
            }}
            src={"player.html"}
            width={frameWidth}
            height={frameHeight}
            {...frameProps}
        />
    </div>;
}
