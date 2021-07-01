import { EventType, Replayer } from 'rrweb';
// eslint-disable-next-line no-unused-vars

let hasReplayStarted = false;
let hasReceivedFullSnapshot = false;

enum YoutubePlayerState {
    ENDED = 0,
    PLAYING,
    PAUSED,
    BUFFERING,
    CUED,
}
type YoutubePlayerReference = {
    isReady?: boolean;
    hasStarted?: boolean;
    player?: any;
    info?: any;
};
const youtubePlayers = new Map<string, YoutubePlayerReference>();
const rrwebPlayer: Replayer = new Replayer([], {
    mouseTail: false,
    liveMode: true,
    speed: 1.5,
    UNSAFE_replayCanvas: true,
});

rrwebPlayer.on(`resize`, () => window.parent.postMessage({
    width: rrwebPlayer.iframe.width,
    height: rrwebPlayer.iframe.height,
}, `*`));

rrwebPlayer.on(`fullsnapshot-rebuilded`, () => onFullSnapshotRebuilded());

window.addEventListener(`message`, ({ data }) => {
    if (!data || !data.event) { return; }
    try {
        const event = JSON.parse(data.event);
        if (event.type === EventType.Meta && !hasReplayStarted) {
            rrwebPlayer.startLive(event.timestamp);
            hasReplayStarted = true;
        }
        if (!hasReplayStarted) {
            return;
        }
        if (event.type === EventType.FullSnapshot) {
            if(hasReceivedFullSnapshot) {
                // don't rebuild full snapshot, it makes video appear glitchy
                return;
            }
            hasReceivedFullSnapshot = true;
        }
        if (event.type === EventType.Custom ) {
            // using rrwebPlayer.on('custom-event', handler) has latency issue
            onCustomEvent(event);
            return;
        }
        rrwebPlayer.addEvent(event);
    } catch (e) {
        console.error(e);
    }
});
(window as any).PLAYER_READY = true;
window.parent.postMessage(`ready`, `*`);

function onCustomEvent (event: any){
    console.log(`received custom event`, event);
    if(!event || !event.data){
        return;
    }
    const { tag, payload } = event.data;
    if(tag === `ytPlayerStateChange`) {
        const youtubePlayer = youtubePlayers.get(payload.id) ?? {
            isReady: false,
        };
        youtubePlayer.info = payload.info;
        updateYoutubePlayerInfo(youtubePlayer, payload.id, payload.isInitInfo);
    }
}

function onFullSnapshotRebuilded () {
    console.log(`onFullSnapshotRebuilded`);
    const replayedIframe = window.document.getElementsByTagName(`iframe`)[0];
    const replayedWindow = replayedIframe.contentWindow;

    const onYTAPIReady = () => {
        if (!replayedWindow?.document) {
            return;
        }
        const onPlayerReady = (id: string) => (event: any) => {
            const youtubePlayer = youtubePlayers.get(id) ?? {
                isReady: false,
            };
            console.log(`onPlayerReady`, `id`, id, `event`, event, `player`, youtubePlayer);
            youtubePlayer.isReady = true;
            updateYoutubePlayerInfo(youtubePlayer, id);
        };
        for(const iframe of replayedWindow?.document.getElementsByTagName(`iframe`)) {
            try {
                const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
                const url = new URL(src);
                if (url.origin !== `https://www.youtube.com`) {
                    continue;
                }
                (iframe as HTMLIFrameElement).setAttribute(`src`, decodeURIComponent(src));
                const id = (iframe as HTMLIFrameElement).getAttribute(`id`) ?? ``;
                const youtubePlayer = youtubePlayers.get(id) ?? {
                    isReady: false,
                };
                youtubePlayer.player =  new (replayedWindow as any).YT.Player(id, {
                    events: {
                        onReady: onPlayerReady(id),
                    },
                }),
                youtubePlayers.set(id, youtubePlayer);
                console.log(`replayed page got reference to YT player`, youtubePlayer, `id`, id);
            } catch {
                continue;
            }
        }
    };

    if (!(replayedWindow as any).YT) {
        const tag = replayedWindow?.document.createElement(`script`);
        (replayedWindow as any).onYouTubeIframeAPIReady = onYTAPIReady;
        const head = replayedWindow?.document.getElementsByTagName(`head`)[0];
        if(!tag) {
            return;
        }
        tag.src = `https://www.youtube.com/iframe_api`;
        head?.appendChild(tag);
    } else {
        onYTAPIReady();
    }
}

function updateYoutubePlayerInfo (youtubePlayer: YoutubePlayerReference, id: string, isInitInfo?: boolean) {
    if (!youtubePlayer.isReady || !youtubePlayer.info || !youtubePlayer.player) {
        youtubePlayers.set(id, youtubePlayer);
        return;
    }
    // avoid glitches for users who already started watching
    if (youtubePlayer.hasStarted && isInitInfo) {
        return;
    }
    youtubePlayer.hasStarted = true;

    const { player, info } = youtubePlayer;
    player.seekTo(info.currentTime);
    switch(info.playerState){
    case YoutubePlayerState.ENDED:
        player.stopVideo();
        break;
    case YoutubePlayerState.PLAYING:
        player.playVideo();
        break;
    case YoutubePlayerState.PAUSED:
        player.pauseVideo();
        break;
    default:
        break;
    }
}
