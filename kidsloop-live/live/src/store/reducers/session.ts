import { createSlice } from "@reduxjs/toolkit";
import { ClassType, UserAgent, UserType } from "../actions";
import { getDefaultLanguageCode } from "../../utils/locale";

type SessionState = {
    classType: ClassType;
    userAgent: UserAgent;
    userType: UserType;
    locale: string;
}

const initialSessionState: SessionState = {
    classType: ClassType.LIVE,
    userAgent: {
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
    },
    userType: UserType.STUDENT,
    locale: getDefaultLanguageCode()
}

const sessionSlice = createSlice({
    name: "session",
    initialState: initialSessionState,
    reducers: {
        setClassType(state, action) {
            return { ...state, classType: action.payload }
        },
        setUserAgent(state, action) {
            return { ...state, userAgent: action.payload }
        },
        setUserType(state, action) {
            return { ...state, userType: action.payload }
        },
        setLocale(state, action) {
            return { ...state, locale: action.payload }
        }
    }
})

export const {
    setClassType,
    setUserAgent,
    setUserType,
    setLocale
} = sessionSlice.actions

export default sessionSlice.reducer