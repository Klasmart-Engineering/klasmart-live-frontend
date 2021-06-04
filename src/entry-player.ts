import { Replayer } from 'rrweb';
// eslint-disable-next-line no-unused-vars

let hasStarted = false;
const player: Replayer = new Replayer([], {
    mouseTail: false,
    liveMode: true,
    speed: 1.5,
});
player.on(`resize`, () => window.parent.postMessage({
    width: player.iframe.width,
    height: player.iframe.height,
}, `*`));

window.addEventListener(`message`, ({ data }) => {
    if (!data || !data.event) { return; }
    try {
        const event = JSON.parse(data.event);
        console.log(event);
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
