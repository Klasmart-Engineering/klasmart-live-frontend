import { Replayer } from 'rrweb'
// eslint-disable-next-line no-unused-vars
import { eventWithTime } from 'rrweb/typings/types'
let player: Replayer
const events: eventWithTime[] = []
let receivedSnapshot = false;

window.addEventListener('message', ({ data }) => {
  if (!data || !data.event) { return }
  try {
    const event = JSON.parse(data.event);
    const isSnapshot = event.type === 2;
    receivedSnapshot = receivedSnapshot || isSnapshot;
    
    if (player) {
      if (receivedSnapshot && isSnapshot) {
        return;
      }
      
      player.addEvent(event)
    } else {
      events.push(event)
      if (events.length >= 2) {
        player = new Replayer(events, { mouseTail: false, liveMode: true, speed: 1.5 })
        player.on('resize', () => window.parent.postMessage({ width: player.iframe.width, height: player.iframe.height }, '*'))
        player.startLive(event.timestamp);
      }
    }
  } catch (e) {
    console.error(e)
  }
});
(window as any).PLAYER_READY = true

window.postMessage('ready','*')

// NOTE: Added this to notify the preview-player that the entry is ready to handle received events.
window.parent.postMessage('ready', '*');