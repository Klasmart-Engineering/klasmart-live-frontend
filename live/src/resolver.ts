//Resolver returns a promise and it's resolve function together
//A promise can be obtained synchronously e.g. new Promise(...)
//But the associated resolve function is created asynchronously
//Resolver creates a Promise that allows us to wait until that resolve function is available
export type PrePromise<T> = Promise<{promise: Promise<T>, resolver: (t: T) => any}>
export async function Resolver<T>(): PrePromise<T> {
    return new Promise<{promise: Promise<T>, resolver: (t: T) => any}>(
        (resolve) => {
            const result: {promise: Promise<T>, resolver: (t: T) => any} = {promise: undefined, resolver: undefined} as any
            result.promise = new Promise<T>((resolver) => {
                result.resolver = resolver
                resolve(result)
            })
        }
    )
}