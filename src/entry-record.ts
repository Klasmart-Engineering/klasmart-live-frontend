import { AuthTokenProvider } from './services/auth-token/AuthTokenProvider';
import { EventRecorderService } from './services/event-recorder/EventRecorderService';
import { EventStream } from './services/event-recorder/stream/EventStream';
import { GraphQlUploader } from './services/event-recorder/uploader/GraphQlUploader';
import { GraphQLClient } from 'graphql-request';
import { record } from 'rrweb';
import { v4 as uuid } from 'uuid';

if (!(window as any).kidslooplive) {
    (window as any).kidslooplive = true;

    const POST_URL = `${process.env.ENDPOINT_GQL || window.location.origin}/graphql`;
    const POST_EVENTS = `
  mutation postPageEvent($streamId: ID!, $pageEvents: [PageEventIn]) {
    postPageEvent(streamId: $streamId, pageEvents: $pageEvents)
  }
  `;

    const token = AuthTokenProvider.retrieveToken();

    const headers = token ? {
        authorization: `Bearer ${token}`,
    } : undefined;

    const client = new GraphQLClient(POST_URL, {
        headers: headers,
    });

    const streamId = uuid();
    window.parent.postMessage({
        streamId,
    }, `*`);

    const eventStream = EventStream.builder()
        .withId(streamId)
        .build();

    const uploader = new GraphQlUploader(client, POST_EVENTS);

    const eventRecorder = EventRecorderService.builder()
        .withUploader(uploader)
        .withUploadRetryTimeoutMillis(500)
        .build();

    let eventsSinceKeyframe = 0;

    console.log(`start recording`);
    record({
        checkoutEveryNms: 1000 * 10,
        emit: (e, isCheckout) => {
            // TODO: Should client or server keep track of the
            // number of events emitted since last keyframe?
            if (isCheckout) {
                eventsSinceKeyframe = 0;
            }

            const eventData = JSON.stringify({
                checkout: isCheckout || false,
                event: e,
                index: eventsSinceKeyframe++,
            });

            eventRecorder.recordEvent(eventStream, eventData, isCheckout || false);
            eventRecorder.uploadEvents();
        },
        allowIframe,
    });
}

const youtubePlayers = new Map<string, any>();

window.addEventListener(`message`, ({ data }) => {
    if (!data || data.type !== `USER_JOIN`) { return; }
    youtubePlayers.forEach((player, id) => {
        record.addCustomEvent(`YTPlayerStateChange`, {
            id,
            playerInfo: player.playerInfo,
        });
    });
});

if (!(window as any).H5P) {
    setTimeout(() => onYoutubeVideo(), 2000);
} else {
    onYoutubeVideo();

}

function onYoutubeVideo () {
    youtubePlayers.clear();
    const $ = (window as any).H5P.jQuery;
    const onStateChange = (event: any, data: any) => {
        event.stopPropagation();
        console.log(`onStateChange`, `event`, event, `data`, data);
        const {
            id, player, state,
        } = data;
        youtubePlayers.set(id, player);
        record.addCustomEvent(`YTPlayerStateChange`, {
            id,
            playerInfo: state.target.playerInfo,
        });
    };
    for(const iframe of document.getElementsByTagName(`iframe`)) {
        try {
            const id = (iframe as HTMLIFrameElement).getAttribute(`id`) ?? ``;
            const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
            const url = new URL(src);
            if (!id || url.origin !== `https://www.youtube.com`) {
                continue;
            }
            $(iframe).on(`ytPlayerStateChange`, onStateChange);
        } catch {
            continue;
        }
    }
}

function allowIframe (src: string): boolean {
    try {
        const url = new URL(src);
        return url.origin === `https://www.youtube.com`;
    } catch {
        return false;
    }
}
