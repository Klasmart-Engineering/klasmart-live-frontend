import { EventStream } from "./stream/EventStream";

export interface IEventRecorderService {
    recordEvent(stream: EventStream, data: string, isKeyFrame: boolean): void;

    uploadEvents(): Promise<void>;
}
