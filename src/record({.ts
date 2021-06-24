record({
    emit: (e, c) => {
        // send to server 
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

function onYTAPIReady () {
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
        const player = new (window as any).YT.Player(id, {
            events: {
                onReady: onPlayerReady(id),
                onStateChange: onPlayerStateChange(id),
            },
        });
        console.log(`recorded page got reference to YT player`, player, `id`, id);
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
