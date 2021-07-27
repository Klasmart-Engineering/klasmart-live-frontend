import { createSlice } from "@reduxjs/toolkit";
import { ClassType, UserAgent, UserType } from "../actions";
import { getDefaultLanguageCode } from "../../utils/locale";
import { OrganizationResponse } from "../../services/user/IUserInformationService";

type SessionState = {
    classType: ClassType;
    userAgent: UserAgent;
    userType: UserType;
    locale: string;
    selectedUserId: string | undefined;
    selectedOrg: OrganizationResponse | undefined;
    regionId: string;
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
    locale: getDefaultLanguageCode(),
    selectedUserId: undefined,
    selectedOrg: undefined,
    regionId: "auth.alpha.kidsloop.live",
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
        },
        setSelectedUserId(state, action) {
            return { ...state, selectedUserId: action.payload }
        },
        setSelectedOrg(state, action) {
            return { ...state, selectedOrg: action.payload }
        },
        setRegionId(state, action) {
            return { ...state, regionId: action.payload }
        }
    }
})

export const {
    setClassType,
    setUserAgent,
    setUserType,
    setLocale,
    setSelectedUserId,
    setSelectedOrg,
    setRegionId
} = sessionSlice.actions

export default sessionSlice.reducer