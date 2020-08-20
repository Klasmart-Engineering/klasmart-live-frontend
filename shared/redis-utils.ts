export function redisStreamDeserialize<T> (keyValues: string[]): T|undefined {
    for (let i = 0; i + 1 < keyValues.length; i += 2) {
        try {
            if (keyValues[i] === "json") { return JSON.parse(keyValues[i + 1]) as any; }
        } catch (e) {
            console.error(e)
        }
    }
}

export function redisStreamSerialize (value: any): ["json", string] {
    return ["json", JSON.stringify(value)];
}