import { record } from 'rrweb'
import { GraphQLClient } from 'graphql-request'
// eslint-disable-next-line no-unused-vars
import { eventWithTime } from 'rrweb/typings/types'
import { EventRecorderService } from './services/event-recorder/EventRecorderService'
import { GraphQlUploader } from './services/event-recorder/uploader/GraphQlUploader'
import { EventStream } from './services/event-recorder/stream/EventStream'
import { AuthTokenProvider } from './services/auth-token/AuthTokenProvider'
import { v4 as uuid } from 'uuid'

const POST_EVENTS = `
mutation postPageEvent($streamId: ID!, $pageEvents: [PageEventIn]) {
  postPageEvent(streamId: $streamId, pageEvents: $pageEvents)
}
`

const token = AuthTokenProvider.retrieveToken()

const headers = token? { authorization: `Bearer ${token}` } : undefined

const client = new GraphQLClient(`${window.location.origin}/graphql`, { headers: headers })

const streamId = uuid()
// console.log(`streamId: ${streamId}`)
window.parent.postMessage({ streamId }, '*')

const eventStream = EventStream.builder()
  .withId(streamId)
  .build()

const uploader = new GraphQlUploader(client, POST_EVENTS)

const eventRecorder = EventRecorderService.builder()
  .withUploader(uploader)
  .withUploadRetryTimeoutMillis(1000)
  .build()

let eventsSinceKeyframe = 0

record({
  checkoutEveryNms: 1000*60*2,
  checkoutEveryNth: 1024,
  emit: (e, c) => {
    // TODO: Should client or server keep track of the
    // number of events emitted since last keyframe?
    if (c) { eventsSinceKeyframe = 0 }

    const eventData = JSON.stringify({
      checkout: c || false,
      event: e,
      index: eventsSinceKeyframe++
    })

    eventRecorder.recordEvent(eventStream, eventData, c || false)
    eventRecorder.uploadEvents()
  }
})

