window.addEventListener('message', ({ data }) => {
  if (!data || !data.event) { return }
  try {
    const event = JSON.parse(data.event)
  } catch (e) {
    console.error(e)
  }
});
(window as any).PLAYER_READY = true
window.postMessage('ready','*')