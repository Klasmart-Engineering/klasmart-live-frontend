
let refreshRequestMutex: Promise<boolean> | undefined
export async function refreshAuthenticationCookie(): Promise<boolean> {
    if (refreshRequestMutex) { return refreshRequestMutex }
    return refreshRequestMutex = new Promise<boolean>(async (resolve) => {
        try {
            const endpoint = getRefreshEndpoint()
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

export function redirectToLogin() {
    const currentUrl = window.location.toString()
    const redirectionUrl = getLoginPageUrl()
    redirectionUrl.searchParams.set("continue", currentUrl)
    window.location.replace(redirectionUrl.toString())
}

function getRefreshEndpoint() {
    const override =  process.env.REFRESH_COOKIE_ENDPOINT
    if(override) { return override }

    const domain = getDomain()
    return `https://auth.${domain}/refresh`
}


const loginPageUrlOverride = process.env.LOGIN_PAGE_URL
function getLoginPageUrl() {
    const domain = getDomain()
    const url = new URL(`https://auth.${domain}/`)
    try {
        if(loginPageUrlOverride) { return new URL(loginPageUrlOverride) }
    } catch(e) {
        console.error(`Build misconfiguration LOGIN_PAGE_URL is set to '${loginPageUrlOverride}' which is an invalid URL`)
        console.info(`will attempt to use default value '${url.toString()}' for login redirection`)
    }
    return url
}
//Detect LOGIN_PAGE_URL misconfiguration immediately upon page load
getLoginPageUrl()


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