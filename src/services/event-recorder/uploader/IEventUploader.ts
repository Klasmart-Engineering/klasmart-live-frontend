import { SequencedEventData } from "@/events/SequencedEvent";

export interface IEventUploader {
    upload(data: SequencedEventData[]) : Promise<void>;
}
