import { atom } from "recoil";

export const isProcessingRequest = atom({
    key: `isProcessingRequest`,
    default: false,
});

export const dialogs = atom({
    key: `dialogs`,
    default: {
        isHomeFunStudyOpen: false,
        isSelectOrganizationOpen: false,
        isSelectUserOpen: false,
    },
});
