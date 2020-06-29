export function mapToObj(m: any) {
    return Array.from(m).reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
}