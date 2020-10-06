declare module "redux-persist-cookie-storage" {
    export interface SetCookieOptions<D> {
        expires: D;
    }
    export interface Cookies<D, Key> {
        set: (key: Key, value: string, indexOptions: SetCookieOptions<D>) => any;
        get: (key: Key) => string;
        expire: (key: Key) => any;
    }
    export interface Options<D, Index> {
        keyPrefix?: string;
        indexKey?: Index;
        expiration?: {[key: string]: D} & {default?: D|null};
        setCookieOptions?: SetCookieOptions<D>;
    }
    export class CookieStorage<D = any, Key = string> {
        public keyPrefix?: string;
        public indexKey?: Key;
        public expiration?: {[key: string]: D} & {default?: D|null};
        public setCookieOptions?: SetCookieOptions<D>;
        constructor(cookies: Cookies<D, Key>, options?: Options<D, Key>)

        public getItem(
            key: Key,
            callback?: (err: null, result: string) => any,
        ): Promise<string>;

        public setItem(
            key: Key,
            value: string,
            callback?: (err: null) => any,
        ): Promise<null>;

        public removeItem(
            key: Key,
            callback?: (err: null, result: any) => any,
        ): Promise<null> ;

        public getAllKeys(
            callback?: (err: null, result: ReturnType<typeof JSON.parse>) => any,
        ): Promise<ReturnType<typeof JSON.parse>>;

    }
}
