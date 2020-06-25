import { UserAgent } from "../types/objectTypes";

export interface Action<T extends ActionTypes, P> {
    type: T;
    payload: P;
}

export type SetLocale = Action<ActionTypes.LOCALE, string>;

export type SetUserAgent = Action<ActionTypes.USER_AGENT, UserAgent>;

export type SetDarkMode = Action<ActionTypes.DARK_MODE, string>;

export type PostAuthorizationRouteAction = Action<ActionTypes.POST_AUTHORIZATION_ROUTE, string>;

export type LoginAction = Action<ActionTypes.LOGIN, {
    sessionId?: string | any,
    accountId?: string | any,
    email?: string | any,
    refreshToken?: string | any,
    refreshTokenExpire?: number | any,
    accessToken?: string | any,
    accessTokenExpire?: number | any,
} | any | undefined>;

export interface LogoutAction { type: ActionTypes.LOGOUT; }

export type SignUpAction = Action<ActionTypes.SIGNUP, {
    accountId?: string | any,
} | any | undefined>;

export type RefreshSessionAction = Action<ActionTypes.REFRESH_SESSION, {
    accessToken?: string | any,
    accessTokenExpire?: number | any,
} | any | undefined>;

export type AccountIdAction = Action<ActionTypes.ACCOUNT_ID, {
    accountId?: string | any,
} | any | undefined>;

export type SetEmailAction = Action<ActionTypes.EMAIL, string>;

export interface RefreshTokenExpiredAction { type: ActionTypes.EXPIRED_REFRESH_TOKEN; }

export interface AccessTokenExpiredAction { type: ActionTypes.EXPIRED_ACCESS_TOKEN; }

export type DeviceIdAction = Action<ActionTypes.DEVICE_ID, string>;

export type ToggleClassSettings = Action<ActionTypes.CLASS_SETTINGS_TOGGLE, boolean>;

export type ToggleLiveClass = Action<ActionTypes.LIVE_CLASS_TOGGLE, boolean>;

export type SetActiveComponentHome = Action<ActionTypes.ACTIVE_COMPONENT_HOME, string>;

export type SetAssessmentToken = Action<ActionTypes.ASSESSMENT_TOKEN, string>;

export enum ActionTypes {
    LOCALE,
    LOGIN,
    SIGNUP,
    LOGOUT,
    LIVE_CLASS_TOGGLE,
    REFRESH_SESSION,
    POST_AUTHORIZATION_ROUTE,
    DARK_MODE,
    ACCOUNT_ID,
    EXPIRED_REFRESH_TOKEN,
    EMAIL,
    USER_AGENT,
    DEVICE_ID,
    EXPIRED_ACCESS_TOKEN,
    CLASS_SETTINGS_TOGGLE,
    ACTIVE_COMPONENT_HOME,
    ASSESSMENT_TOKEN
}

export type Actions =
    | SetLocale
    | SetDarkMode
    | SetUserAgent
    | LoginAction
    | LogoutAction
    | SignUpAction
    | SetEmailAction
    | ToggleClassSettings
    | PostAuthorizationRouteAction
    | RefreshTokenExpiredAction
    | AccountIdAction
    | RefreshSessionAction
    | AccessTokenExpiredAction
    | DeviceIdAction
    | ToggleLiveClass
    | SetActiveComponentHome
    | SetAssessmentToken
    | never;
