import { PainterEvent } from "@kl-engineering/kidsloop-canvas/lib/domain/whiteboard/event-serializer/PainterEvent";

export interface ReadWhiteboardEventsDto {
    whiteboardEvents: PainterEvent[];
}
