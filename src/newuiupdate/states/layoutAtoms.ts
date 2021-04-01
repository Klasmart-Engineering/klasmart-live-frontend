import { atom } from 'recoil';

export const themeState = atom({
    key: 'themeState', 
    default: 'light', 
});

export const activeTabState = atom({
  key: 'activeTabState', 
  default: 'participants', 
});