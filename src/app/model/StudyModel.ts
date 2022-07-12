import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export enum StudyTopBarItem {
STUDY = `Study`,
ANYTIME = `Anytime`
}

export const StudyTopBarState = atom({
    key: `studyTopBarState`,
    default: StudyTopBarItem.STUDY,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const useStudyTopBar = () => useRecoilState(StudyTopBarState);
export const useStudyTopBarValue = () => useRecoilValue(StudyTopBarState);
export const useSetStudyTopBar = () => useSetRecoilState(StudyTopBarState);
