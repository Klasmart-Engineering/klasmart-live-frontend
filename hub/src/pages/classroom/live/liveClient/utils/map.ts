export function* mapGenerator<T, S>(ts: Iterable<T>, f: (t: T, i: number) => S) {
    let i = 0;
    for (const t of ts) {
        yield f(t, i++);
    }
}
