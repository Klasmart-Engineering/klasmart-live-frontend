import { PainterEvent } from "@kl-engineering/kidsloop-canvas/dist/domain/whiteboard/event-serializer/PainterEvent";

export interface ReadWhiteboardEventsDto {
    whiteboardEvents: PainterEvent[];
}
