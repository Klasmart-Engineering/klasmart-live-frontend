import { EventRecorderService } from '@/services/event-recorder/EventRecorderService';
import { IEventUploader } from '@/services/event-recorder/uploader/IEventUploader';
import { MockEventUploader } from '@/services/event-recorder/uploader/MockEventUploader';

export class EventRecorderServiceBuilder {
    private uploader: IEventUploader;
    private uploadRetryTimeoutMillis: number;
    private uploadWaitTimeoutMillis: number;

    constructor () {
        this.uploader = new MockEventUploader();
        this.uploadRetryTimeoutMillis = 1000;
        this.uploadWaitTimeoutMillis = 300;
    }

    withUploader (uploader: IEventUploader) : EventRecorderServiceBuilder {
        this.uploader = uploader;
        return this;
    }

    withUploadRetryTimeoutMillis (uploadRetryTimeoutMillis: number) : EventRecorderServiceBuilder {
        this.uploadRetryTimeoutMillis = uploadRetryTimeoutMillis;
        return this;
    }

    withUploadWaitTimeoutMills (uploadWaitTimeoutMillis: number): EventRecorderServiceBuilder {
        this.uploadWaitTimeoutMillis = uploadWaitTimeoutMillis;
        return this;
    }

    build () : EventRecorderService {
        return new EventRecorderService(this.uploader, this.uploadRetryTimeoutMillis, this.uploadWaitTimeoutMillis);
    }
}
