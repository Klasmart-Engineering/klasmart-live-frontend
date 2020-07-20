const ID_DELIMITER = ":";

export class ShapeID {
    readonly full: string;
    readonly user: string;
    readonly index: number;

    constructor(id: string) {
        this.full = id;

        const parts = id.split(ID_DELIMITER);
        if (!parts.length) {
            throw new Error("Invalid shape ID.");
        }

        this.user = parts[0];
        if (parts.length > 1) {
            this.index = Number.parseInt(parts[1]);
        } else {
            this.index = 0;
        }
    }

    static create(user: string, index: number) {
        return `${user}${ID_DELIMITER}${index}`;
    }
}