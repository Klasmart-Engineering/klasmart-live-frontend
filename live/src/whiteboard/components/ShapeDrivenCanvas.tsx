import React, { useRef, useEffect, ReactChildren, ReactChild, ReactElement, useState, useCallback } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { Line, Shape } from "../composition/ShapesRepository";
import { CanvasShapeRenderer } from "../renderer/CanvasShapeRenderer";

type Props = {
    children?: ReactChild | ReactChildren | null
    style: CSSProperties
    width: string
    height: string
    enablePointer?: boolean
    filterUsers?: string[]
}

export function ShapeDrivenCanvas({ children, style, width, height, enablePointer, filterUsers }: Props): ReactElement {
    const ref = useRef<HTMLCanvasElement>(null);

    const {
        state: { pointerPainter, shapesRepository }
    } = useWhiteboard();

    const [renderer, setRenderer] = useState<CanvasShapeRenderer | undefined>(undefined);

    useEffect(() => {
        if (!ref.current || !enablePointer || !pointerPainter) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            pointerPainter.handlePointerDown(event);
        };

        const handlePointerUp = (event: PointerEvent) => {
            pointerPainter.handlePointerUp(event);
        };

        const handlePointerCancel = (event: PointerEvent) => {
            pointerPainter.handlePointerCancel(event);
        };

        const handlePointerMove = (event: PointerEvent) => {
            pointerPainter.handlePointerMove(event);
        };

        const handlePointerLeave = (event: PointerEvent) => {
            pointerPainter.handlePointerLeave(event);
        };

        const canvas = ref.current;
        canvas.addEventListener("pointerdown", handlePointerDown, false);
        canvas.addEventListener("pointerup", handlePointerUp, false);
        canvas.addEventListener("pointercancel", handlePointerCancel, false);
        canvas.addEventListener("pointermove", handlePointerMove, false);
        canvas.addEventListener("pointerleave", handlePointerLeave, false);

        return () => {
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointerup", handlePointerUp);
            canvas.removeEventListener("pointercancel", handlePointerCancel);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [pointerPainter, enablePointer]);

    const redraw = useCallback((shapes: Shape[]) => {
        if (renderer === undefined) return;

        renderer.clear();

        shapes.forEach(shape => {
            renderer.drawLine(shape as Line);
        });
    }, [renderer]);

    useEffect(() => {
        if (shapesRepository === undefined) return;
        if (renderer === undefined) return;

        const drawShapes = () => {
            let shapes = shapesRepository.getOrderedShapes();

            if (filterUsers !== undefined) {
                shapes = shapes.filter(shape => filterUsers.includes(shape.id.user));
            }

            redraw(shapes); 
        };

        const interval = setInterval(drawShapes, 20);

        return () => {
            clearInterval(interval);
        };
    }, [shapesRepository, redraw]);

    useEffect(() => {
        if (ref.current === null) return;

        setRenderer(new CanvasShapeRenderer(ref.current));
    }, [setRenderer]);

    return <canvas width={width} height={height} ref={ref} style={style}>{children}</canvas>;
}