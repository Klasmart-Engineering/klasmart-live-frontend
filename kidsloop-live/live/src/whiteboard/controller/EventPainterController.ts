import { PainterEvent, LineData, OperationData, ClearData } from "../types/PainterEvent";
import { Point2D } from "../types/Point2D";
import { EventEmitter } from "events";
import { IPainterController } from "./IPainterController";
import { ShapeID } from "../composition/ShapeID";

export class EventPainterController extends EventEmitter implements IPainterController {
    readonly normalize: number
    readonly events: PainterEvent[] = []
    readonly userId: string

    constructor(userId: string, normalize: number) {
        super();
        this.normalize = normalize;
        this.userId = userId;
    }

    async replayEvents(): Promise<void> {
        for (const event of this.events) {
            this.parseAndEmitEvent(event);
        }
    }

    handlePainterEvent(events: PainterEvent[]): void {
        for (const event of events) {
            this.events.push(event);

            this.parseAndEmitEvent(event);

            if (event.type === "painterClear") {
                this.events.splice(0, this.events.length - 1);
            }
        }
    }

    private parseAndEmitEvent(event: PainterEvent) {
        // TODO: Currently the param is sent via GraphQL as a string
        // I would like to create proper type information in GraphQL 
        // instead, since this doesn't feel very reliable.
        let parsedParam: string | LineData | OperationData | ClearData = "{}";
        if (event.param) {
            parsedParam = JSON.parse(event.param as string);
        }

        switch (event.type) {
        case "operationBegin": this.beginOperation(parsedParam as OperationData, event.id); break;
        case "operationEnd": this.endOperation(event.id); break;
        case "painterClear": this.clear(event.id, parsedParam as ClearData); break;
        case "painterLine": this.line(event.id, parsedParam as LineData); break;
        }
    }

    private beginOperation(operationData: OperationData, id: string) {
        if (id === undefined) {
            console.error("Trying to begin operation without ID.");
            return;
        }

        if (operationData.brush) {
            this.emit("operationBegin", id, operationData.brush);
        }
    }

    private endOperation(id: string) {
        if (id === undefined) {
            console.error("Trying to end operation without ID.");
            return;
        }

        this.emit("operationEnd", id);
    }

    private clear(id: string, clear: ClearData) {
        this.emit("painterClear", id, clear.user);
    }

    private line(id: string, line: LineData) {
        if (!line.points || line.points.length === 0)
            return;

        if (line.points.length === 1) {
            const p = Point2D.normalize(line.points[0], this.normalize);
            this.emit("painterLine", id, p, p);
            return;
        }

        let startAt = Point2D.normalize(line.points[0], this.normalize);
        for (let i = 1; i < line.points.length; ++i) {
            const endAt = Point2D.normalize(line.points[i], this.normalize);

            this.emit("painterLine", id, startAt, endAt);
            startAt = endAt;
        }
    }
}
