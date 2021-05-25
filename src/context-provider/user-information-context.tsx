import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { UserInformation } from "../services/user/IUserInformationService";
import { setLocale, setRegion } from "../store/reducers/session";
import { useServices } from "./services-provider";

// TODO (Axel): All of this context can be combined with the user-context from 
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

type Props = {
    children?: ReactChild | ReactChildren | null
}

type UserInformationActions = {
    signOutUser: () => void
    refreshAuthenticationToken: () => void
    refreshUserInformation: () => Promise<void>
}

type UserInformationContext = {
    loading: boolean,
    error: boolean,
    authenticated: boolean,
    information?: UserInformation,
    actions?: UserInformationActions,
    myUsers: UserInformation[]
}

const UserInformationContext = createContext<UserInformationContext>({ loading: true, authenticated: false, error: false, information: undefined, actions: undefined, myUsers: [] });

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
    }, []);

    const signOut = useCallback(() => {
        if (!authenticationService) return;
        if (signedOut) return;

        authenticationService.signout().then(() => {
            setSignedOut(true);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setAuthenticated(false);
        });
    }, []);

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
    }, [authenticated]);

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
                    dispatch(setRegion(region))
                }

                const token = url.searchParams.get("token");
                if (token) {
                    authenticationService.transfer(token).then(() => {
                        setSignedOut(false);
                        refresh();
                    }).catch(err => {
                        console.error(err);
                        setAuthError(true);
                    });
                }
            }
        };

        (window as any).handleOpenURL = (url: string) => {
            // NOTE: Using setImmediate to prevent handleOpenURL from blocking app launch.
            setImmediate(() => openUrlHandler(url));
        };

        refresh();
    }, [])

    return { authReady, authError, authenticated, refresh, signOut };
}

export function UserInformationContextProvider({ children }: Props) {    
    const [error, setError] = useState<boolean>(false);

    const [informationLoading, setInformationLoading] = useState<boolean>(false);
    const [information, setInformation] = useState<UserInformation>();
    const [myUsers, setMyUsers] = useState<UserInformation[]>([]);

    const { authenticated, refresh, authReady, signOut } = useAuthentication();

    const { userInformationService } = useServices();

    const fetchInformation = useCallback(async () => {
        if (!userInformationService) return;
        if (informationLoading) return;

        setInformationLoading(true);

        try {
            const userInformation = await userInformationService.me();
            setInformation(userInformation);

            const myUsers = await userInformationService.getMyUsers();
            setMyUsers(myUsers);
        } catch(error) {
            console.error(error);
            setInformation(undefined);
            setMyUsers([]);
            setError(true);
        } finally {
            setInformationLoading(false);
        }
        
    }, [userInformationService]);

    const context = useMemo<UserInformationContext>(() => {
        return { authenticated, loading: informationLoading || !authReady, error, information, actions: { signOutUser: signOut, refreshUserInformation: fetchInformation, refreshAuthenticationToken: refresh }, myUsers }
    }, [information, informationLoading, authReady, error, fetchInformation, authenticated])

    useEffect(() => {
        if (authenticated) {
            fetchInformation();
        } else {
            setInformation(undefined);
        }
    }, [authenticated]);

    return (
        <UserInformationContext.Provider value={context}>
            {children}
        </UserInformationContext.Provider >
    )
}

export function useUserInformation() {
    return useContext(UserInformationContext);
}