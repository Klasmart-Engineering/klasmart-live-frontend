// TODO: Move types to correct file

export enum ActionTypes {
    SCHEDULES,

    SUCCESS,
    FAILURE,
    RETRIEVING,
    CREATING,
    UPDATING,
    DELETING,

    CLASS_TYPE,
    USER_AGENT,
    USER_TYPE,
    LOCALE,

    DARK_MODE,
    DRAWER_OPEN,
    DRAWER_WIDTH,
    COLS_CAMERA,
    COLS_OBSERVE,
    CONTENT_INDEX,

    DEVICE_ORIENTATION,

    VOLUME_VOD,
    VOLUME_VOICE,
}
export interface Action<T extends ActionTypes, P> {
    type: T;
    payload: P;
}

export interface Payload {
    total: number;
    data: any[]
}
export type SetSchedules = Action<ActionTypes.SCHEDULES, Payload>;

export type SetSuccess = Action<ActionTypes.SUCCESS, boolean>;
export type SetFailure = Action<ActionTypes.FAILURE, boolean>;
export type SetRetrieving = Action<ActionTypes.RETRIEVING, boolean>;
export type SetCreating = Action<ActionTypes.CREATING, boolean>;
export type SetUpdating = Action<ActionTypes.UPDATING, boolean>;
export type SetDeleting = Action<ActionTypes.DELETING, boolean>;

export enum ClassType {
    LIVE = "live",
    CLASSES = "class",
    STUDY = "study",
    TASK = "task"
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

// In the future, might be need more specific types for student
export enum UserType {
    TEACHER = "teacher",
    STUDENT = "student",
}
export type SetUserType = Action<ActionTypes.USER_TYPE, UserType>;
export type SetLocale = Action<ActionTypes.LOCALE, string>;

export type SetDarkMode = Action<ActionTypes.DARK_MODE, string>;
export type SetDrawerOpen = Action<ActionTypes.DRAWER_OPEN, boolean>;
export type SetDrawerWidth = Action<ActionTypes.DRAWER_WIDTH, number>;
export type SetColsCamera = Action<ActionTypes.COLS_CAMERA, number>;
export type SetColsObserve = Action<ActionTypes.COLS_OBSERVE, number>;
export type SetContentIndex = Action<ActionTypes.CONTENT_INDEX, number>;

export enum OrientationType {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape",
}
export type SetDeviceOrientation = Action<ActionTypes.DEVICE_ORIENTATION, OrientationType>;

export type SetVolumeVod = Action<ActionTypes.VOLUME_VOD, number>;
export type SetVolumeVoice = Action<ActionTypes.VOLUME_VOICE, number>;

export type Actions =
    | SetSchedules
    | SetSuccess
    | SetFailure
    | SetRetrieving
    | SetCreating
    | SetUpdating
    | SetDeleting
    | SetClassType
    | SetUserAgent
    | SetUserType
    | SetLocale
    | SetDarkMode
    | SetDrawerOpen
    | SetDrawerWidth
    | SetColsCamera
    | SetColsObserve
    | SetContentIndex
    | SetDeviceOrientation
    | SetVolumeVod
    | SetVolumeVoice
    | never;
