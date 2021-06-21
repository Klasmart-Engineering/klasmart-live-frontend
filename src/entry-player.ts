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

player.on(`fullsnapshot-rebuilded`, (event: any) => onYTAPIReady());

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

function onYTAPIReady () {
    const replayedIframe = window.document.getElementsByTagName(`iframe`)[0];
    const replayedWindow = replayedIframe.contentWindow;

    const dummyTag = replayedWindow?.document.createElement(`script`);
    const tag = replayedWindow?.document.createElement(`script`);

    if (!tag || !dummyTag) {
        return;
    }
    (replayedWindow as any).onYouTubeIframeAPIReady = callback;
    console.log(`document`, replayedWindow?.document);
    const body = replayedWindow?.document.getElementsByTagName(`body`)[0];
    console.log(`body`, body);
    const head = replayedWindow?.document.getElementsByTagName(`head`)[0];
    head?.appendChild(dummyTag);
    tag.src = `https://www.youtube.com/iframe_api`;
    console.log(`head`, head, `tag`, tag);
    head?.appendChild(tag);

    function callback () {
        const doc = replayedIframe.contentDocument;
        if (!doc) {
            console.log(`empty replayed doc`);
            return;
        }
        console.log(`doc`, doc.getElementsByTagName(`iframe`));
        for(const iframe of doc.getElementsByTagName(`iframe`)) {
            const src = (iframe as HTMLIFrameElement).getAttribute(`src`) ?? ``;
            const url = new URL(src);
            if (url.origin === `https://www.youtube.com`) {
                const updatedSrc = url.origin +  url.pathname + `?enablejsapi=1`;
                (iframe as HTMLIFrameElement).setAttribute(`src`, updatedSrc);
            }
            const id = (iframe as HTMLIFrameElement).getAttribute(`id`);
            console.log(`iframe`, iframe, `id`, id);
            ytPlayer = new (replayedWindow as any).YT.Player(id, {});
        }
        console.log(`replayed page mounted YouTube  object`, ytPlayer);
    }
}
