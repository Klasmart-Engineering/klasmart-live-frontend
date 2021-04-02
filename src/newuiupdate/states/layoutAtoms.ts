import { atom } from 'recoil';

export const themeState = atom({
    key: 'themeState', 
    default: 'light', 
});

export const activeTabState = atom({
  key: 'activeTabState', 
  default: 'participants', 
});

export const activeMicrophoneState = atom({
  key: 'activeMicrophoneState', 
  default: true, 
});

export const activeCameraState = atom({
  key: 'activeCameraState', 
  default: true, 
});

export const isChatOpenState = atom({
  key: 'isChatOpenState', 
  default: false, 
});

export const isPinUserOpenState = atom({
  key: 'isPinUserOpenState', 
  default: false, 
});

export const isLessonMaterialOpenState = atom({
  key: 'isLessonMaterialOpenState', 
  default: false, 
});

export const isGlobalActionsOpenState = atom({
  key: 'isGlobalActionsOpenState', 
  default: false, 
});

export const isCanvasOpenState = atom({
  key: 'isCanvasOpenState', 
  default: false, 
});

export const isClassDetailsOpenState = atom({
  key: 'isClassDetailsOpenState', 
  default: false, 
});
