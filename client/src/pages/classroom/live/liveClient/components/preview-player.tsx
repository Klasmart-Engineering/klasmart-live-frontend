import { useSubscription } from "@apollo/react-hooks";
import { CircularProgress, Typography } from "@material-ui/core";
import { gql } from "apollo-boost";
import * as queryString from "query-string";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

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
    width?: number;
    height?: number;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
}

export function PreviewPlayer({ streamId, frameProps, width, height }: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [{ frameWidth, frameHeight }, setWidthHeight] = useState({ frameWidth: "0", frameHeight: "0" });

    // Buffer events until we have a page ready to render them
    const {current: bufferedEvents} = useRef<string[]>([]);
    function sendEvent(event?: string) {
        if (ref.current && ref.current.contentWindow && ((ref.current.contentWindow as any).PLAYER_READY)) {
            while (bufferedEvents.length > 0) {
                const event = bufferedEvents.shift();
                ref.current.contentWindow.postMessage({ event }, "*");
            }
            if (event) {ref.current.contentWindow.postMessage({ event }, "*"); }
        } else if (event) {
            bufferedEvents.push(event);
        }
    }

    // When the page is ready, start sending buffered events
    useEffect(() => {
        if (!ref.current || !ref.current.contentWindow || !ref.current.contentWindow) { return; }
        const iframeWindow = ref.current.contentWindow;
        const listener = (e: MessageEvent) => {if (e.data === "ready") {sendEvent(); }};
        iframeWindow.addEventListener("message", listener);
        return () => iframeWindow.removeEventListener("message", listener);
    });

    const { loading, error } = useSubscription(SUB_EVENTS, {
        onSubscriptionData: (e) => sendEvent(e.subscriptionData.data.stream.event),
        variables: { streamId },
    });

    const [scale, setScale] = useState(1);
    useEffect(() => {
        if (ref.current == null || ref.current.contentWindow == null) { return; }
        window.addEventListener("message", ({ data }) => {
            if (!data || !data.width || !data.height) { return; }
            setWidthHeight({ frameWidth: data.width, frameHeight: data.height});
            const frameWidth = Number(data.width.replace("px", ""));
            const frameHeight = Number(data.height.replace("px", ""));
            if (width && height) {
                setScale(Math.min(width / frameWidth, height / frameHeight));
            }
        });
    }, [ref.current, ref.current && ref.current.contentWindow]);

    if (loading) {return <CircularProgress />; }
    if (error) {return <Typography><FormattedMessage id="live_failedToConnect" />: {JSON.stringify(error)}</Typography>; }
    return <div style={{ width, height }}>
        <iframe
            ref={ref}
            style={{
                visibility: loading ? "hidden" : "visible",
                transformOrigin: "top left",
                transform: `scale(${scale})`,
            }}
            src={"player.html"}
            width={frameWidth}
            height={frameHeight}
            {...frameProps}
        />
    </div>;
}
