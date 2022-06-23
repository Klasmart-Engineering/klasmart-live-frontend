import { AuthTokenProvider } from "./AuthTokenProvider";

global.window = Object.create(window);
global.window.parent = Object.create(window);
const URL = `https://example.com`;
const TOKEN = `abc123`;
interface Url {
    url: string;
    isParent?: boolean;
}
// Helper function that sets the window.location.href and window.parent.location.href
const defineWindowUrl = ({ url, isParent = false }: Url) => {
    Object.defineProperty(isParent ? global.window.parent : global.window, `location`, {
        value: {
            href: url,
        },
        writable: true,
    });
};
describe(`AuthTokenProvider`, () => {
    it(`Should return token from querystring`, () => {
        defineWindowUrl({
            url: `${URL}?token=${TOKEN}`,
        });
        expect(AuthTokenProvider.retrieveToken()).toBe(TOKEN);
    });
    it(`Should return token from parent window`, () => {
        defineWindowUrl({
            url: `${URL}?token=${TOKEN}`,
        });
        defineWindowUrl({
            url: `${URL}?token=${TOKEN}`,
            isParent: true,
        });
        expect(AuthTokenProvider.retrieveToken()).toBe(TOKEN);
    });
    it(`Should return token from localStorage`, () => {
        defineWindowUrl({
            url: URL,
        });
        defineWindowUrl({
            url: URL,
            isParent: true,
        });
        localStorage.setItem(`token`, TOKEN);
        expect(AuthTokenProvider.retrieveToken()).toBe(TOKEN);
    });
    it(`Should return null if no token is found`, () => {
        defineWindowUrl({
            url: URL,
        });
        defineWindowUrl({
            url: URL,
            isParent: true,
        });
        localStorage.removeItem(`token`);
        expect(AuthTokenProvider.retrieveToken()).toBeNull();
    });
});
