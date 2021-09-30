import { HomeFunStudyFeedback } from "../dialogs/home-fun-study/homeFunStudyDialog";
import { OrganizationResponse } from "../services/user/IUserInformationService";
import { atom } from "recoil";

export enum OrientationType {
    PORTRAIT = `portrait`,
    LANDSCAPE = `landscape`,
}

export enum LayoutMode {
    DEFAULT, CLASSROOM
}

export const isProcessingRequestState = atom({
    key: `isProcessingRequest`,
    default: false,
});

export const dialogsState = atom({
    key: `dialogs`,
    default: {
        isSelectOrganizationOpen: false,
        isSelectUserOpen: false,
        isParentalLockOpen: false,
    },
});

export const homeFunStudyState = atom({
    key: `homeFunStudy`,
    default: {
        open: false,
        feedback: [],
    } as {
        open: boolean;
        submitted?: boolean;
        studyId?: string | undefined;
        feedback: HomeFunStudyFeedback[];
    },
});

export const selectedOrganizationState = atom({
    key: `selectedOrganization`,
    default: undefined as OrganizationResponse | undefined,
});

export const selectedUserState = atom({
    key: `selectedUser`,
    default: {
        userId: undefined as string | undefined,
    },
});

export const errorState = atom({
    key: `errorState`,
    default: {
        isError: false,
        errorCode: null as number | null,
    },
});

export const selectedRegionState = atom({
    key: `selectedRegion`,
    default: {
        regionId: process.env.IS_CORDOVA_BUILD ? `auth.alpha.kidsloop.net` : `env`,
    },
});

export const authState = atom({
    key: `authState`,
    default: {
        transferToken: undefined as string | undefined,
    },
});

export const localeState = atom({
    key: `locale`,
    default: {
        languageCode: `en`,
    },
});

export const historyState = atom({
    key: `history`,
    default: [] as string[],
});

export const layoutModeState = atom<LayoutMode>({
    key: `layoutMode`,
    default: LayoutMode.DEFAULT,
});
