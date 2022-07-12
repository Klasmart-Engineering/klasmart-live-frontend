import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export enum ScheduleAppBarItem {
    LIVE = `live`,
    STUDY = `study`,
    HOME_FUN_STUDY = `home_fun_study`
}

export const scheduleAppBarState = atom({
    key: `scheduleTab`,
    default: ``,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const useScheduleTab = () => useRecoilState(scheduleAppBarState);
export const useScheduleTabValue = () => useRecoilValue(scheduleAppBarState);
export const useSetScheduleTab = () => useSetRecoilState(scheduleAppBarState);
