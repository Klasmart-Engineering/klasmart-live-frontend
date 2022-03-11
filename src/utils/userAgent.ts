const userPlatform = navigator.platform;
const userAgent = navigator.userAgent;

export function isIOS (): boolean {
    return [
        `iPad Simulator`,
        `iPhone Simulator`,
        `iPod Simulator`,
        `iPad`,
        `iPhone`,
        `iPod`,
    ].includes(userPlatform)
        || (
            userAgent.includes(`Mac`)
            && `ontouchend` in document
            && userAgent.indexOf(`Opera`) === -1
            && userAgent.indexOf(`OPR`) === -1
        );
}

type UserBrowser = "Chrome" | "Safari" | "Other"
export function whichBrowser (): UserBrowser {
    if (userAgent.indexOf(`Chrome`) !== -1 && userAgent.indexOf(`Edg`) === -1) { // Check it is not Edge
        return `Chrome`;
    } else if (
        !!userAgent.match(/Version\/[\d\.]+.*Safari/)
        && userAgent.indexOf(`Edg`) === -1 // Edge
        && userAgent.indexOf(`FxiOS`) === -1 // Firefox
    ) {
        if (isIOS() && userPlatform === `iPad`) { // Handle Firefox on iPad
            return userAgent.indexOf(userPlatform) === -1 ? `Other` : `Safari`;
        } else {
            return `Safari`;
        }
    } else {
        return `Other`;
    }
}

//Currently, when user switch between mobile site and desktop site, user-agent returns unexpected values that we can't detect mobile browser.
//Instead, we have to detect through getDisplayMedia
export const isMobileBrowser = typeof navigator.mediaDevices?.getDisplayMedia !== `function`;
export const isIOSBrowser = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === `MacIntel` && navigator.maxTouchPoints > 1));
export const isAndroidBrowser = isMobileBrowser && !isIOSBrowser;
