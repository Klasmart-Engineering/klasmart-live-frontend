import { Replayer } from 'rrweb';
// eslint-disable-next-line no-unused-vars

let ytPlayer: any;
let hasStarted = false;
const player: Replayer = new Replayer([], {
    mouseTail: false,
    liveMode: true,
    speed: 1.5,
    UNSAFE_replayCanvas: true,
});
player.enableInteract();
player.on(`resize`, () => window.parent.postMessage({
    width: player.iframe.width,
    height: player.iframe.height,
}, `*`));
player.on(`custom-event`, (event: any) => {
    console.log(`received custom event`, event);
    if(!event || !event.data){
        return;
    }
    if(event.data.tag === `stateChange`) {
        ytPlayer.playVideo();

    }
});

window.addEventListener(`message`, ({ data }) => {
    if (!data || !data.event) { return; }
    try {
        const event = JSON.parse(data.event);
        // console.log(event);
        if (!hasStarted) {
            player.startLive(event.timestamp);
            hasStarted = true;
        }
        player.addEvent(event);
    } catch (e) {
        console.error(e);
    }
});
(window as any).PLAYER_READY = true;
window.postMessage(`ready`, `*`);

if (!(window as any).YT) {
    const tag = document.createElement(`script`);
    tag.src = `https://www.youtube.com/iframe_api`;
    (window as any).onYouTubeIframeAPIReady = onYTAPIReady;
    const firstScriptTag = document.getElementsByTagName(`script`)[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    console.log(`replayed page loaded YouTube iframe api`);
} else {
    onYTAPIReady();
}

function onYTAPIReady () {
    ytPlayer = new (window as any).YT.Player(`h5p-youtube-0`, {});
    console.log(`replayed page mounted YouTube player object`, ytPlayer);
}
