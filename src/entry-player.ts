import { Replayer } from 'rrweb';
// eslint-disable-next-line no-unused-vars

let replayHasStarted = false;

enum YoutubePlayerState {
    ENDED = 0,
    PLAYING,
    PAUSED,
    BUFFERING,
    CUED,
}
const youtubePlayers = new Map<string, {ready: boolean; player: any; initInfo?: any }>();
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

rrwebPlayer.on(`custom-event`, (event: any) => {
    console.log(`received custom event`, event);
    if(!event || !event.data){
        return;
    }
    const { tag, payload } = event.data;
    if(tag === `YTPlayerStateChange`) {
        const youtubePlayer = youtubePlayers.get(payload.id);
        if (!youtubePlayer) {
            return;
        }
        if (!youtubePlayer.ready) {
            youtubePlayer.initInfo = payload.playerInfo;
            return;
        }
        updateYoutubePlayerInfo(youtubePlayer.player, payload.playerInfo);
    }
});

rrwebPlayer.on(`fullsnapshot-rebuilded`, () => onFullSnapshotRebuilded());

window.addEventListener(`message`, ({ data }) => {
    if (!data || !data.event) { return; }
    try {
        const event = JSON.parse(data.event);
        if (!replayHasStarted) {
            rrwebPlayer.startLive(event.timestamp);
            replayHasStarted = true;
        }
        rrwebPlayer.addEvent(event);
    } catch (e) {
        console.error(e);
    }
});
(window as any).PLAYER_READY = true;
window.postMessage(`ready`, `*`);

function onFullSnapshotRebuilded () {
    console.log(`onFullSnapshotRebuilded`);
    youtubePlayers.clear();
    const replayedIframe = window.document.getElementsByTagName(`iframe`)[0];
    const replayedWindow = replayedIframe.contentWindow;

    const onYTAPIReady = () => {
        if (!replayedWindow?.document) {
            return;
        }
        const onPlayerReady = (id: string) => (event: any) => {
            console.log(`onPlayerReady`, `id`, id, `event`, event);
            const youtubePlayer = youtubePlayers.get(id);
            if(youtubePlayer) {
                youtubePlayer.ready = true;
            }
            if(youtubePlayer?.initInfo) {
                updateYoutubePlayerInfo(youtubePlayer.player, youtubePlayer.initInfo);
            }
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
                const youtubePlayer = {
                    player: new (replayedWindow as any).YT.Player(id, {
                        events: {
                            onReady: onPlayerReady(id),
                        },
                    }),
                    ready: false,
                };
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
function updateYoutubePlayerInfo (player: any, info: any) {
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
