import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export enum HomeFunAppBarItem {
HOME_ACTIVITY = `Home Activity`,
ANYTIME = `Anytime`
}

export const HomeFunTopBarState = atom({
    key: `homeFunTopBarState`,
    default: HomeFunAppBarItem.HOME_ACTIVITY,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const useHomeFunTopBar = () => useRecoilState(HomeFunTopBarState);
export const useHomeFunTopBarValue = () => useRecoilValue(HomeFunTopBarState);
export const useSetHomeFunTopBar = () => useSetRecoilState(HomeFunTopBarState);
