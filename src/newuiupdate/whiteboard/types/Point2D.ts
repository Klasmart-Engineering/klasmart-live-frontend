
export class Point2D {
    x: number
    y: number

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    static multiplyToInteger(p: Point2D, multiplier: number): Point2D {
        const x = Math.round(p.x * multiplier);
        const y = Math.round(p.y * multiplier);
        return new Point2D(x, y);
    }

    static normalize(p: Point2D, t: number): Point2D {
        const x = p.x / t;
        const y = p.y / t;
        return new Point2D(x, y);
    }

    static create(x: number, y: number): Point2D {
        return new Point2D(x, y);
    }
}
