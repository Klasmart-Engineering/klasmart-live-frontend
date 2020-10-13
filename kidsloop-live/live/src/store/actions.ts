// TODO: Move types to correct file

export enum ActionTypes {
    CLASS_TYPE,
    USER_AGENT,
    USER_TYPE,
    STREAM_ID,
    LOCALE,
    DARK_MODE,
    DRAWER_OPEN,
    DRAWER_WIDTH,
}
export interface Action<T extends ActionTypes, P> { type: T; payload: P; }

export enum ClassType {
    LIVE = 0,
    // CLASS = 1,
    HOMEWORK = 2,
}
export type SetClassType = Action<ActionTypes.CLASS_TYPE, ClassType>;

export interface UserAgent {
    // Higher-order
    isLandscape: boolean;
    isPortrait: boolean;

    isMobileOnly: boolean;
    isTablet: boolean;
    isBrowser: boolean;
    isSmartTV: boolean;
    isAndroid: boolean;
    isIOS: boolean;

    // Browser
    isChrome: boolean;
    isFirefox: boolean;
    isSafari: boolean;
    isIE: boolean;
    isEdge: boolean;
    isChromium: boolean;
    isMobileSafari: boolean;
}
export type SetUserAgent = Action<ActionTypes.USER_AGENT, UserAgent>;

export enum UserType {
    TEACHER = "teacher",
    STUDENT = "student",
}
export type SetUserType = Action<ActionTypes.USER_TYPE, UserType>;

export type SetStreamId = Action<ActionTypes.STREAM_ID, string>;

// UI
export type SetLocale = Action<ActionTypes.LOCALE, string>;
export type SetDarkMode = Action<ActionTypes.DARK_MODE, string>;
export type SetDrawerOpen = Action<ActionTypes.DRAWER_OPEN, boolean>;
export type SetDrawerWidth = Action<ActionTypes.DRAWER_WIDTH, number>;

export type Actions =
    | SetClassType
    | SetUserAgent
    | SetUserType
    | SetStreamId
    | SetLocale
    | SetDarkMode
    | SetDrawerOpen
    | SetDrawerWidth
    | never;
