
import { Point2D } from "../types/Point2D";
import { BrushParameters } from "../types/BrushParameters";
import { Line } from "../composition/ShapesRepository";

export class CanvasShapeRenderer {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Couldn't get 2D context.");

        this.context = context;
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
    }

    clear(): void {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.context.fillStyle = "rgba(0, 0, 0,0 )";
        this.context.clearRect(0, 0, width, height);
    }

    drawLine(line: Line) {
        this.applyBrushParameters(line.brushParameters);

        const transformed_points = line.points.map(p => this.transformPoint(p));

        this.context.beginPath();

        for (let pi = 1; pi < transformed_points.length; ++pi) {
            const p1 = transformed_points[pi-1];
            const p2 = transformed_points[pi];

            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(p2.x, p2.y);
        }

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