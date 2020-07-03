import { Replayer } from "rrweb";
// eslint-disable-next-line no-unused-vars
import { eventWithTime } from "rrweb/typings/types";
let player: Replayer;
const events: eventWithTime[] = [];

window.addEventListener("message", ({ data }) => {
    if (!data || !data.event) { return; }
    // console.log(data.event)
    try {
        const event = JSON.parse(data.event);
        if (player) {
            player.addEvent(event);
        } else {
            events.push(event);
            if (events.length >= 2) {
                player = new Replayer(events);
                player.on("resize", () => window.parent.postMessage({ width: player.iframe.width, height: player.iframe.height }, "*"));
                player.play();
            }
        }
    } catch (e) {
        console.error(e);
    }
});
(window as any).PLAYER_READY = true;
window.postMessage("ready", "*");
