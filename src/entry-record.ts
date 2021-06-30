import { AuthTokenProvider } from './services/auth-token/AuthTokenProvider';
import { EventRecorderService } from './services/event-recorder/EventRecorderService';
import { EventStream } from './services/event-recorder/stream/EventStream';
import { GraphQlUploader } from './services/event-recorder/uploader/GraphQlUploader';
import { GraphQLClient } from 'graphql-request';
import { record } from 'rrweb';
import { v4 as uuid } from 'uuid';

if (!(window as any).kidslooplive) {
    (window as any).kidslooplive = true;

    const POST_EVENTS = `
    mutation postPageEvent($streamId: ID!, $pageEvents: [PageEventIn]) {
        postPageEvent(streamId: $streamId, pageEvents: $pageEvents)
    }
    `;

    const url = new URL(window.location.href);
    const endpoint = url.searchParams.get('endpoint') || window.location.origin;

    const token = AuthTokenProvider.retrieveToken();

    const headers = token ? { authorization: `Bearer ${token}` } : undefined;

    const graphQlEndpoint = `${decodeURIComponent(endpoint)}/graphql`;
    const client = new GraphQLClient(graphQlEndpoint, { headers: headers });

    const streamId = uuid();

    window.parent.postMessage({ streamId }, `*`);

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
        checkoutEveryNth: 512,
        emit: (e, c) => {
            // TODO: Should client or server keep track of the
            // number of events emitted since last keyframe?
            if (c) { eventsSinceKeyframe = 0; }

            const eventData = JSON.stringify({
                checkout: c || false,
                event: e,
                index: eventsSinceKeyframe++,
            });

            eventRecorder.recordEvent(eventStream, eventData, c || false);
            eventRecorder.uploadEvents();
        },
        allowIframe,
    });
}

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

function onYTAPIReady() {
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
    for (const iframe of document.getElementsByTagName(`iframe`)) {
        const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
        const url = new URL(src);
        if (url.origin !== `https://www.youtube.com`) {
            continue;
        }
        const id = (iframe as HTMLIFrameElement).getAttribute(`id`) ?? ``;
        const player = new (window as any).YT.Player(id, {
            events: {
                onReady: onPlayerReady(id),
                onStateChange: onPlayerStateChange(id),
            },
        });
        console.log(`recorded page got reference to YT player`, player, `id`, id);
    }

}

function allowIframe(src: string): boolean {
    try {
        const url = new URL(src);
        return url.origin === `https://www.youtube.com`;
    } catch {
        return false;
    }
}
