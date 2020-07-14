import { Point2D } from "./Point2D";
import { BrushParameters } from "./BrushParameters";

export type PainterEventType = 'operationBegin' | 'operationEnd' | 'painterClear' | 'painterLine'

export interface OperationData {
    brush?: BrushParameters | undefined
}

export interface LineData {
    points: Point2D[]
}

export interface PainterEvent {
    // The event type.
    type: PainterEventType

    // Operation ID for this event.
    id: string

    // Optional parameters for this event.
    param?: LineData | OperationData | string | undefined
}
