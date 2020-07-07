import { UserAgent, LiveSessionData } from "../types/objectTypes";
import { LessonPlanResponse } from "../pages/classroom/assessments/api/restapi";

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

export type AssessmentToken = Action<ActionTypes.ASSESSMENT_TOKEN, string>;

export type SetStudents = Action<ActionTypes.STUDENTS, Array<{
    profileId: string,
    profileName: string,
    iconLink: string,
}>>;

export type LibraryMenu = "published" | "pending" | "archived";
export type SetActiveLibraryMenu = Action<ActionTypes.ACTIVE_LIBRARY_MENU, LibraryMenu>;

export enum AssessmentsMenu {
    LIBRARY = "library",
    PENDING = "pending",
    COMPLETED = "completed",
}
export type SetActiveAssessmentsMenu = Action<ActionTypes.ACTIVE_ASSESSMENTS_MENU, AssessmentsMenu>;

export type ContentTypes = Action<ActionTypes.CONTENT_TYPES, string[]>;

export type PublicRange = Action<ActionTypes.PUBLIC_RANGES, string[]>;

export type SuitableAges = Action<ActionTypes.SUITABLE_AGES, string[]>;

export type Activities = Action<ActionTypes.ACTIVITIES, { id: string, title: string }[]>;

export type FinishLiveData = Action<ActionTypes.FINISH_LIVE_DATA, LiveSessionData>;

export type SelectedLessonPlan = Action<ActionTypes.SELECTED_LESSON_PLAN, LessonPlanResponse>;

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
    ASSESSMENT_TOKEN,
    STUDENTS,
    ACTIVE_LIBRARY_MENU,
    ACTIVE_ASSESSMENTS_MENU,
    CONTENT_TYPES,
    PUBLIC_RANGES,
    SUITABLE_AGES,
    ACTIVITIES,
    FINISH_LIVE_DATA,
    SELECTED_LESSON_PLAN,
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
    | AssessmentToken
    | SetStudents
    | SetActiveLibraryMenu
    | SetActiveAssessmentsMenu
    | ContentTypes
    | PublicRange
    | SuitableAges
    | Activities
    | FinishLiveData
    | SelectedLessonPlan
    | never;
