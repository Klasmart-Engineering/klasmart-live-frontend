import React, { useRef, useEffect, ReactChildren, ReactChild, ReactElement } from 'react'
import { CanvasPainterController } from '../controller/CanvasPainterController'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { useWhiteboard } from './WhiteboardProvider'
import { BrushParameters } from '../services/brush/BrushParameters'
import { Point2D } from '../services/Point2D'
import { IPainterController } from '../controller/IPainterController'

type Props = {
    children?: ReactChild | ReactChildren | null
    controller?: IPainterController
    style: CSSProperties
    width: string
    height: string
    enablePointer?: boolean
}

export function EventDrivenCanvas({ children, controller, style, width, height, enablePointer }: Props): ReactElement {
    const ref = useRef<HTMLCanvasElement>(null)

    const {
        state: { pointerPainter }
    } = useWhiteboard();

    useEffect(() => {
        if (!ref.current || !enablePointer || !pointerPainter) {
            return
        }

        const handlePointerDown = (event: PointerEvent) => {
            pointerPainter.handlePointerDown(event)
        }

        const handlePointerUp = (event: PointerEvent) => {
            pointerPainter.handlePointerUp(event)
        }

        const handlePointerCancel = (event: PointerEvent) => {
            pointerPainter.handlePointerCancel(event)
        }

        const handlePointerMove = (event: PointerEvent) => {
            pointerPainter.handlePointerMove(event)
        }

        const handlePointerLeave = (event: PointerEvent) => {
            pointerPainter.handlePointerLeave(event)
        }

        const canvas = ref.current
        canvas.addEventListener('pointerdown', handlePointerDown, false);
        canvas.addEventListener('pointerup', handlePointerUp, false);
        canvas.addEventListener('pointercancel', handlePointerCancel, false);
        canvas.addEventListener('pointermove', handlePointerMove, false);
        canvas.addEventListener('pointerleave', handlePointerLeave, false);

        return () => {
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointercancel', handlePointerCancel);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, [pointerPainter, enablePointer])

    useEffect(() => {
        if (ref.current === null) return
        if (controller === undefined) return

        const painter = new CanvasPainterController(ref.current)

        const handleOperationBegin = (id: string, params: BrushParameters) => {
            painter.operationBegin(id, params)
        }

        const handleOperationEnd = (id: string) => {
            painter.operationEnd(id)
        }

        const handlePainterClear = (_id: string) => {
            painter.painterClear()
        }

        const handlePainterLine = (id: string, p1: Point2D, p2: Point2D) => {
            painter.painterLine(id, p1, p2)
        }

        controller.on('operationBegin', handleOperationBegin)
        controller.on('operationEnd', handleOperationEnd)
        controller.on('painterClear', handlePainterClear)
        controller.on('painterLine', handlePainterLine)

        return () => {
            if (controller) {
                controller.removeListener('operationBegin', handleOperationBegin)
                controller.removeListener('operationEnd', handleOperationEnd)
                controller.removeListener('painterClear', handlePainterClear)
                controller.removeListener('painterLine', handlePainterLine)
            }
        }
    }, [controller])

    return <canvas width={width} height={height} ref={ref} style={style}>{children}</canvas>
}