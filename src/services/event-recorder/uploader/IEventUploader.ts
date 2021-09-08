import { SequencedEventData } from "@/services/event-recorder/events/SequencedEvent";

export interface IEventUploader {
    upload(data: SequencedEventData[]) : Promise<void>;
}
