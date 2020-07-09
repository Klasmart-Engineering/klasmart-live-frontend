/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import { expect, assert } from 'chai'
import { mock, instance, anything, when, verify, reset } from 'ts-mockito'
import { EventRecorderServiceBuilder } from '../../../src/services/event-recorder/builder/EventRecorderServiceBuilder'
import { IEventUploader } from '../../../src/services/event-recorder/uploader/IEventUploader'
import { MaximumEventsEachUpload } from '../../../src/services/event-recorder/EventRecorderService'
import { SequencedEvent } from '../../../src/services/event-recorder/events/SequencedEvent'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { EventStream } from '../../../src/services/event-recorder/stream/EventStream'

chai.use(chaiAsPromised)

describe('EventRecorderService', () => {
  it('UploadEvents_Should_Call_UploadFunction', async () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()
    when(mockEventUploader.upload(anything())).thenResolve()

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploadRetryTimeoutMillis(20)
      .withUploader(instance(mockEventUploader))
      .build()

    const stream = EventStream.builder()
        .withRandomId()
        .build()

    sut.recordEvent(stream, 'TestEvent1', false)

    await sut.uploadEvents()

    verify(mockEventUploader.upload(anything())).once()
  }),
  it('UploadEvents_Should_Not_Call_UploadFunction', async () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()
    when(mockEventUploader.upload(anything())).thenResolve()

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploadRetryTimeoutMillis(20)
      .withUploader(instance(mockEventUploader))
      .build()

    const stream = EventStream.builder()
        .withRandomId()
        .build()

    sut.recordEvent(stream, 'TestEvent1', false)

    await sut.uploadEvents()

    verify(mockEventUploader.upload(anything())).once()
    reset(mockEventUploader)

    await sut.uploadEvents()

    verify(mockEventUploader.upload(anything())).never()
  }),
  it('UploadEvents_Should_Call_Twice', async () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()
    when(mockEventUploader.upload(anything())).thenResolve()

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploadRetryTimeoutMillis(20)
      .withUploader(instance(mockEventUploader))
      .build()

    const stream = EventStream.builder()
        .withRandomId()
        .build()

    for (let i = 0; i < MaximumEventsEachUpload + 1; ++i) {
      sut.recordEvent(stream, `TestEvent${i}`, false)
    }

    await sut.uploadEvents()

    verify(mockEventUploader.upload(anything())).twice()
  }),
  it('UploadEvents_Should_Retry', async () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()

    let retryCount = 0
    when(mockEventUploader.upload(anything())).thenCall(() => {
      if (retryCount++ > 1) {
        return Promise.resolve()
      }

      return Promise.reject(new Error('Rejecting to test retries.'))
    })

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploadRetryTimeoutMillis(20)
      .withUploader(instance(mockEventUploader))
      .build()

    const stream = EventStream.builder()
        .withRandomId()
        .build()

    sut.recordEvent(stream, 'TestEvent1', false)

    await sut.uploadEvents()

    verify(mockEventUploader.upload(anything())).thrice()
  }),
  it('RecordEvent_Should_IncreaseSequenceNumber', () => {
    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .build()

    const stream = EventStream.builder()
        .withRandomId()
        .build()

    expect(stream.getSequence()).equal(0)
    sut.recordEvent(stream, 'TestEvent', false)
    expect(stream.getSequence()).equal(1)
    sut.recordEvent(stream, 'TestEvent', false)
    expect(stream.getSequence()).equal(2)
    sut.recordEvent(stream, 'TestEvent', false)
    expect(stream.getSequence()).equal(3)
  }),
  it('EventStream_Sequence_Should_WrapAround', () => {
    const wrapAroundAt = Number.MAX_SAFE_INTEGER
    const builder = EventStream.builder()
    const sut = builder
      .withRandomId()
      .withSequence(wrapAroundAt - 1)
      .build()

    sut.increaseSequence()
    expect(sut.getSequence()).equal(wrapAroundAt)
    sut.increaseSequence()
    expect(sut.getSequence()).equal(0)
  }),
  it('EventRecorderService_ShouldNot_InitializeEventSequance', () => {
    const builder = EventStream.builder()
    const sut = builder.withRandomId().build()
    expect(sut.getSequence()).equal(0)
  }),
  it('EventRecorderService_Should_InitializeEventSequence', () => {
    const builder = EventStream.builder()
    const sut = builder
      .withRandomId()
      .withSequence(5)
      .build()

    expect(sut.getSequence()).equal(5)
  }),
  it('EventRecorderService_Should_ReuseUploadPromise', () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()

    when(mockEventUploader.upload(anything())).thenCall(async () => {
      // NOTE: Wait for 20ms to try if same promise is reused.
      await new Promise(resolve => setTimeout(resolve, 20))

      return Promise.resolve()
    })

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploader(instance(mockEventUploader))
      .build()
    
    const stream = EventStream.builder()
        .withRandomId()
        .build()
    sut.recordEvent(stream, 'TestEvent', false)

    const promise1 = sut.uploadEvents()
    const promise2 = sut.uploadEvents()

    assert.deepEqual(promise1, promise2)
  }),
  it('EventRecorder_Should_FailAfterAllUploadAttempts', async () => {
    const mockEventUploader : IEventUploader = mock<IEventUploader>()

    when(mockEventUploader.upload(anything())).thenCall(async () => {
      return Promise.reject(new Error('Rejecting to test failure after retries.'))
    })

    const builder = new EventRecorderServiceBuilder()
    const sut = builder
      .withUploadRetryTimeoutMillis(10)
      .withUploader(instance(mockEventUploader))
      .build()

    const stream = EventStream.builder()
      .withRandomId()
      .build()
    sut.recordEvent(stream, 'TestEvent', false)

    await expect(sut.uploadEvents()).to.be.rejectedWith(Error)
  }),
  it('SequencedEventBuilder_Should_Replicate', () => {
    const sequencedEvent = SequencedEvent.builder()
      .withStreamId('StreamId1')
      .withIsKeyFrame(true)
      .withData('TestEvent1')
      .withSequence(1337)
      .build()

    const sut = SequencedEvent.builder(sequencedEvent)
    const replicatedEvent = sut.build()

    assert.deepEqual(sequencedEvent, replicatedEvent)
  })
})
