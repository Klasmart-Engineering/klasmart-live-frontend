import { combineReducers } from "redux";
import { getDefaultLanguageCode } from "../utils/locale";
import {
    Actions,
    ActionTypes,
    ClassType,
    UserAgent,
    UserType,
} from "./actions";

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

export function darkMode(state = "light", action: Actions) {
    switch (action.type) {
        case ActionTypes.DARK_MODE:
            return action.payload;
        default:
            return state;
    }
}

export const data = combineReducers({

});

export const communication = combineReducers({

});

export const control = combineReducers({

});

export const session = combineReducers({
    classType,
    userAgent,
    userType,
});

export const location = combineReducers({

});