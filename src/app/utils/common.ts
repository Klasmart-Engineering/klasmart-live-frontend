export function getRandomInt (min: number, max: number) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt) + minInt); // the maximum is exclusive and the minimum is inclusive
}
