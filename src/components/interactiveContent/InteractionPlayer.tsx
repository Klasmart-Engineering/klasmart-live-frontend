import Loading from "./loading";
import { CANVAS_RESOLUTION_MAX } from "@/config";
import { useEventsSubscription } from "@/data/live/subscriptions/useEventsSubscription";
import {
    FeatureFlag,
    useFeatureFlags,
} from "@/providers/feature-context";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { BaseWhiteboard } from "@/whiteboard/components/BaseWhiteboard";
import WhiteboardBorder from "@/whiteboard/components/Border";
import {
    createStyles,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    activityIframe: {
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        background: theme.palette.common.white,
    },
}));

export interface Props {
    streamId: string;
    filterGroups?: string[];
    group?: string;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
    loadingStreamId?: boolean;
    inViewport?: boolean;
    sizeConstraints?: {
        width: number;
        height: number;
    };
}

export function InteractionPlayer (props: Props) {
    const {
        group,
        streamId,
        frameProps,
        filterGroups,
        loadingStreamId,
        inViewport,
        sizeConstraints = {
            width: 0,
            height: 0,
        },
    } = props;

    const classes = useStyles();
    const [ initialIframeSize, setInitialIframeSize ] = useState({
        width: 0,
        height: 0,
    });
    const [ sizeLoading, setSizeLoading ] = useState<boolean>(false);

    const [ initialActivityScale, setInitialActivityScale ] = useState(1);

    const { isTeacher } = useSessionContext();
    const liveEndPoint = useHttpEndpoint(`live`);

    const { features, isFeatureEnabled } = useFeatureFlags();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (sizeConstraints.height === 0 || sizeConstraints.width === 0) return;
        const activityScale = Math.min(sizeConstraints.height / initialIframeSize.height, sizeConstraints.width / initialIframeSize.width);
        setInitialActivityScale(activityScale);
    }, [
        sizeConstraints,
        initialIframeSize,
        initialActivityScale,
    ]);

    const containerScale = useMemo(() => {
        const scaleHeight = (sizeConstraints.height / (initialIframeSize.height * initialActivityScale));
        const scaleWidth = (sizeConstraints.width / (initialIframeSize.width * initialActivityScale));

        return Math.min(scaleHeight, scaleWidth);
    }, [
        sizeConstraints,
        initialIframeSize,
        initialActivityScale,
    ]);

    useEffect(() => {
        setSizeLoading(true);
    }, [ streamId ]);

    // Buffer events until we have a page ready to render them
    const { current: bufferedEvents } = useRef<string[]>([]);
    function sendEvent (event?: string, streamId?: string) {
        if (iframeRef.current && iframeRef.current.contentWindow && ((iframeRef.current.contentWindow as any).PLAYER_READY)) {
            setSizeLoading(false);
            while (bufferedEvents.length > 0) {
                const event = bufferedEvents.shift();
                iframeRef.current.contentWindow.postMessage({
                    event,
                    streamId,
                }, `*`);
            }
            if (event) { iframeRef.current.contentWindow.postMessage({
                event,
                streamId,
            }, `*`); }
        } else if (event) {
            bufferedEvents.push(event);
        }
    }

    const {
        data,
        loading,
        error,
    } = useEventsSubscription({
        variables: {
            streamId,
        },
    }, {
        onlyObserveInViewport: isFeatureEnabled(features, FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT) && inViewport !== undefined,
        inViewport: !!inViewport,
    });

    useEffect(() => {
        sendEvent(data?.stream.event, streamId);
    }, [ data ]);

    const onLoad = () => {
        const currentIframe = iframeRef?.current;
        const iframeDoc = currentIframe?.contentDocument;
        const recordedIframe = iframeDoc?.getElementsByTagName(`iframe`);

        if (!recordedIframe?.length) {
            setSizeLoading(false);
            return;
        }
        const recordedIframeItem = recordedIframe?.[0];

        const fWidth = parseInt(recordedIframeItem.width);
        const fHeight = parseInt(recordedIframeItem.height);
        setInitialIframeSize({
            width: fWidth,
            height: fHeight,
        });

        // MUTE VIDEOS ON OBSERVE MODE - TEACHER SIDE
        if (isTeacher) {
            // DEFAULT VIDEO
            const video = recordedIframeItem?.contentWindow?.document.getElementsByTagName(`video`);
            if (video) {
                const videoList = Array.prototype.slice.call(video);
                videoList.forEach(video => video.muted=true);
            }

            // YOUTUBE
            const h5pYoutube = recordedIframeItem?.contentWindow?.document.getElementsByClassName(`h5p-youtube`);
            if (h5pYoutube) {
                const youtubeVideoList = Array.prototype.slice.call(h5pYoutube);
                youtubeVideoList.forEach(video => {
                    const iframeYoutube = video.getElementsByTagName(`iframe`)[0];
                    iframeYoutube.src += `&mute=1`;
                });
            }
        }
        setSizeLoading(false);
    };

    useEffect(() => {
        const onIframeEvents = (event: MessageEvent) => {
            if (event.source !== iframeRef.current?.contentWindow || !event.data) return;
            // When the page is ready, start sending buffered events
            if (event.data === `ready`) sendEvent();
            if (event.data.width && event.data.height) {
                const fWidth = parseInt(event.data.width);
                const fHeight = parseInt(event.data.height);
                setInitialIframeSize({
                    width: fWidth,
                    height: fHeight,
                });
            }
        };
        window.addEventListener(`message`, onIframeEvents);
        return () => window.removeEventListener(`message`, onIframeEvents);
    }, [  ]);

    if (loadingStreamId) return (
        <Loading messageId="Waiting for a stream" />
    );
    if (loading) return (
        <Loading messageId="Page loading" />
    );
    if (error) return (
        <Typography>
            <FormattedMessage id="failed_to_connect" />: {JSON.stringify(error)}
        </Typography>
    );

    return (
        <>
            {sizeLoading && <Loading messageId="Loading stream" />}
            <div
                style={{
                    transform: `scale(${containerScale * initialActivityScale})`,
                    visibility: loading || sizeLoading ? `hidden` : `visible`,
                    height: initialIframeSize.height,
                    width: initialIframeSize.width,
                    transformOrigin: `center`,
                    position: `absolute`,
                }}
            >
                <iframe
                    key={streamId}
                    ref={iframeRef}
                    id={`preview:${streamId}`}
                    className={classes.activityIframe}
                    src={`${process.env.IS_CORDOVA_BUILD ? `${liveEndPoint}/`  : ``}player.html?streamId=${streamId}`}
                    onLoad={() => onLoad()}
                    {...frameProps}
                />
                <BaseWhiteboard
                    group={group}
                    filterGroups={filterGroups}
                    width={initialIframeSize.width * (CANVAS_RESOLUTION_MAX / initialIframeSize.width)}
                    height={initialIframeSize.height * (CANVAS_RESOLUTION_MAX / initialIframeSize.width)}
                />
            </div>
            <WhiteboardBorder
                width={initialIframeSize.width * containerScale * initialActivityScale}
                height={initialIframeSize.height * containerScale * initialActivityScale}
            />
        </>
    );
}
