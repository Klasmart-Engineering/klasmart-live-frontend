import { SequencedEventData } from "../events/SequencedEvent";
import { IEventUploader } from "./IEventUploader";

export class MockEventUploader implements IEventUploader {
    upload (eventData: SequencedEventData[]) : Promise<void> {
        return Promise.resolve();
    }
}
