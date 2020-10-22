import { combineReducers } from "redux";
import { getDefaultLanguageCode } from "../utils/locale";
import {
    Actions,
    ActionTypes,
    ClassType,
    UserAgent,
    UserType,
    OrientationType,
} from "./actions";

// Session
export function classType(state: ClassType = ClassType.LIVE, action: Actions) {
    switch (action.type) {
        case ActionTypes.CLASS_TYPE:
            return action.payload;
        default:
            return state;
    }
}
export function userAgent(state: UserAgent = {
    isLandscape: false,
    isPortrait: false,
    isMobileOnly: false,
    isTablet: false,
    isBrowser: false,
    isSmartTV: false,
    isAndroid: false,
    isIOS: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isIE: false,
    isEdge: false,
    isChromium: false,
    isMobileSafari: false,
}, action: Actions) {
    switch (action.type) {
        case ActionTypes.USER_AGENT:
            return action.payload;
        default:
            return state;
    }
}
export function userType(state: UserType = UserType.STUDENT, action: Actions) {
    switch (action.type) {
        case ActionTypes.USER_TYPE:
            return action.payload;
        default:
            return state;
    }
}
export function locale(state = getDefaultLanguageCode(), action: Actions) {
    switch (action.type) {
        case ActionTypes.LOCALE:
            return action.payload;
        default:
            return state;
    }
}

// Control
export function darkMode(state = "light", action: Actions) {
    switch (action.type) {
        case ActionTypes.DARK_MODE:
            return action.payload;
        default:
            return state;
    }
}
export function drawerOpen(state = true, action: Actions) {
    switch (action.type) {
        case ActionTypes.DRAWER_OPEN:
            return action.payload;
        default:
            return state;
    }
}
export function drawerWidth(state = 0, action: Actions) {
    switch (action.type) {
        case ActionTypes.DRAWER_WIDTH:
            return action.payload;
        default:
            return state;
    }
}
export function colsCamera(state = 2, action: Actions) {
    switch (action.type) {
        case ActionTypes.COLS_CAMERA:
            return action.payload;
        default:
            return state;
    }
}
export function colsObserve(state = 2, action: Actions) {
    switch (action.type) {
        case ActionTypes.COLS_OBSERVE:
            return action.payload;
        default:
            return state;
    }
}
export function contentIndex(state = 0, action: Actions) {
    switch (action.type) {
        case ActionTypes.CONTENT_INDEX:
            return action.payload;
        default:
            return state;
    }
}

// location
export function deviceOrientation(state: OrientationType = OrientationType.PORTRAIT, action: Actions) {
    switch (action.type) {
        case ActionTypes.DEVICE_ORIENTATION:
            return action.payload;
        default:
            return state;
    }
}

export const data = combineReducers({});

export const communication = combineReducers({});

export const control = combineReducers({
    darkMode,
    drawerOpen,
    drawerWidth,
    colsCamera,
    colsObserve,
    contentIndex
});

export const session = combineReducers({
    classType,
    userAgent,
    userType,
    locale,
});

export const location = combineReducers({
    deviceOrientation,
});