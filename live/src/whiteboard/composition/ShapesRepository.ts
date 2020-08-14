import { BrushParameters } from "../types/BrushParameters";
import { Point2D } from "../types/Point2D";
import { ShapeID } from "./ShapeID";

export interface Shape {
    id: ShapeID;
    order: number;
}

export interface Styled {
    brushParameters: BrushParameters;
}

export class Line implements Shape, Styled {
    id: ShapeID;
    order: number;

    brushParameters: BrushParameters = BrushParameters.default();

    points: Point2D[] = [];

    constructor(id: ShapeID, order: number) {
        this.id = id;
        this.order = order;
    }
}

export class ShapesRepository {
    private shapes = new Map<string, Shape>();
    private shapeOrder = 0;

    getOrderedShapes(): Shape[]  {
        const allShapes = Array.from(this.shapes.values());
        return allShapes.sort((a, b) => {
            return a.order - b.order;
        });
    }

    createShape(id: string, brushParameters: BrushParameters) {
        const shapeId = new ShapeID(id);

        const line = new Line(shapeId, this.shapeOrder++);
        line.brushParameters = brushParameters;

        this.shapes.set(id, line);
    }

    appendLine(id: string, points: Point2D[]) {
        if (!this.shapes.has(id)) return;

        const line = this.shapes.get(id) as Line;

        line.points.push(...points);
    }

    clearAll() {
        this.shapes.clear();
    }

    clear(user?: string) {
        if (user) {
            // NOTE: Remove all shapes belonging to user.
            Array.from(this.shapes.values()).filter(shape => shape.id.user === user).forEach(s => {
                this.shapes.delete(s.id.full);
            });
        } else {
            // NOTE: Remove all shapes.
            Array.from(this.shapes.values()).forEach(s => {
                this.shapes.delete(s.id.full);
            });
        }
    }
}