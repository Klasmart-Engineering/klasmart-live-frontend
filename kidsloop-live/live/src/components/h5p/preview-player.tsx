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
            setFrameWidth(fWidth);
            setFrameHeight(fHeight)
            setScale(parentWidth / fWidth);
        });
    }, [ref.current, ref.current && ref.current.contentWindow]);

    // Need it?
    // useEffect(() => {
    //     if (frameWidth) { setScale(parentWidth / frameWidth); }
    // }, [parentWidth]);

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
