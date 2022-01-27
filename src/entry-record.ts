import { AuthTokenProvider } from './services/auth-token/AuthTokenProvider';
import { EventRecorderService } from './services/event-recorder/EventRecorderService';
import { EventStream } from './services/event-recorder/stream/EventStream';
import { GraphQlUploader } from './services/event-recorder/uploader/GraphQlUploader';
import { GraphQLClient } from 'graphql-request';
import {
    pack,
    record,
} from 'rrweb';
import { v4 as uuid } from 'uuid';

if (!(window as any).kidslooplive) {
    (window as any).kidslooplive = true;

    const POST_EVENTS = `
  mutation postPageEvent($streamId: ID!, $pageEvents: [PageEventIn]) {
    postPageEvent(streamId: $streamId, pageEvents: $pageEvents)
  }
  `;

    const url = new URL(window.location.href);
    const endpoint = url.searchParams.get(`endpoint`) || `${process.env.ENDPOINT_GQL || window.location.origin}`;
    const auth = url.searchParams.get(`auth`) || `${process.env.LOGIN_PAGE_URL}`;
    const refreshEndpoint = `${decodeURIComponent(auth)}/refresh`;

    const token = AuthTokenProvider.retrieveToken();

    const headers = token ? {
        authorization: `Bearer ${token}`,
    } : undefined;

    const graphQlEndpoint = `${decodeURIComponent(endpoint)}/graphql`;
    const client = new GraphQLClient(graphQlEndpoint, {
        headers: headers,
    });

    const streamId = uuid();
    window.parent.postMessage({
        streamId,
    }, `*`);

    const eventStream = EventStream.builder()
        .withId(streamId)
        .build();

    const uploader = new GraphQlUploader(client, POST_EVENTS, refreshEndpoint);

    const eventRecorder = EventRecorderService.builder()
        .withUploader(uploader)
        .withUploadRetryTimeoutMillis(500)
        .withUploadWaitTimeoutMills(300)
        .build();

    let eventsSinceKeyframe = 0;

    const keepIframeSrcFn = (src: string): boolean => {
        try {
            const url = new URL(src);
            return url.origin === `https://www.youtube.com`;
        } catch {
            return false;
        }
    };

    record({
        checkoutEveryNms: 1000 * 10, // take full snapshot every x seconds
        emit: (e, isCheckout) => {
            // TODO: Should client or server keep track of the
            // number of events emitted since last keyframe?
            if (isCheckout) {
                eventsSinceKeyframe = 0;
                // handle newly joined users
                youtubePlayers.forEach((player, id) => {
                    addCustomEvent(id, player.playerInfo, true);
                });
            }

            const eventData = JSON.stringify({
                checkout: isCheckout || false,
                event: e,
                index: eventsSinceKeyframe++,
            });

            eventRecorder.recordEvent(eventStream, eventData, isCheckout || false);
            eventRecorder.uploadEvents();
        },
        keepIframeSrcFn,
        packFn: pack,
    });
}

const youtubePlayers = new Map<string, any>();

window.addEventListener(`message`, ({ data }) => {
    if (!data || data.type !== `USER_JOIN`) { return; }
    youtubePlayers.forEach((player, id) => {
        addCustomEvent(id, player.playerInfo, true);
    });
});

if (!(window as any).H5P) {
    setTimeout(() => onYoutubeVideo(), 2000);
} else {
    onYoutubeVideo();
}

function onYoutubeVideo () {
    try{
        console.log(`registering event listeners for youtube videos`);
        youtubePlayers.clear();
        const onStateChange = (event: any, id: string, player: any, state: any) => {
            event.stopPropagation();
            youtubePlayers.set(id, player);
            addCustomEvent(id, state.target.playerInfo, false);
        };
        const $ = (window as any).H5P.jQuery;
        $(window.document.body).on(`ytPlayerStateChange`, onStateChange);
    } catch (e) {
        console.log(e);
    }
}

function addCustomEvent (id: string, playerInfo: any, isInitInfo: boolean) {
    record.addCustomEvent(`ytPlayerStateChange`, {
        id,
        playerInfo,
        isInitInfo,
    });
}
