import React, { useCallback, useEffect, useRef, useState } from "react";
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

export default function PreviewPlayer({ streamId, frameProps, parentWidth, parentHeight }: {
    streamId: string;
    parentWidth: number;
    parentHeight: number;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>
}): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    const [frameWidth, setFrameWidth] = useState(0);
    const [frameHeight, setFrameHeight] = useState(0);

    const { current: bufferedEvents } = useRef<string[]>([]);

    const sendBufferedEvents = useCallback(() => {
        if (!ref.current) return;

        const contentWindow = ref.current.contentWindow;
        if (!contentWindow) return;

        while (bufferedEvents.length > 0) {
            const event = bufferedEvents.shift();
            contentWindow.postMessage({ event }, "*");
        }
    }, [bufferedEvents, ref.current]);

    function sendEvent(event?: string) {
        if (ref.current && ref.current.contentWindow && ((ref.current.contentWindow as any).PLAYER_READY)) {
            sendBufferedEvents();

            if (event) { ref.current.contentWindow.postMessage({ event }, "*"); }
        } else if (event) {
            bufferedEvents.push(event);
        }
    }
    const { loading, error } = useSubscription(SUB_EVENTS, {
        onSubscriptionData: e => sendEvent(e.subscriptionData.data.stream.event),
        variables: { streamId },
    });

    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!ref.current) return;

        const handleMessage = ({ data }: MessageEvent) => {
            if (data === 'ready') {
                sendBufferedEvents();
            } else if (data.width && data.height) {
                const fWidth = Number(data.width.replace("px", ""));
                const fHeight = Number(data.height.replace("px", ""));
                setFrameWidth(fWidth);
                setFrameHeight(fHeight)
                setScale(parentWidth / fWidth);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        }
    }, [ref.current, sendBufferedEvents]);

    if (loading) { return <Loading />; }
    if (error) { return <Typography><FormattedMessage id="failed_to_connect" />: {JSON.stringify(error)}</Typography>; }
    return (
        <div
            id="preview-iframe-container"
            style={{
                width: parentWidth,
                height: parentHeight,
            }}
        >
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
        </div>
    );
}
