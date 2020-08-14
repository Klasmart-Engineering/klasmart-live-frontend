import { Point2D } from "../types/Point2D";
import { BrushParameters } from "../types/BrushParameters";
import { EventEmitter } from "events";
import { IPainterController } from "./IPainterController";

interface PointerState {
    id: number,
    point: Point2D,
}

export class PointerPainterController extends EventEmitter implements IPainterController {
    readonly mapToTarget: boolean
    readonly sessionId: string

    readonly currentActivePointers: Map<number, PointerState>

    private brushParameters: BrushParameters = new BrushParameters()

    private operationId: string | undefined = undefined
    private operationSequence = 0

    constructor(sessionId: string, mapToTarget: boolean) {
        super();
        this.mapToTarget = mapToTarget;
        this.currentActivePointers = new Map<number, PointerState>();
        this.sessionId = sessionId;
    }

    replayEvents(): Promise<void> {
        console.warn("not implemented");
        return Promise.resolve();
    }

    setBrush(brush: BrushParameters): void {
        this.brushParameters = brush;
    }

    clear(user?: string): void {
        this.emit("painterClear", this.generateOperationId(), user);
    }

    handlePointerDown(event: PointerEvent): void {
        if (event.button !== 0)
            return;

        const newState = this.pointerEventState(event);

        this.currentActivePointers.set(newState.id, newState);

        if (this.operationId === undefined) {
            this.operationId = this.generateOperationId();
            this.emit("operationBegin", this.operationId, this.brushParameters);
        }
    }

    handlePointerMove(event: PointerEvent): void {
        const newState = this.pointerEventState(event);
        const oldState = this.currentActivePointers.get(newState.id);

        if (oldState === undefined) return;

        // TODO: State interpolation?
        this.currentActivePointers.set(newState.id, newState);

        const lineFrom = oldState.point;
        const lineTo = newState.point;

        if (this.operationId !== undefined) {
            this.emit("painterLine", this.operationId, lineFrom, lineTo);
        }
    }

    handlePointerUp(event: PointerEvent): void {
        const newState = this.pointerEventState(event);
        const oldState = this.currentActivePointers.get(newState.id);

        const deleted = this.currentActivePointers.delete(newState.id);

        if (oldState !== undefined) {
            const lineFrom = oldState.point;
            const lineTo = newState.point;

            if (this.operationId !== undefined) {
                this.emit("painterLine", this.operationId, lineFrom, lineTo);
            }
        }

        if (deleted && this.operationId !== undefined) {
            this.emit("operationEnd", this.operationId);
            this.operationId = undefined;
        }
    }

    handlePointerCancel(event: PointerEvent): void {
        const pointerState = this.currentActivePointers.get(event.pointerId);
        if (pointerState !== undefined) {
            this.currentActivePointers.delete(event.pointerId);
            if (this.operationId !== undefined) {
                this.emit("operationEnd", this.operationId);
                this.operationId = undefined;
            }
        }
    }

    handlePointerLeave(event: PointerEvent): void {
        const pointerState = this.currentActivePointers.get(event.pointerId);
        if (pointerState !== undefined) {
            this.currentActivePointers.delete(event.pointerId);
            if (this.operationId !== undefined) {
                this.emit("operationEnd", this.operationId);
                this.operationId = undefined;
            }
        }
    }

    private pointerEventState(event: PointerEvent): PointerState {
        let x = event.clientX;
        let y = event.clientY;

        // NOTE: Map coordinates to the event target.
        if (this.mapToTarget && event.target instanceof HTMLElement) {
            const elem = event.target as HTMLElement;
            const clientRects = elem.getClientRects();

            if (clientRects.length > 0) {
                const rect = clientRects[0];
                x = (x - rect.left) / rect.width;
                y = (y - rect.top) / rect.height;
            }
        }

        return {
            id: event.pointerId,
            point: Point2D.create(x, y)
        };
    }

    private generateOperationId(): string {
        return `${this.sessionId}:${this.operationSequence++}`;
    }
}
