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
type viewModeStateType = "onstage" | "observe" | "present";
export const viewModeState = atom<viewModeStateType>({
	key: "viewModeState",
	default: "onstage",
});


export const pinnedUserState = atom<number | undefined>({
	key: "pinnedUserState",
	default: undefined,
});

export const materialActiveIndexState = atom<number>({
	key: "materialActiveIndexState",
	default: 0,
});

export const mosaicViewSizeState = atom<number>({
	key: "mosaicViewSizeState",
	default: 4,
});


// TEMPORARY, TO DELETE WHEN REAL DATA
export const usersState = atom({
	key: "usersState",
	default: [{
		id: 1,
		name: 'The Teach',
		role: 'teacher',
		hasControls: true,
		hasVideo: true,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 2,
		name: 'The second Teach',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 3,
		name: 'The first student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 4,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 5,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 7,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 8,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 9,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 10,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 41,
		name: 'The second student long name',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 42,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 43,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 44,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 45,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 49,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 455,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
	},
	{
		id: 422,
		name: 'The second student',
		role: 'student',
		hasControls: false,
		hasVideo: false,
		hasAudio: true,
		isSelfAudioMuted : false,
		isSelfVideoMuted : false,
		isTeacherAudioMuted : false,
		isTeacherVideoMuted : false,
		isPinned: false,
		isSpeaking : false
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


export const usersStateTest = atom({
	key: "usersStateTest",
	default: [{
		"user1":{
			name: 'The Teach',
			role: 'teacher',
			hasControls: true,
			hasVideo: true,
			hasAudio: true,
			isSelfAudioMuted : false,
			isSelfVideoMuted : false,
			isTeacherAudioMuted : false,
			isTeacherVideoMuted : false,
			isSpeaking : false
		},"user2":{
			name: 'The Student',
			role: 'teacher',
			hasControls: true,
			hasVideo: true,
			hasAudio: true,
			isSelfAudioMuted : false,
			isSelfVideoMuted : false,
			isTeacherAudioMuted : false,
			isTeacherVideoMuted : false,
			isSpeaking : false
		},
	}]
})