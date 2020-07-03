import { combineReducers } from "redux";
import { getDefaultLanguageCode } from "../utils/locale";
import { Actions, ActionTypes } from "./actions";

export function locale(state = getDefaultLanguageCode(), action: Actions) {
    switch (action.type) {
        case ActionTypes.LOCALE:
            return action.payload;
        default:
            return state;
    }
}

export function userAgent(state = {
    isEdge: false,
    isIE: false,
    isIOS: false,
    isLandscape: false,
    isMobile: false,
    isMobileSafari: false,
}, action: Actions) {
    switch (action.type) {
        case ActionTypes.USER_AGENT:
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

export function deviceId(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.DEVICE_ID:
            return action.payload;
        default:
            return state;
    }
}

export function postAuthorizationRoute(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.POST_AUTHORIZATION_ROUTE:
            return action.payload;
        default:
            return state;
    }
}

export function sessionId(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            if (typeof action.payload === "object" &&
                typeof action.payload.sessionId === "string") {
                return action.payload.sessionId;
            }
        // Fall through
        case ActionTypes.LOGOUT:
            return null;
        default:
            return state;
    }
}

export function accountId(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
        case ActionTypes.SIGNUP:
        case ActionTypes.ACCOUNT_ID:
            if (typeof action.payload === "object" &&
                typeof action.payload.accountId === "string") {
                return action.payload.accountId;
            }
            return null;
        case ActionTypes.LOGOUT:
        default:
            return state;
    }
}

export function email(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            if (typeof action.payload === "object" &&
                typeof action.payload.email === "string") {
                return action.payload.email;
            }
            return null;
        case ActionTypes.EMAIL:
            return action.payload;
        case ActionTypes.LOGOUT:
        default:
            return state;
    }
}

export function refreshToken(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            if (typeof action.payload === "object" &&
                typeof action.payload.refreshToken === "string") {
                return action.payload.refreshToken;
            }
        // Fall through
        case ActionTypes.LOGOUT:
        case ActionTypes.EXPIRED_REFRESH_TOKEN:
            return null;
        default:
            return state;
    }
}

export function refreshTokenExpire(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            if (typeof action.payload === "object" &&
                typeof action.payload.refreshTokenExpire === "number") {
                return action.payload.refreshTokenExpire;
            }
        // Fall through
        case ActionTypes.LOGOUT:
        case ActionTypes.EXPIRED_REFRESH_TOKEN:
            return null;
        default:
            return state;
    }
}

export function accessToken(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
        case ActionTypes.REFRESH_SESSION:
            if (typeof action.payload === "object" &&
                typeof action.payload.accessToken === "string") {
                return action.payload.accessToken;
            }
        // Fall Through
        case ActionTypes.LOGOUT:
        case ActionTypes.EXPIRED_ACCESS_TOKEN:
            return null;
        default:
            return state;
    }
}

export function accessTokenExpire(state = null, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOGIN:
        case ActionTypes.REFRESH_SESSION:
            if (typeof action.payload === "object" &&
                typeof action.payload.accessTokenExpire === "number") {
                return action.payload.accessTokenExpire;
            }
        // Fall Through
        case ActionTypes.LOGOUT:
        case ActionTypes.EXPIRED_ACCESS_TOKEN:
            return null;
        default:
            return state;
    }
}

export function classSettings(state = false, action: Actions) {
    switch (action.type) {
        case ActionTypes.CLASS_SETTINGS_TOGGLE:
            return action.payload;
        default:
            return state;
    }
}

export function liveClass(state = false, action: Actions) {
    switch (action.type) {
        case ActionTypes.LIVE_CLASS_TOGGLE:
            return action.payload;
        default:
            return state;
    }
}

export function activeComponentHome(state = "live", action: Actions) {
    switch (action.type) {
        case ActionTypes.ACTIVE_COMPONENT_HOME:
            return action.payload;
        default:
            return state;
    }
}


// NOTE: Only requests with formatted JWT token can access current API server for assessment
// You can parse in https://jwt.io/
export const JWT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWRhbmFtdSBhcHAiLCJpYXQiOjE1OTE2ODU4MzgsInN1YiI6ImF1dGhvcml6YXRpb24iLCJpc3MiOiJLaWRzTG9vcENoaW5hVXNlciIsImV4cCI6MTkwODMyNTI0OSwiaWQiOiI0NSIsIm9yZ19pZCI6IjkifQ=.RawtL06bFxeJ2zMQnp0oe+LnBWNIX4lMo/F7hFW85SU";
export function assessmentToken(state = JWT_TOKEN, action: Actions) {
    switch (action.type) {
        case ActionTypes.ASSESSMENT_TOKEN:
            return action.payload;
        default:
            return state;
    }
}

import Avatar from "../assets/img/zoo_teacher.jpg";
const STUDENT_LIST = [
    {
        profileId: "student0",
        profileName: "Woody",
        iconLink: ""
    },
    {
        profileId: "student1",
        profileName: "Buzz Lightyear",
        iconLink: ""
    },
    {
        profileId: "student2",
        profileName: "Rex",
        iconLink: Avatar
    },
    {
        profileId: "student3",
        profileName: "Slinky Dog",
        iconLink: ""
    },
]
export function students(state = STUDENT_LIST, action: Actions) {
    switch (action.type) {
        case ActionTypes.STUDENTS:
            return action.payload;
        default:
            return state;
    }
}

export function activeAssessmentsMenu(state = "library", action: Actions) {
    switch (action.type) {
        case ActionTypes.ACTIVE_ASSESSMENTS_MENU:
            return action.payload;
        default:
            return state;
    }
}

export const account = combineReducers({
    assessmentToken,
    accessToken,
    accessTokenExpire,
    accountId,
    deviceId,
    email,
    refreshToken,
    refreshTokenExpire,
    sessionId,
    userAgent,
    students,
});

export const ui = combineReducers({
    activeComponentHome,
    classSettings,
    darkMode,
    liveClass,
    locale,
    activeAssessmentsMenu,
});
