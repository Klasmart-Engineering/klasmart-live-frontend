import { ReadOrganizationDto } from "./dto/readOrganizationDto";
import { ReadUserDto } from "./dto/readUserDto";
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const selectedUserAtom = atom<ReadUserDto | undefined>({
    key: `selectedUser`,
    default: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

const selectedOrganizationAtom = atom<ReadOrganizationDto | undefined>({
    key: `selectedOrganization`,
    default: undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    effects_UNSTABLE: [ persistAtom ],
});

export const useSelectedUser = () => useRecoilState(selectedUserAtom);
export const useSelectedUserValue = () => useRecoilValue(selectedUserAtom);
export const useSetSelectedUser = () => useSetRecoilState(selectedUserAtom);

export const useSelectedOrganization = () => useRecoilState(selectedOrganizationAtom);
export const useSelectedOrganizationValue = () => useRecoilValue(selectedOrganizationAtom);
export const useSetSelectedOrganization = () => useSetRecoilState(selectedOrganizationAtom);
