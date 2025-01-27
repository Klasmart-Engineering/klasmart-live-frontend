import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import {
    useSetSelectedOrganization,
    useSetSelectedUser,
} from "@/app/data/user/atom";
import {
    authState,
    dialogsState,
    shouldShowNoOrgProfileState,
    shouldShowNoStudentRoleState,
} from "@/app/model/appModel";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";

export const useSignOut = () => {
    const setSelectedUser = useSetSelectedUser();
    const setSelectedOrganization = useSetSelectedOrganization();

    const { actions } = useAuthenticationContext();

    const setAuth = useSetRecoilState(authState);
    const setDialogs = useSetRecoilState(dialogsState);

    const setShouldShowNoOrgProfile = useSetRecoilState(shouldShowNoOrgProfileState);
    const setShouldShowNoStudentRole = useSetRecoilState(shouldShowNoStudentRoleState);

    const handleSignOut = useCallback(() => {
        setDialogs((state) => {
            return {
                ...state,
                isSelectUserOpen: false,
                isSelectOrganizationOpen: false,
                isShowNoOrgProfile: false,
                isShowNoStudentRole: false,
            };
        });

        setSelectedUser(() => undefined);
        setSelectedOrganization(() => undefined);
        setShouldShowNoOrgProfile(false);
        setShouldShowNoStudentRole(false);

        setAuth({
            transferToken: undefined,
        });

        actions?.signOut();
    }, [
        actions,
        setAuth,
        setDialogs,
        setSelectedOrganization,
        setSelectedUser,
    ]);

    return {
        signOut: handleSignOut,
    };
};
