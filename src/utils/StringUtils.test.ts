import { isBlank } from "./StringUtils";

describe(`isBlank`, () => {
    test(`empty string`, () => {
        expect(isBlank(``)).toBeTruthy();
    });

    test(`string with several whitespaces`, () => {
        expect(isBlank(`\t\r\n\f`)).toBeTruthy();
    });
});
