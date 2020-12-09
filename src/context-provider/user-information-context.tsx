import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { UserInformation } from "../services/user/IUserInformationService";
import { setLocale, setUser } from "../store/reducers/session";
import { useHttpEndpoint } from "./region-select-context";
import { useServices } from "./services-provider";

// TODO (Axel): All of this context can be combined with the user-context from 
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

type Props = {
    children?: ReactChild | ReactChildren | null
}

type UserInformationActions = {
    refreshAuthenticationToken: () => void
    refreshUserInformation: () => void
}

type UserInformationContext = {
    loading: boolean,
    error: boolean,
    authenticated: boolean,
    information?: UserInformation,
    actions?: UserInformationActions
}

const UserInformationContext = createContext<UserInformationContext>({ loading: true, authenticated: false, error: false, information: undefined, actions: undefined });

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

const useAuthenticatedCheck = () => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);

    const { authenticationService } = useServices();

    const dispatch = useDispatch();

    const refresh = useCallback(async () => {
        if (!authenticationService) return;

        setAuthReady(false);
        setAuthError(false);

        const gotValidToken = await authenticationService.refresh();

        setAuthenticated(gotValidToken);
        setAuthReady(true);
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

            if (url.searchParams) {
                const languageCode = url.searchParams.get("iso");
                if (languageCode) {
                    dispatch(setLocale(languageCode))
                }

                const token = url.searchParams.get("token");
                if (token) {
                    authenticationService.transfer(token).then(() => {
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

    return { authReady, authError, authenticated, refresh };
}

export function UserInformationContextProvider({ children }: Props) {
    const dispatch = useDispatch();
    
    const [error, setError] = useState<boolean>(false);

    const [informationLoading, setInformationLoading] = useState<boolean>(false);
    const [information, setInformation] = useState<UserInformation>();

    const { authenticated, refresh, authReady } = useAuthenticatedCheck();

    const { userInformationService } = useServices();

    const fetchInformation = useCallback(() => {
        if (!userInformationService) return;
        if (informationLoading) return;

        setInformationLoading(true);
        userInformationService.me().then(userInformation => {
            dispatch(setUser(userInformation));
            setInformation(userInformation);
        }).catch(error => {
            console.error(error);
            setInformation(undefined);
            setError(true);
        }).finally(() => {
            setInformationLoading(false);
        })
        
    }, [userInformationService]);

    const context = useMemo<UserInformationContext>(() => {
        return { authenticated, loading: informationLoading || !authReady, error, information, actions: { refreshUserInformation: fetchInformation, refreshAuthenticationToken: refresh } }
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