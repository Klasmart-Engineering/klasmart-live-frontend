import { InteractiveMode } from "@/pages/utils";
import { atom } from "recoil";

// THEME
type themeStateType = "light" | "dark" | "student";
export const themeState = atom<themeStateType>({
    key: `themeState`,
    default: `light`,
});

// LAYOUT
type activeTabStateType = "participants" | "mosaic" | "settings";
export const activeTabState = atom({
    key: `activeTabState`,
    default: `participants`,
});

type activeSettingsTabStateType = "schedule" | "settings" | "toolbar" | "record";
export const activeSettingsStateTab = atom({
    key: `activeSettingsStateTab`,
    default: `settings`,
});

export const isClassDetailsOpenState = atom<boolean>({
    key: `isClassDetailsOpenState`,
    default: false,
});

export const isCanvasOpenState = atom<boolean>({
    key: `isCanvasOpenState`,
    default: false,
});

export const isGlobalActionsOpenState = atom<boolean>({
    key: `isGlobalActionsOpenState`,
    default: false,
});

export const isViewModesOpenState = atom<boolean>({
    key: `isViewModesOpenState`,
    default: false,
});

export const isLessonPlanOpenState = atom<boolean>({
    key: `isLessonPlanOpenState`,
    default: false,
});

export const isChatOpenState = atom<boolean>({
    key: `isChatOpenState`,
    default: false,
});

export const classLeftState = atom({
    key: `classLeftState`,
    default: false,
});

export const classEndedState = atom({
    key: `classEndedState`,
    default: false,
});

export const unreadMessagesState = atom({
    key: `unreadMessagesState`,
    default: 0,
});

// GLOBAL ACTIONS
export const isActiveGlobalScreenshareState = atom({
    key: `isActiveGlobalScreenshareState`,
    default: false,
});
export const isActiveGlobalCanvasState = atom({
    key: `isActiveGlobalCanvasState`,
    default: false,
});
export const isActiveGlobalMuteAudioState = atom<boolean>({
    key: `isActiveGlobalMuteAudioState`,
    default: false,
});
export const isActiveGlobalMuteVideoState = atom<boolean>({
    key: `isActiveGlobalMuteVideoState`,
    default: false,
});

export const interactiveModeState = atom<InteractiveMode>({
    key: `interactiveModeState`,
    default: InteractiveMode.ONSTAGE,
});

export const streamIdState = atom({
    key: `streamIdState`,
    default: ``,
});

// LAYOUT - ACTIVITTY
export const pinnedUserState = atom<number | undefined>({
    key: `pinnedUserState`,
    default: undefined,
});

export const materialActiveIndexState = atom<number>({
    key: `materialActiveIndexState`,
    default: 0,
});

export const mosaicViewSizeState = atom<number|string|Array<number|string>>({
    key: `mosaicViewSizeState`,
    default: 4,
});

export const hasControlsState = atom({
    key: `hasControlsState`,
    default: false,
});

export const studyRecommandUrlState = atom({
    key: `studyRecommandUrlState`,
    default: ``,
});

export const showEndStudyState = atom({
    key: `showEndStudyState`,
    default: false,
});

export const hasJoinedClassroomState = atom({
    key: `hasJoinedClassroomState`,
    default: false,
});

export const isShowContentLoadingState = atom({
    key: `isShowContentLoadingState`,
    default: false,
});

export const observeWarningState = atom({
    key: `observeWarningState`,
    default: false,
});

export const observeContentState = atom({
    key: `observeContentState`,
    default: false,
});

export const observeDisableState = atom({
    key: `observeDisableState`,
    default: false,
});

export interface Participant {
    id: string;
    name: string;
    isAbsent: boolean;
}

export interface ClassInformation {
    class_name: string;
    lesson_name: string;
    room_id: string;
    class_type: string;
    teachers: Participant[];
    students: Participant[];
    program: string;
    subject: string;
    lesson_plan: string;
    materials: number;
    start_at: string;
    end_at: string;
}

export const classInfoState = atom<ClassInformation>({
    key: `classInfoState`,
    default: {
        class_name: ``,
        lesson_name: ``,
        room_id: ``,
        class_type: ``,
        teachers: [],
        students: [],
        program: ``,
        subject: ``,
        lesson_plan: ``,
        materials: 0,
        start_at: ``,
        end_at: ``,
    },
});
