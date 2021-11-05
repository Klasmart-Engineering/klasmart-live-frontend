import { HomeFunStudyFeedback } from "../dialogs/home-fun-study/homeFunStudyDialog";
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

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
        isSettingsOpen: false,
        isSettingsLanguageOpen: false,
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

export const authState = atom<{transferToken?: string}>({
    key: `authState`,
    default: {
        transferToken: undefined,
    },
});

export const localeState = atom({
    key: `locale`,
    default: {
        languageCode: `en`,
    },
    effects_UNSTABLE: [ persistAtom ],
});

export const historyState = atom({
    key: `history`,
    default: [] as string[],
});

export const layoutModeState = atom<LayoutMode>({
    key: `layoutMode`,
    default: LayoutMode.DEFAULT,
});
export const useLayoutMode = () => useRecoilState(layoutModeState);
export const useLayoutModeValue = () => useRecoilValue(layoutModeState);
export const useSetLayoutMode = () => useSetRecoilState(layoutModeState);

export const deviceOrientationState = atom({
    key: `deviceOrientationState`,
    default: `portrait`,
});
export const useDeviceOrientation = () => useRecoilState(deviceOrientationState);
export const useDeviceOrientationValue = () => useRecoilValue(deviceOrientationState);
export const useSetDeviceOrientation = () => useSetRecoilState(deviceOrientationState);
