import { HomeFunStudyFeedback } from "@/app/pages/schedule/home-fun-study/[scheduleId]";
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
    DEFAULT,
    CLASSROOM,
}

export const dialogsState = atom({
    key: `dialogs`,
    default: {
        isSelectOrganizationOpen: false,
        isSelectUserOpen: false,
        isParentalLockOpen: false,
        isShowNoOrgProfile: false,
        isShowNoStudentRole: false,
        isLiveClassDetailOpen: false,
        isStudyDetailOpen: false,
        isExternalNavigationOpen: false,
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
        regionId: process.env.IS_CORDOVA_BUILD ? `auth.kidsloop.live` : `env`,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

export const shouldClearCookieState = atom({
    key: `shouldClearCookie`,
    default: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const homeFunStudiesState = atom<HomeFunStudyFeedback[]>({
    key: `homeFunStudies`,
    default: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const shouldShowNoOrgProfileState = atom({
    key: `shouldShowNoOrgProfile`,
    default: false,
});

export const shouldShowNoStudentRoleState = atom({
    key: `shouldShowNoStudentRole`,
    default: false,
});

export const menuOpenState = atom({
    key: `menuOpenState`,
    default: false,
});

export const useMenuOpen = () => useRecoilState(menuOpenState);
export const useMenuOpenValue = () => useRecoilValue(menuOpenState);
export const useSetMenuOpen = () => useSetRecoilState(menuOpenState);

export const showedUpgradeDevicePopupState = atom({
    key: `showedUpgradeDevicePopup`,
    default: false,
    effects_UNSTABLE: [ persistAtom ],
});

export const isKeyboardVisibleState = atom({
    key: `isKeyboardVisible`,
    default: false,
});

export const isShowOnBoardingState = atom({
    key: `isShowOnBoardingState`,
    default: true,
});

export const isAppLoadedState = atom({
    key: `isAppLoaded`,
    default: false,
});

export const urlFilePathState = atom<string>({
    key: `urlFilePath`,
    default: ``,
});
