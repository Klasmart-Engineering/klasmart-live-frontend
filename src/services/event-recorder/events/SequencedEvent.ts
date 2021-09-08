import { SqeuencedEventBuilder } from '@/services/event-recorder/builder/SequencedEventBuilder'

export interface SequencedEventData {
    streamId: string;
    sequence: number;
    tag: string;
    isKeyFrame: boolean;
    data: string;
}

export class SequencedEvent {
    readonly streamId: string;
    readonly sequence: number;
    readonly tag: string;
    readonly isKeyFrame: boolean;
    readonly data: string;

    private constructor (streamId: string, sequence: number, tag: string, isKeyFrame: boolean, data: string) {
        this.streamId = streamId;
        this.sequence = sequence;
        this.tag = tag;
        this.isKeyFrame = isKeyFrame;
        this.data = data;
    }

    toData (): SequencedEventData {
        return {
            streamId: this.streamId,
            sequence: this.sequence,
            tag: this.tag,
            isKeyFrame: this.isKeyFrame,
            data: this.data,
        };
    }

    static fromData (data: SequencedEventData) : SequencedEvent {
        return new SequencedEvent(data.streamId, data.sequence, data.tag, data.isKeyFrame, data.data);
    }

    static builder (sequencedEvent?: SequencedEvent) : SqeuencedEventBuilder {
        return new SqeuencedEventBuilder(sequencedEvent);
    }
}
