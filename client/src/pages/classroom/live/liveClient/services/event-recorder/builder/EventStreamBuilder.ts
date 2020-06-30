import { EventStream, EventStreamData } from "../stream/EventStream";
import { isBlank } from "../../../utils/StringUtils";
import { v4 as uuid } from "uuid";

export class EventStreamBuilder {
    private data: EventStreamData;
    
    constructor(eventStream?: EventStream) {
        this.data = eventStream ? eventStream.toData() : <EventStreamData> {
            sequence: 0
        }
    }

    withId(id: string) : EventStreamBuilder {
        this.data.id = id
        return this
    }

    withRandomId() : EventStreamBuilder {
        this.data.id = uuid()
        return this
    }

    withSequence(sequence: number) : EventStreamBuilder {
        this.data.sequence = sequence
        return this
    }

    withTag(tag: string) : EventStreamBuilder {
        this.data.tag = tag
        return this
    }

    build() : EventStream {
        if (isBlank(this.data.id)) {
            throw new Error('The EventStream must have an ID. Please set the ID using withId or withRandomId methods.')
        }

        return EventStream.fromData(this.data);        
    }
}