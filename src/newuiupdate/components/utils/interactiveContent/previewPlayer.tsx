import { useWindowSize } from "../../../../utils/viewport";
import { LIVE_LINK } from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import { isLessonPlanOpenState } from "../../../states/layoutAtoms";
import Loading from "./loading";
import { gql, useSubscription } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import React, {
    useContext,
    useEffect, useRef, useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

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
    width: any;
    height: any;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
    container?: any;
}

export function PreviewPlayer ({
    streamId, frameProps, width, height, container,
}: Props): JSX.Element {
    const ref = useRef<HTMLIFrameElement>(null);
    // const [ scale, setScale ] = useState(1);
    const [ { frameWidth, frameHeight }, setWidthHeight ] = useState({
        frameWidth: 0,
        frameHeight: 0,
    });

    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ transformScale, setTransformScale ] = useState<number>(1);

    const { content } = useContext(RoomContext);

    const size = useWindowSize();

    useEffect(() => {
        scale(frameWidth, frameHeight);
        setTimeout(function (){
            scaleWhiteboard();
        }, 300);
        /*const innerActitivity = window.document.getElementById(container) as HTMLIFrameElement;
        innerActitivity.width = String(frameWidth);
        innerActitivity.height = String(frameHeight);*/
    }, [
        size,
        content,
        ref.current,
        ref.current && ref.current.contentWindow,
        isLessonPlanOpen,
    ]);

    const scale = (innerWidth: number, innerHeight: number) => {
        let currentWidth: number = size.width, currentHeight: number = size.height;

        const iRef = window.document.getElementById(container) as HTMLIFrameElement;
        if (iRef) {
            currentWidth = iRef.getBoundingClientRect().width;
            currentHeight = iRef.getBoundingClientRect().height;
        }

        const shrinkRatioX = currentWidth / innerWidth;
        const shrinkRatioY =  currentHeight / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    };

    const scaleWhiteboard = () => {
        const previewIframe = ref.current as HTMLIFrameElement;
        const previewIframeStyles = previewIframe.getAttribute(`style`);
        const whiteboard = window.document.getElementsByClassName(`canvas-container`)[0];
        // window.document.getElementsByClassName(`lower-canvas`)[0].setAttribute(`style`, window.document.getElementsByClassName(`lower-canvas`)[0].getAttribute(`style`) + `; transform: scale(2); transform-origin: top left;`);
        window.document.getElementsByClassName(`lower-canvas`)[0].setAttribute(`style`, window.document.getElementsByClassName(`lower-canvas`)[0].getAttribute(`style`) + `;`);
        window.document.getElementsByClassName(`upper-canvas`)[0].setAttribute(`style`,  window.document.getElementsByClassName(`upper-canvas`)[0].getAttribute(`style`) + `;`);
        if(previewIframeStyles){
            whiteboard.setAttribute(`style`, previewIframeStyles);
        }
    };

    // Buffer events until we have a page ready to render them
    const { current: bufferedEvents } = useRef<string[]>([]);
    function sendEvent (event?: string) {
        if (ref.current && ref.current.contentWindow && ((ref.current.contentWindow as any).PLAYER_READY)) {
            while (bufferedEvents.length > 0) {
                const event = bufferedEvents.shift();
                ref.current.contentWindow.postMessage({
                    event,
                }, `*`);
            }
            if (event) { ref.current.contentWindow.postMessage({
                event,
            }, `*`); }
        } else if (event) {
            bufferedEvents.push(event);
        }
    }

    // When the page is ready, start sending buffered events
    useEffect(() => {
        if (!ref.current || !ref.current.contentWindow || !ref.current.contentWindow) { return; }
        const iframeWindow = ref.current.contentWindow;
        const listener = (e: MessageEvent) => { if (e.data === `ready`) { sendEvent(); } };
        iframeWindow.addEventListener(`message`, listener);
        return () => {
            if (iframeWindow && iframeWindow.removeEventListener) {
                iframeWindow.removeEventListener(`message`, listener);
            }
        };
    }, [ ref.current, ref.current && ref.current.contentWindow ]);

    const { loading, error } = useSubscription(SUB_EVENTS, {
        onSubscriptionData: e => sendEvent(e.subscriptionData.data.stream.event),
        variables: {
            streamId,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        console.log(ref.current);
        if (ref.current == null || ref.current.contentWindow == null) { return; }
        window.addEventListener(`message`, ({ data }) => {
            if (!data || !data.width || !data.height) { return; }
            const fWidth = Number(data.width.replace(`px`, ``));
            const fHeight = Number(data.height.replace(`px`, ``));
            setWidthHeight({
                frameWidth: fWidth,
                frameHeight: fHeight,
            });
            console.log(`message`);
        });
        setTimeout(function (){
            window.dispatchEvent(new Event(`resize`));
        }, 1000);
    }, [
        ref.current,
        ref.current && ref.current.contentWindow,
        isLessonPlanOpen,
    ]);

    if (loading) { return <Loading />; }
    if (error) { return <Typography><FormattedMessage id="failed_to_connect" />: {JSON.stringify(error)}</Typography>; }
    return <div
        id="preview-iframe-container"
        style={{
            display: `flex`,
            height: `100%`,
            width: `100%`,
            alignItems: `center`,
            justifyContent: `center`,
        }}>
        <iframe
            key={streamId}
            ref={ref}
            id={`preview:${streamId}`}
            style={{
                visibility: loading ? `hidden` : `visible`,
                transformOrigin: `top left`,
                transform: `scale(${transformScale})`,
                position: `absolute`,
                top: `0`,
                left: `0`,
                width: frameWidth,
                height: frameHeight,
            }}
            src={`player.html`}
            {...frameProps}
        />
    </div>;
}
