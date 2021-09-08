import { createSlice } from "@reduxjs/toolkit";
import { ClassType, UserAgent, UserType } from "@/store/actions";
import { getDefaultLanguageCode } from "@/utils/locale";

type SessionState = {
    userAgent: UserAgent;
}

const initialSessionState: SessionState = {
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
};

const sessionSlice = createSlice({
    name: `session`,
    initialState: initialSessionState,
    reducers: {
        setUserAgent (state, action) {
            return {
                ...state,
                userAgent: action.payload,
            };
        },
    },
});

export const { setUserAgent } = sessionSlice.actions;

export default sessionSlice.reducer;
