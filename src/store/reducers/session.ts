import { createSlice } from "@reduxjs/toolkit";
import { ClassType, UserAgent, UserType } from "../actions";
import { getDefaultLanguageCode } from "../../utils/locale";
import { OrganizationResponse, UserInformation } from "../../services/user/IUserInformationService";

type SessionState = {
    classType: ClassType;
    userAgent: UserAgent;
    userType: UserType;
    locale: string;
    user: UserInformation;
    selectedOrg: OrganizationResponse;
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
    user: {
        id: "",
        email: "",
        name: "",
        givenName: "",
        familyName: "",
        avatar: "",
        organizations: [],
        classes: [],
    },
    selectedOrg: { organization_id: "", organization_name: "" }
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
        setUser(state, action) {
            return { ...state, user: action.payload }
        },
        setSelectedOrg(state, action) {
            return { ...state, selectedOrg: action.payload }
        },
    }
})

export const {
    setClassType,
    setUserAgent,
    setUserType,
    setLocale,
    setUser,
    setSelectedOrg
} = sessionSlice.actions

export default sessionSlice.reducer