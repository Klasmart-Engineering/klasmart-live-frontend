import { Replayer } from 'rrweb';

enum YoutubePlayerState {
    ENDED = 0,
    PLAYING,
    PAUSED,
    BUFFERING,
    CUED,
};

const EVENT_TYPE_SNAPSHOT = 2;

let hasStarted = false;
let receivedSnapshot = false;

const youtubePlayers = new Map<string, any>();

const player: Replayer = new Replayer([], {
    mouseTail: false,
    liveMode: true,
    speed: 1.5,
    UNSAFE_replayCanvas: true,
});

window.addEventListener(`message`, ({ data }) => {
    if (!data || !data.event) { return; }
    try {
        const event = JSON.parse(data.event);
        const isSnapshot = event.type === EVENT_TYPE_SNAPSHOT;

        // FIX: This if statement fixes issue where videos would stop
        // playing after ~15 seconds on Android.
        if (receivedSnapshot && isSnapshot) {
            return;
        }

        receivedSnapshot = receivedSnapshot || isSnapshot;

        if (!hasStarted) {
            player.startLive(event.timestamp);
            hasStarted = true;
        }

        player.addEvent(event);

    } catch (e) {
        console.error(e);
    }
});

player.on(`resize`, () => window.parent.postMessage({
    width: player.iframe.width,
    height: player.iframe.height,
}, `*`));

player.on(`custom-event`, (event: any) => {
    if (!event || !event.data) {
        return;
    }
    const { tag, payload } = event.data;

    const youtubePlayer = youtubePlayers.get(payload.id);
    if (!youtubePlayer) {
        return;
    }
    if (tag === `YTPlayerStateChange`) {
        const info = payload.playerInfo;
        youtubePlayer.seekTo(info.currentTime);
        switch (info.playerState) {
            case YoutubePlayerState.ENDED:
                youtubePlayer.stopVideo();
                break;
            case YoutubePlayerState.PLAYING:
                youtubePlayer.playVideo();
                break;
            case YoutubePlayerState.PAUSED:
                youtubePlayer.pauseVideo();
                break;
            default:
                break;
        }
    }
});

player.on(`fullsnapshot-rebuilded`, () => onFullSnapshotRebuilded());

(window as any).PLAYER_READY = true;
window.postMessage(`ready`, `*`);

function onFullSnapshotRebuilded() {
    console.log(`onFullSnapshotRebuilded`);
    youtubePlayers.clear();
    const replayedIframe = window.document.getElementsByTagName(`iframe`)[0];
    const replayedWindow = replayedIframe.contentWindow;

    const onYTAPIReady = () => {
        if (!replayedWindow?.document) {
            return;
        }
        for (const iframe of replayedWindow?.document.getElementsByTagName(`iframe`)) {
            const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
            const url = new URL(src);
            if (url.origin !== `https://www.youtube.com`) {
                continue;
            }
            const updatedSrc = url.origin + url.pathname + `?enablejsapi=1`;
            (iframe as HTMLIFrameElement).setAttribute(`src`, updatedSrc);
            const id = (iframe as HTMLIFrameElement).getAttribute(`id`) ?? ``;
            const youtubePlayer = new (replayedWindow as any).YT.Player(id, {});
            youtubePlayers.set(id, youtubePlayer);
            console.log(`replayed page got reference to YT player`, youtubePlayer, `id`, id);
        }
    };

    if (!(replayedWindow as any).YT) {
        const tag = replayedWindow?.document.createElement(`script`);
        (replayedWindow as any).onYouTubeIframeAPIReady = onYTAPIReady;
        const head = replayedWindow?.document.getElementsByTagName(`head`)[0];
        if (!tag) {
            return;
        }
        tag.src = `https://www.youtube.com/iframe_api`;
        head?.appendChild(tag);
    } else {
        onYTAPIReady();
    }
}
