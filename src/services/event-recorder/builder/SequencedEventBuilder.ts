import {
    SequencedEvent,
    SequencedEventData,
} from "@/services/event-recorder/events/SequencedEvent";
import { EventStream } from "@/services/event-recorder/stream/EventStream";
import { isBlank } from "@/utils/StringUtils";
import { v4 as uuid } from "uuid";

export class SqeuencedEventBuilder {
    private data: SequencedEventData;

    constructor (sequencedEvent?: SequencedEvent) {
        this.data = sequencedEvent ? sequencedEvent.toData() : <SequencedEventData> {};
    }

    withStream (stream: EventStream) : SqeuencedEventBuilder {
        this.data.streamId = stream.getId();
        this.data.sequence = stream.getSequence();
        this.data.tag = stream.getTag();

        return this;
    }
    withRandomStreamId (): SqeuencedEventBuilder {
        this.data.streamId = uuid();
        return this;
    }

    withStreamId (streamId: string): SqeuencedEventBuilder {
        this.data.streamId = streamId;
        return this;
    }

    withSequence (sequence: number): SqeuencedEventBuilder {
        this.data.sequence = sequence;
        return this;
    }

    withData (data: string): SqeuencedEventBuilder {
        this.data.data = data;
        return this;
    }

    withIsKeyFrame (isKeyFrame: boolean) : SqeuencedEventBuilder {
        this.data.isKeyFrame = isKeyFrame;
        return this;
    }

    withTag (tag: string) : SqeuencedEventBuilder {
        this.data.tag = tag;
        return this;
    }

    build (): SequencedEvent {
        if (isBlank(this.data.streamId)) {
            throw new Error(`The SequencedEvent must have a streamId. Please set the session using withStreamId, withRandomStreamId, or withStream methods.`);
        }

        return SequencedEvent.fromData(this.data);
    }
}
