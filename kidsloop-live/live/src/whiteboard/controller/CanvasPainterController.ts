
import { Point2D } from "../types/Point2D";
import { BrushParameters } from "../types/BrushParameters";

export class CanvasPainterController {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    private brushParameterLookup = new Map<string, BrushParameters>()

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Couldn't get 2D context.");

        this.context = context;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
    }

    operationBegin(id: string, brushParameters: BrushParameters): void {
        if (this.brushParameterLookup.has(id)) {
            console.warn(`Overwriting parameters for operation with ID: ${id} which is already started.`);
        }

        this.brushParameterLookup.set(id, brushParameters);
    }

    operationEnd(id: string): void {
        if (!this.brushParameterLookup.delete(id)) {
            console.warn(`Trying to end operation with ID: ${id} which hasn't been started.`);
        }
    }

    painterClear(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.context.fillStyle = "rgba(0, 0, 0,0 )";
        this.context.clearRect(0, 0, width, height);
    }

    painterLine(id: string, p1: Point2D, p2: Point2D): void {
        p1 = this.transformPoint(p1);
        p2 = this.transformPoint(p2);

        if (id !== undefined) {
            const brush = this.brushParameterLookup.get(id);
            if (brush) {
                this.applyBrushParameters(brush);
            } else {
                console.warn(`Couldn't find brush parameters for operation with ID: ${id}`);
            }
        }

        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.stroke();
    }

    private transformPoint(p: Point2D): Point2D {
        const x = p.x * this.canvas.width;
        const y = p.y * this.canvas.height;

        return new Point2D(x, y);
    }

    private applyBrushParameters(brush: BrushParameters) {
        if (brush.style) {
            this.context.strokeStyle = brush.style;
        }

        if (brush.width) {
            this.context.lineWidth = brush.width;
        }
    }
}
