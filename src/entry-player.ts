import {
    EventType,
    Replayer,
} from 'rrweb';
// eslint-disable-next-line no-unused-vars

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let hasReplayStarted = false;
let fullSnapshotRebuilded = false;
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
        const isYTVideo = isYouTubeVideo(data.event);
        if (event.type === EventType.Meta && !hasReplayStarted) {
            rrwebPlayer.startLive(event.timestamp);
            hasReplayStarted = true;
        }
        if (!hasReplayStarted) {
            return;
        }
        if (event.type === EventType.Custom ) {
            // using rrwebPlayer.on('custom-event', handler) has latency issue
            onCustomEvent(event);
            return;
        }
        if (event.type === EventType.FullSnapshot && fullSnapshotRebuilded && isYTVideo) {
            return;
        }
        if (event.type === EventType.FullSnapshot) {
            fullSnapshotRebuilded = true;
        }

        rrwebPlayer.addEvent(event);
    } catch (e) {
        console.error(e);
    }
});
(window as any).PLAYER_READY = true;
window.parent.postMessage(`ready`, `*`);

function onCustomEvent (event: any) {
    if (!event || !event.data) {
        return;
    }
    const { tag, payload } = event.data;
    if (tag === `ytPlayerStateChange`) {
        const youtubePlayer = youtubePlayers.get(payload.id) ?? {
            isReady: false,
        };
        youtubePlayer.info = payload.playerInfo;
        updateYoutubePlayerInfo(youtubePlayer, payload.id, payload.isInitInfo);
    }
}

function onFullSnapshotRebuilded () {
    const replayedIframe = window.document.getElementsByTagName(`iframe`)[0];
    const replayedWindow = replayedIframe.contentWindow;
    const replayedDocument = replayedIframe.contentDocument;
    if (!replayedWindow || !replayedDocument) {
        return;
    }

    if (isSafari) {
        const videos = replayedDocument.getElementsByTagName(`video`);
        for (const video of videos) {
            video.muted = true;
        }
        const unmute =  () => {
            for (const video of videos) {
                video.muted = false;
            }
            youtubePlayers.forEach((youtubePlayer) => {
                youtubePlayer.player.unMute();
            });
        };
        // to unmute video on ipad/iphone tap the video
        // to unmute video on desktop click the video twice(why it doesn't work after first click?)
        window.document.body.addEventListener(`click`, unmute, {
            once: true,
        });
    }

    const onYTAPIReady = () => {
        const onPlayerReady = (id: string) => (event: any) => {
            const youtubePlayer = youtubePlayers.get(id) ?? {
                isReady: false,
            };
            youtubePlayer.isReady = true;
            if (isSafari) {
                youtubePlayer.player.mute();
            }
            updateYoutubePlayerInfo(youtubePlayer, id);
        };

        for(const iframe of replayedDocument.getElementsByTagName(`iframe`)) {
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
                });

                youtubePlayers.set(id, youtubePlayer);
            } catch {
                continue;
            }
        }
    };
    if (!(replayedWindow as any).YT) {
        const tag = replayedDocument.createElement(`script`);
        (replayedWindow as any).onYouTubeIframeAPIReady = onYTAPIReady;
        const head = replayedDocument.getElementsByTagName(`head`)[0];
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
    switch (info.playerState) {
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

function isYouTubeVideo (event: string) {
    const exist = event.search(`https://www.youtube.com`) || event.search(`https://www.youtu.be`);
    return exist >= 0;
}
