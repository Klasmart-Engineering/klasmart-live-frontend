import { IEventUploader } from "./IEventUploader";
import { SequencedEventData } from "@/services/event-recorder/events/SequencedEvent";

export class MockEventUploader implements IEventUploader {
    upload (eventData: SequencedEventData[]) : Promise<void> {
        return Promise.resolve();
    }
}
