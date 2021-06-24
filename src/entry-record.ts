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

    record({
        checkoutEveryNms: 1000 * 10,
        emit: (e, isCheckout) => {
            // TODO: Should client or server keep track of the
            // number of events emitted since last keyframe?
            if (isCheckout) {
                console.log(`checkout event`, e);
                eventsSinceKeyframe = 0;
                youtubePlayers.forEach((player, id) => {
                    record.addCustomEvent(`stateChange`, {
                        id,
                        playerInfo: player.playerInfo,
                    });
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

        allowIframe,
    });
}
const youtubePlayers = new Map<string, any>();
if (!(window as any).YT) {
    const tag = document.createElement(`script`);
    tag.src = `https://www.youtube.com/iframe_api`;
    (window as any).onYouTubeIframeAPIReady = onYTAPIReady;
    const firstScriptTag = document.getElementsByTagName(`script`)[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    console.log(`recorded page loaded YouTube iframe api`);
} else {
    onYTAPIReady();
}

function onYTAPIReady () {
    youtubePlayers.clear();
    const onPlayerReady = (id: string) => (event: any) => {
        console.log(`onPlayerReady`, `id`, id, `event`, event);
    };
    const onPlayerStateChange = (id: string) => (event: any) => {
        console.log(`onPlayerStateChange`, `id`, id, `event`, event);
        record.addCustomEvent(`stateChange`, {
            id,
            playerInfo: event.target.playerInfo,
        });
    };
    for(const iframe of document.getElementsByTagName(`iframe`)) {
        try {
            const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
            const url = new URL(src);
            if (url.origin !== `https://www.youtube.com`) {
                continue;
            }
            (iframe as HTMLIFrameElement).setAttribute(`src`, decodeURIComponent(src));
            const id = (iframe as HTMLIFrameElement).getAttribute(`id`) ?? ``;
            const youtubePlayer = new (window as any).YT.Player(id, {
                events: {
                    onReady: onPlayerReady(id),
                    onStateChange: onPlayerStateChange(id),
                },
            });
            youtubePlayers.set(id, youtubePlayer);
            console.log(`recorded page got reference to YT player`, youtubePlayer, `id`, id);
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
