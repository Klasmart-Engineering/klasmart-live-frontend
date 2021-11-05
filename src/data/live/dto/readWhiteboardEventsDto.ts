import { PainterEvent } from "kidsloop-canvas/lib/domain/whiteboard/event-serializer/PainterEvent";

export interface ReadWhiteboardEventsDto {
    whiteboardEvents: PainterEvent[];
}
