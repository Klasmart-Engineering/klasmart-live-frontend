import { EventStreamBuilder } from "../builder/EventStreamBuilder";

export interface EventStreamData {
    id: string;
    sequence: number;
    tag: string;
}

export class EventStream {
    readonly id: string;
    readonly tag: string;
    private sequence: number;

    private constructor (id: string, sequence: number, tag: string) {
        this.id = id;
        this.sequence = sequence;
        this.tag = tag;
    }

    getId () : string {
        return this.id;
    }

    getSequence () : number {
        return this.sequence;
    }

    getTag () : string {
        return this.tag;
    }

    increaseSequence () : void {
        this.sequence = this.sequence === Number.MAX_SAFE_INTEGER ? 0 : this.sequence + 1;
    }

    toData (): EventStreamData {
        return {
            id: this.id,
            sequence: this.sequence,
            tag: this.tag,
        };
    }

    static fromData (data: EventStreamData) : EventStream {
        return new EventStream(data.id, data.sequence, data.tag);
    }

    static builder (eventStream?: EventStream) : EventStreamBuilder {
        return new EventStreamBuilder(eventStream);
    }
}
