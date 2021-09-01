import { OrganizationResponse } from "../services/user/IUserInformationService";
import { atom } from "recoil";

export enum OrientationType {
    PORTRAIT = `portrait`,
    LANDSCAPE = `landscape`,
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
    },
});

export const homeFunStudyState = atom({
    key: `homeFunStudy`,
    default: undefined as {
        open: boolean;
        submitted: boolean;
        studyId: string | undefined;
    } | undefined,
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
    key: `errorManagement`,
    default: {
        isError: false,
        errorCode: null as number | null,
    },
});
