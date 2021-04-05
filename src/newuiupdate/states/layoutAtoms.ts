import { atom } from "recoil";

// THEME
type themeStateType = "light" | "dark" | "student";
export const themeState = atom<themeStateType>({
	key: "themeState",
	default: "light",
});

// LAYOUT
export const activeTabState = atom({
	key: "activeTabState",
	default: "participants",
});

export const isClassDetailsOpenState = atom({
	key: "isClassDetailsOpenState",
	default: false,
});

export const isCanvasOpenState = atom({
	key: "isCanvasOpenState",
	default: false,
});

export const isGlobalActionsOpenState = atom({
	key: "isGlobalActionsOpenState",
	default: false,
});

export const isViewModesOpenState = atom({
	key: "isViewModesOpenState",
	default: false,
});

export const isLessonPlanOpenState = atom({
	key: "isLessonPlanOpenState",
	default: false,
});

export const isPinUserOpenState = atom({
	key: "isPinUserOpenState",
	default: false,
});

export const isChatOpenState = atom({
	key: "isChatOpenState",
	default: false,
});

export const activeMicrophoneState = atom({
	key: "activeMicrophoneState",
	default: true,
});

export const activeCameraState = atom({
	key: "activeCameraState",
	default: true,
});

// GLOBAL ACTIONS
export const isActiveGlobalScreenshareState = atom({
	key: "isActiveGlobalScreenshareState",
	default: false,
});
export const isActiveGlobalCanvasState = atom({
	key: "isActiveGlobalCanvasState",
	default: false,
});
export const isActiveGlobalMuteAudioState = atom({
	key: "isActiveGlobalMuteAudioState",
	default: false,
});
export const isActiveGlobalMuteVideoState = atom({
	key: "isActiveGlobalMuteVideoState",
	default: false,
});

// VIEW MODES
type viewModeStateType = "onstage" | "observer" | "present";
export const viewModeState = atom<viewModeStateType>({
	key: "viewModeState",
	default: "onstage",
});
