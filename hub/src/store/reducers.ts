import { combineReducers } from "redux";
import { getDefaultLanguageCode } from "../utils/locale";
import { Actions, ActionTypes } from "./actions";
import { AssessmentsMenu } from "../types/objectTypes";

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

export function activeLibraryMenu(state = "published", action: Actions) {
    switch (action.type) {
    case ActionTypes.ACTIVE_LIBRARY_MENU:
        return action.payload;
    default:
        return state;
    }
}

export function activeAssessmentsMenu(state: AssessmentsMenu = "library", action: Actions) {
    switch (action.type) {
    case ActionTypes.ACTIVE_ASSESSMENTS_MENU:
        return action.payload;
    default:
        return state;
    }
}

const CONTENT_TYPE_LIST = ["Activity"];
export function contentTypes(state = CONTENT_TYPE_LIST, action: Actions) {
    switch (action.type) {
    case ActionTypes.CONTENT_TYPES:
        return action.payload;
    default:
        return state;
    }
}

const PUBLIC_RANGE_LIST = ["All", "Organiztion", "Private"];
export function publicRange(state = PUBLIC_RANGE_LIST, action: Actions) {
    switch (action.type) {
    case ActionTypes.PUBLIC_RANGES:
        return action.payload;
    default:
        return state;
    }
}

const SUITABLE_AGE_LIST = ["12-24 months", "2-4 years", "4-7 years"];
export function suitableAges(state = SUITABLE_AGE_LIST, action: Actions) {
    switch (action.type) {
    case ActionTypes.SUITABLE_AGES:
        return action.payload;
    default:
        return state;
    }
}

export function finishLiveData(state = {
    classId: "CalmIsland",
    className: "Pre-production",
    startDate: new Date().getTime(), // TODO: have to fix
    students: [
        {
            profileId: "Bada",
            profileName: "Bada",
            iconLink: "",
        },
        {
            profileId: "Pogo",
            profileName: "Pogo",
            iconLink: "",
        },
        {
            profileId: "Curly",
            profileName: "Curly",
            iconLink: ""
        },
        {
            profileId: "Jess",
            profileName: "Jess",
            iconLink: "",
        },
    ],
}, action: Actions) {
    switch (action.type) {
    case ActionTypes.FINISH_LIVE_DATA:
        return action.payload;
    default:
        return state;
    }
}

const ACTIVITY_LIST = [
    {
        id: "5ed99fe36aad833ac89a4803",
        title: "Snow Leopard Intro"
    },
    {
        id: "5ed75e1b6aad833ac89a47fa",
        title: "Snow Leopard Speech"
    },
    {
        id: "5ed05dd1611e18398f7380f4",
        title: "Snow Leopard Flashcards"
    },
    {
        id: "5ed0b64a611e18398f7380fb",
        title: "Snow Leopard Sticker"
    },
    {
        id: "5ecf6f43611e18398f7380f0",
        title: "Snow Leopard Hotspot"
    },
    {
        id: "5ecf71d2611e18398f7380f2",
        title: "Snow Leopard Camouflage"
    },
    {
        id: "5ecf4e4b611e18398f7380ef",
        title: "Snow Leopard Matching"
    },
    {
        id: "5ed07656611e18398f7380f6",
        title: "Snow Leopard Quiz"
    },
];
export function activities(state = ACTIVITY_LIST, action: Actions) {
    switch (action.type) {
    case ActionTypes.ACTIVITIES:
        return action.payload;
    default:
        return state;
    }
}

export function selectedLessonPlan(state = "", action: Actions) {
    switch (action.type) {
    case ActionTypes.SELECTED_LESSON_PLAN:
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
    finishLiveData,
    refreshToken,
    refreshTokenExpire,
    sessionId,
    userAgent,
    contentTypes,
    publicRange,
    suitableAges,
    activities,
    selectedLessonPlan,
});

export const ui = combineReducers({
    activeComponentHome,
    classSettings,
    darkMode,
    liveClass,
    locale,
    activeLibraryMenu,
    activeAssessmentsMenu,
});
