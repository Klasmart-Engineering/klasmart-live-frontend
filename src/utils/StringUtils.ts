
export function isBlank (str: string) : boolean {
    return (!str || /^\s*$/.test(str));
}

export function generateRandomString () : string {
    return Math.random().toString(36).substring(7);
}
