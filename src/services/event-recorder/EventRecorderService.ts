
import { EventRecorderServiceBuilder } from './builder/EventRecorderServiceBuilder';
import {
    SequencedEvent,
    SequencedEventData,
} from './events/SequencedEvent';
import { IEventRecorderService } from './IEventRecorderService';
import { EventStream } from './stream/EventStream';
import { IEventUploader } from './uploader/IEventUploader';

const MaximumUploadAttemptCount = 3;
export const MaximumEventsEachUpload = 50;

export class EventRecorderService implements IEventRecorderService {
    private readonly uploader: IEventUploader;
    private readonly queuedEvents: SequencedEvent[] = [];
    private readonly uploadRetryTimeoutMillis: number = 1000;
    private readonly uploadWaitTimeoutMillis: number = 300;
    private uploadInProgress: Promise<void> | null = null;

    constructor (uploader: IEventUploader, uploadRetryTimeoutMillis?: number, uploadWaitTimeoutMillis?: number) {
        this.uploader = uploader;
        this.uploadRetryTimeoutMillis = uploadRetryTimeoutMillis !== undefined ? uploadRetryTimeoutMillis : this.uploadRetryTimeoutMillis;
        this.uploadWaitTimeoutMillis = uploadWaitTimeoutMillis !== undefined ? uploadWaitTimeoutMillis : this.uploadWaitTimeoutMillis;
    }

    recordEvent (stream: EventStream, data: string, isKeyFrame: boolean): void {
        const sequencedEvent = SequencedEvent.builder()
            .withStream(stream)
            .withIsKeyFrame(isKeyFrame)
            .withData(data)
            .build();

        stream.increaseSequence();

        this.queuedEvents.push(sequencedEvent);
    }

    uploadEvents () : Promise<void> {
        if (this.uploadInProgress !== null) {
            return this.uploadInProgress;
        }

        if (this.queuedEvents.length === 0) {
            return Promise.resolve();
        }

        const uploadPromise = new Promise<void>((resolve, reject) => {
            while (this.queuedEvents.length > 0) {
                const uploadCount = Math.min(MaximumEventsEachUpload, this.queuedEvents.length);
                const events = this.queuedEvents.splice(0, uploadCount).map(x => x.toData());

                EventRecorderService.eventUploadHandler(events, this.uploader, this.uploadRetryTimeoutMillis, this.uploadWaitTimeoutMillis).then(() => {
                    resolve();
                }, (reason) => {
                    reject(reason);
                });
            }
        }).finally(() => {
            this.uploadInProgress = null;
            this.uploadEvents();
        });

        this.uploadInProgress = uploadPromise;

        return uploadPromise;
    }

    static builder () : EventRecorderServiceBuilder {
        return new EventRecorderServiceBuilder();
    }

    private static async eventUploadHandler (events: SequencedEventData[], uploader: IEventUploader, uploadTimeoutRetryMillis: number, uploadSleepTimeoutMillis: number) {
        let uploadAttempt = 0;
        let successful = false;

        while (uploadAttempt < MaximumUploadAttemptCount) {
            await EventRecorderService.sleep(uploadSleepTimeoutMillis);
            await uploader.upload(events)
                .then(() => {
                    successful = true;
                }, (reason) => {
                    console.warn(`Event upload attempt ${uploadAttempt + 1} failed: ${reason}`);
                    uploadAttempt += 1;
                });

            if (successful) { break; }

            if (!successful && uploadAttempt < MaximumUploadAttemptCount) {
                await EventRecorderService.sleep(uploadTimeoutRetryMillis);
            }
        }

        if (!successful) {
            throw new Error(`Failed to upload ${events.length} events after ${MaximumUploadAttemptCount} attempts.`);
        }
    }

    private static sleep (ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
