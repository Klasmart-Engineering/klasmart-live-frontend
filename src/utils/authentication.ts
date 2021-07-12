
let refreshRequestMutex: Promise<boolean> | undefined
export async function refreshAuthenticationCookie(): Promise<boolean> {
    if (refreshRequestMutex) { return refreshRequestMutex }
    return refreshRequestMutex = new Promise<boolean>(async (resolve) => {
        try {
            const endpoint = process.env.REFRESH_COOKIE_ENDPOINT || getDefaultRefreshEndpoint()
            const response = await fetch(endpoint, { credentials: "include" })
            resolve(response.ok)
        } catch (e) {
            console.error(e)
            resolve(false)
        } finally {
            refreshRequestMutex = undefined // Unlock mutex
        }
    })
}

function getDefaultRefreshEndpoint() {
    const domain = getDomain()
    return `https://auth.${domain}/refresh`
}

function getDomain() {
    // https://live.kidsloop.live:8080/?token=ey....
    const { hostname } = window.location
    // live.kidsloop.live
    const allParts = hostname.split(".")
    // [live, kidsloop, live]
    const topParts = allParts.slice(-2)
    // [ kidsloop, live]
    const domain = topParts.join(".")
    // "kidsloop.live"
    return domain
}