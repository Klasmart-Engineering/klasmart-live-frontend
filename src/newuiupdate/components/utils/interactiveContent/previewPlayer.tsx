import { useWindowSize } from "../../../../utils/viewport";
import {
    LIVE_LINK,
    LocalSessionContext,
} from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import {
    isLessonPlanOpenState,
    isShowContentLoadingState,
} from "../../../states/layoutAtoms";
import { sleep } from "../utils";
import Loading from "./loading";
import {
    gql,
    useSubscription,
} from "@apollo/client";
import {
    CircularProgress,
    Grid,
    Typography,
} from "@material-ui/core";
import React,
{
    useContext,
    useEffect,
    useRef,
    useState,
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

    const [ isShowContentLoading, setIsShowContentLoading ] = useRecoilState(isShowContentLoadingState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ transformScale, setTransformScale ] = useState<number>(1);
    const [ loadingPreviewPlayer, setLoadingPreviewPlayer ] = useState<boolean>(true);
    const [ loadingParentEvents, setLoadingParentEvents ] = useState<boolean>(true);

    const { content } = useContext(RoomContext);
    const { isTeacher } = useContext(LocalSessionContext);

    const containerHtml = window.document.getElementById(container) as HTMLIFrameElement;
    const size = useWindowSize();

    useEffect(() => {

        setLoadingPreviewPlayer(true);
        setLoadingParentEvents(true);
    }, [ content?.contentId ]);

    useEffect(() => {
        scale(frameWidth, frameHeight);
        setTimeout(function (){
            scaleWhiteboard();
        }, 300);
    }, [
        frameWidth,
        frameHeight,
        size,
    ]);

    const scale = (innerWidth: number, innerHeight: number) => {
        let currentWidth: number = size.width, currentHeight: number = size.height;

        if (containerHtml) {
            currentWidth = containerHtml.getBoundingClientRect().width;
            currentHeight = containerHtml.getBoundingClientRect().height;
        }

        const shrinkRatioX = currentWidth / innerWidth;
        const shrinkRatioY =  currentHeight / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    };

    // TODO : Find a better system to scale the Whiteboard to the h5p
    const scaleWhiteboard = () => {
        const previewIframe = ref.current as HTMLIFrameElement;
        if(previewIframe && containerHtml){
            const previewIframeStyles = previewIframe.getAttribute(`style`);
            const whiteboard = containerHtml.getElementsByClassName(`canvas-container`)[0];
            if(previewIframeStyles){
                whiteboard.setAttribute(`style`, previewIframeStyles);
            }
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

    const { loading, error } = useSubscription(SUB_EVENTS, {
        onSubscriptionData: e => sendEvent(e.subscriptionData.data.stream.event),
        variables: {
            streamId,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const onLoad = async () => {
        if (ref.current == null || ref.current.contentWindow == null) { return; }
        const iframeDoc = ref.current.contentDocument;
        const recordedIframe = iframeDoc?.getElementsByTagName(`iframe`);

        if(recordedIframe && recordedIframe.length){
            await sleep(800); // Await to make sure iframe is loaded and we can resize correctly
            const recordedIframeItem = recordedIframe[0];

            const fWidth = Number(recordedIframeItem.width.replace(`px`, ``));
            const fHeight = Number(recordedIframeItem.height.replace(`px`, ``));
            setWidthHeight({
                frameWidth: fWidth,
                frameHeight: fHeight,
            });

            // MUTE VIDEOS ON OBSERVE MODE - TEACHER SIDE
            if(isTeacher){
                // DEFAULT VIDEO
                const video = recordedIframeItem?.contentWindow?.document.getElementsByTagName(`video`);
                const videoList = Array.prototype.slice.call(video);
                videoList.forEach(video => video.muted=true);

                // YOUTUBE
                const h5pYoutube = recordedIframeItem?.contentWindow?.document.getElementsByClassName(`h5p-youtube`);
                const youtubeVideoList = Array.prototype.slice.call(h5pYoutube);
                youtubeVideoList.forEach(video => {
                    const iframeYoutube = video.getElementsByTagName(`iframe`)[0];
                    iframeYoutube.src += `&mute=1`;
                });
            }
            await sleep(800); // Await to make sure we resize correctly
        }

        setLoadingPreviewPlayer(false);
    };

    useEffect(() => {
        const onIframeEvents = (event: MessageEvent) => {
            if (event.source !== ref.current?.contentWindow || !event.data) {
                return;
            }
            // When the page is ready, start sending buffered events
            if(event.data === `ready`) {
                sendEvent();
                setLoadingParentEvents(false);
            }
            if (event.data.width && event.data.height) {
                const fWidth = Number(event.data.width.replace(`px`, ``));
                const fHeight = Number(event.data.height.replace(`px`, ``));
                setWidthHeight({
                    frameWidth: fWidth,
                    frameHeight: fHeight,
                });
            }
        };
        window.addEventListener(`message`, onIframeEvents);
        return () => window.removeEventListener(`message`, onIframeEvents);
    }, [  ]);

    if (loading || isShowContentLoading) { return <Loading messageId="Page loading" />; }
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
        <>
            {( loadingPreviewPlayer || loadingParentEvents ) && <Loading messageId="Activity loading" /> }
        </>
        <iframe
            key={streamId}
            ref={ref}
            id={`preview:${streamId}`}
            style={{
                visibility: loading || isShowContentLoading || loadingPreviewPlayer ? `hidden` : `visible`,
                transformOrigin: `top left`,
                transform: `scale(${transformScale})`,
                position: `absolute`,
                top: `0`,
                left: `0`,
                width: frameWidth,
                height: frameHeight,
            }}
            src={`player.html`}
            onLoad={() => onLoad()}
            {...frameProps}
        />
    </div>;
}
