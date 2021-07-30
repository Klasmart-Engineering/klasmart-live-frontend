import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserInformation } from "../services/user/IUserInformationService";
import { setLocale, setRegionId, setSelectedOrg, setSelectedUserId, setTransferToken } from "../store/reducers/session";
import { State } from "../store/store";
import { useServices } from "./services-provider";

// TODO (Axel): All of this context can be combined with the user-context from
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

type Props = {
    children?: ReactChild | ReactChildren | null
}

type UserInformationActions = {
    selectUser: (userId: string) => Promise<void>
    signOutUser: () => Promise<void>
    refreshAuthenticationToken: () => void
    refreshUserInformation: () => Promise<void>
}

type UserInformationContext = {
    loading: boolean,
    error: boolean,
    authenticated: boolean,
    isSelectingUser: boolean,
    selectedUserProfile?: UserInformation,
    actions?: UserInformationActions,
    myUsers?: UserInformation[]
}

const UserInformationContext = createContext<UserInformationContext>({ loading: true, authenticated: false, error: false, isSelectingUser: false, selectedUserProfile: undefined, actions: undefined, myUsers: [] });

export function isRoleTeacher(role: string) {
    const teacherRoleNames = [
        "Organization Admin",
        "School Admin",
        "Teacher",
    ].map(v => v.toLowerCase());

    return teacherRoleNames.includes(role.toLowerCase());
}

// NOTE: Minutes * 60 * 1000
const TOKEN_REFRESH_TIMEOUT_MS = 10 * 60 * 1000;

const useAuthentication = () => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);
    const [signedOut, setSignedOut] = useState<boolean>(false);

    const { authenticationService } = useServices();

    const tokenFromAuth = useSelector((state: State) => state.session.transferToken);

    const dispatch = useDispatch();

    const refresh = useCallback(() => {
        if (!authenticationService) return;
        if (signedOut) return;

        setAuthReady(false);
        setAuthError(false);

        authenticationService.refresh()
            .then(ok => {
                setAuthenticated(ok);
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setAuthReady(true);
            })
    }, [authenticationService]);

    const signOut = useCallback(async () => {
        if (!authenticationService) return;
        if (signedOut) return;

        try {
            await authenticationService.signout();
            setSignedOut(true);
        } catch (error) {
            console.error(error);
        } finally {
            setAuthenticated(false);
        }
    }, []);

    const switchUser = useCallback(async (userId: string) => {
        if (!authenticationService) return Promise.reject<void>("No authentication service.");
        if (!authenticated) return Promise.reject<void>("Not signed in");

        await authenticationService.switchUser(userId);
    }, [authenticationService, authenticated]);

    useEffect(() => {
        if (!authenticated) return;
        if (!authenticationService) return;

        const repeatedTokenRefresh = setInterval(() => {
            authenticationService.refresh()
                .then((authenticated) => {
                    if (!authenticated) {
                        setAuthenticated(false);
                    }
                });
        }, TOKEN_REFRESH_TIMEOUT_MS);

        return () => {
            clearInterval(repeatedTokenRefresh);
        }
    }, [authenticated, authenticationService]);

    useEffect(() => {
        if (!authenticationService) return;
        if (!tokenFromAuth) return;

        authenticationService.transfer(tokenFromAuth).then(() => {
            console.log("transfer successful");
            setSignedOut(false);
            refresh();
        }).catch(err => {
            console.error(err);
            setAuthError(true);
        });

        dispatch(setTransferToken(undefined))

    }, [authenticationService, tokenFromAuth]);

    useEffect(() => {
        if (!authenticationService) return;

        const openUrlHandler = (urlString: string) => {
            const url = new URL(urlString);

            const cordova = (window as any).cordova;
            if (cordova) {
                cordova.plugins.browsertab.close();
            }

            if (url.searchParams) {

                const languageCode = url.searchParams.get("iso");
                if (languageCode) {
                    dispatch(setLocale(languageCode))
                }

                const region = url.searchParams.get("region");
                if (region) {
                    dispatch(setRegionId(region))
                }

                const token = url.searchParams.get("token");
                if(token){
                    dispatch(setTransferToken(token))
                }

            }
        };

        (window as any).handleOpenURL = (url: string) => {
            // NOTE: Using setImmediate to prevent handleOpenURL from blocking app launch.
            setImmediate(() => openUrlHandler(url));
        };

        refresh();
    }, [])

    return { authReady, authError, authenticated, refresh, signOut, switchUser };
}

export function UserInformationContextProvider({ children }: Props) {
    const dispatch = useDispatch();

    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSelectingUser, setIsSelectingUser] = useState<boolean>(false);

    const selectedUserId = useSelector((state: State) => state.session.selectedUserId);
    const [selectedUserProfile, setSelectedUserProfile] = useState<UserInformation>();
    const [myUsers, setMyUsers] = useState<UserInformation[]>();

    const { authenticated, refresh, authReady, signOut, switchUser } = useAuthentication();

    const { userInformationService } = useServices();

    const fetchMyUsers = useCallback(async () => {
        if (!userInformationService) return;
        if (loading) return;

        setLoading(true);

        try {
            const myUsers = await userInformationService.getMyUsers();
            setMyUsers(myUsers);
        } catch (error) {
            console.error(error);
            setSelectedUserProfile(undefined);
            setMyUsers(undefined);
            setError(true);
        } finally {
            setLoading(false);
        }

    }, [userInformationService]);

    const fetchSelectedUser = useCallback(async () => {
        if (!userInformationService) return;
        if (loading) return;

        setLoading(true);

        try {
            const selectedUser = await userInformationService.me();
            setSelectedUserProfile(selectedUser);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [userInformationService]);

    const selectUser = useCallback(async (userId: string) => {
        try {
            setIsSelectingUser(true);
            await switchUser(userId);

            dispatch(setSelectedUserId(userId));
            dispatch(setSelectedOrg(undefined));

            await fetchSelectedUser();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSelectingUser(false);
        }

    }, [switchUser, fetchSelectedUser]);

    const logOutUser = useCallback(async () => {
        await signOut();
        setSelectedUserProfile(undefined);
        setSelectedUserId(undefined);
        setMyUsers(undefined);
    }, [signOut]);

    const context = useMemo<UserInformationContext>(() => {
        return { authenticated, loading: loading || !authReady, error, isSelectingUser, selectedUserProfile, actions: { signOutUser: logOutUser, refreshUserInformation: fetchMyUsers, refreshAuthenticationToken: refresh, selectUser }, myUsers }
    }, [selectedUserProfile, loading, authReady, error, fetchMyUsers, authenticated, isSelectingUser, myUsers])

    useEffect(() => {
        if (authenticated) {
            fetchMyUsers();
        } else {
            setMyUsers(undefined);
            setSelectedUserProfile(undefined);
        }
    }, [authenticated]);

    useEffect(() => {
        console.log(`auth: ${authenticated}, selectedId: ${selectedUserId}, user: ${selectedUserProfile?.id}`);
        if (authenticated && selectedUserId !== undefined && selectedUserProfile?.id != selectedUserId) {
            console.log(`selecting user: ${selectedUserId}`);
            selectUser(selectedUserId).catch(error => {
                console.log(`select user error: ${error}`);
                dispatch(setSelectedUserId(undefined));
            });
        }
    }, [selectedUserId, authenticated, selectedUserProfile]);

    return (
        <UserInformationContext.Provider value={context}>
            {children}
        </UserInformationContext.Provider >
    )
}

export function useUserInformation() {
    return useContext(UserInformationContext);
}
