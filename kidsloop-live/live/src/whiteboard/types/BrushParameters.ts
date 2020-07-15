
export class BrushParameters {
    style?: string // style of the brush.
    width?: number // width of the brush, in pixels.

    static default(): BrushParameters {
        return {
            width: 1,
            style: "rgb(0, 0, 0)"
        };
    }

    static withParams(brush: BrushParameters): BrushParameters {
        return { width: brush.width, style: brush.style };
    }

    static withStyle(style: string): BrushParameters {
        return { style };
    }

    static withWidth(width: number): BrushParameters {
        return { width };
    }
}