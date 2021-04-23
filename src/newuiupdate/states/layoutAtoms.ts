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
    default: `schedule`,
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

export const isPinUserOpenState = atom<boolean>({
    key: `isPinUserOpenState`,
    default: false,
});

export const isChatOpenState = atom<boolean>({
    key: `isChatOpenState`,
    default: false,
});

// TODO : USE GQL MUTATION FOR THIS
export const classEndedState = atom({
    key: `classEndedState`,
    default: false,
});

export const classLeftState = atom({
    key: `classLeftState`,
    default: false,
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
export const isActiveGlobalMuteAudioState = atom({
    key: `isActiveGlobalMuteAudioState`,
    default: false,
});
export const isActiveGlobalMuteVideoState = atom({
    key: `isActiveGlobalMuteVideoState`,
    default: false,
});

// VIEW MODES
type viewModeStateType = "onstage" | "observe" | "present";
export const viewModeState = atom<viewModeStateType>({
    key: `viewModeState`,
    default: `onstage`,
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

// TEMPORARY, TO DELETE WHEN REAL DATA
export const classInfoState = atom({
    key: `classInfoState`,
    default: {
        class_id: 4,
        class_name: `Class Name`,
        lesson_name: `Animals`,
        room_id: `AD01`,
        class_type: `online`,
        enrolled_participants: `16 students, 1teacher`,
        program: `Badanamu ESL`,
        subject: `Language / Literacy`,
        materials: [
            {
                id: `1`,
                name: `Step 1 Colors`,
            },
            {
                id: `2`,
                name: `Step 2 Animals`,
            },
            {
                id: `3`,
                name: `Step 3 Scientology`,
            },
        ],
        start_at: `2021/03/03, 09:00 am`,
        end_at: `2021/03/03, 10:00 am`,
    },
});

export const userState = atom({
    key: `userState`,
    default: {
        id: 4,
        name: `The second student`,
        role: `student`,
        hasControls: true,
        hasVideo: false,
        hasAudio: true,
        isSelfAudioMuted : false,
        isSelfVideoMuted : false,
        isTeacherAudioMuted : false,
        isTeacherVideoMuted : true,
        isPinned: false,
        isSpeaking : false,
    },
});

export const usersState = atom({
    key: `usersState`,
    default: [
        {
            id: 1,
            name: `The Teach`,
            role: `teacher`,
            hasControls: true,
            hasVideo: true,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 3,
            name: `The first student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 4,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : true,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 5,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 7,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 8,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 9,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 10,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: false,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 41,
            name: `The second student long name`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 42,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 43,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 44,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: false,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 45,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 49,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: true,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 455,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: false,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        {
            id: 422,
            name: `The second student`,
            role: `student`,
            hasControls: false,
            hasVideo: false,
            hasAudio: false,
            isSelfAudioMuted : false,
            isSelfVideoMuted : false,
            isTeacherAudioMuted : false,
            isTeacherVideoMuted : false,
            isPinned: false,
            isSpeaking : false,
        },
        // {
        // 	id: 4353,
        // 	name: 'The second student',
        // 	role: 'student',
        // 	hasControls: false,
        // 	hasVideo: false,
        // 	hasAudio: true,
        // 	isSelfAudioMuted : false,
        // 	isSelfVideoMuted : false,
        // 	isTeacherAudioMuted : false,
        // 	isTeacherVideoMuted : false,
        // 	isPinned: false,
        // 	isSpeaking : false
        // },
        // {
        // 	id: 43535,
        // 	name: 'The second student',
        // 	role: 'student',
        // 	hasControls: false,
        // 	hasVideo: false,
        // 	hasAudio: true,
        // 	isSelfAudioMuted : false,
        // 	isSelfVideoMuted : false,
        // 	isTeacherAudioMuted : false,
        // 	isTeacherVideoMuted : false,
        // 	isPinned: false,
        // 	isSpeaking : false
        // },
        // {
        // 	id: 435353333,
        // 	name: 'The second student',
        // 	role: 'student',
        // 	hasControls: false,
        // 	hasVideo: false,
        // 	hasAudio: true,
        // 	isSelfAudioMuted : false,
        // 	isSelfVideoMuted : false,
        // 	isTeacherAudioMuted : false,
        // 	isTeacherVideoMuted : false,
        // 	isPinned: false,
        // 	isSpeaking : false
        // },
        // {
        // 	id: 425225,
        // 	name: 'The second student',
        // 	role: 'student',
        // 	hasControls: false,
        // 	hasVideo: false,
        // 	hasAudio: true,
        // 	isSelfAudioMuted : false,
        // 	isSelfVideoMuted : false,
        // 	isTeacherAudioMuted : false,
        // 	isTeacherVideoMuted : false,
        // 	isPinned: false,
        // 	isSpeaking : false
        // },
        // {
        // 	id: 4522522,
        // 	name: 'The second student',
        // 	role: 'student',
        // 	hasControls: false,
        // 	hasVideo: false,
        // 	hasAudio: true,
        // 	isSelfAudioMuted : false,
        // 	isSelfVideoMuted : false,
        // 	isTeacherAudioMuted : false,
        // 	isTeacherVideoMuted : false,
        // 	isPinned: false,
        // 	isSpeaking : false
        // }
    ],
});
