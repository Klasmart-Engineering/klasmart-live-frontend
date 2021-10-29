import {
    authState,
    localeState,
    selectedRegionState,
} from "../model/appModel";
import { useServices } from "./services-provider";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRecoilState } from "recoil";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

type AuthenticationActions = {
    signOut: () => void;
    refreshAuthenticationToken: () => void;
}

type AuthenticationContext = {
    loading: boolean;
    error: boolean;
    authenticated: boolean;
    actions?: AuthenticationActions;
}

const AuthenticationContext = createContext<AuthenticationContext>({
    loading: true,
    authenticated: false,
    error: false,
    actions: undefined,
});

export function isRoleTeacher (role: string) {
    const teacherRoleNames = [
        `Organization Admin`,
        `School Admin`,
        `Teacher`,
    ].map(v => v.toLowerCase());

    return teacherRoleNames.includes(role.toLowerCase());
}

// NOTE: Minutes * 60 * 1000
const TOKEN_REFRESH_TIMEOUT_MS = 10 * 60 * 1000;

const useAuthentication = () => {
    const [ authReady, setAuthReady ] = useState<boolean>(false);
    const [ authenticated, setAuthenticated ] = useState<boolean>(false);
    const [ authError, setAuthError ] = useState<boolean>(false);
    const [ signedOut, setSignedOut ] = useState<boolean>(false);

    const { authenticationService } = useServices();

    const [ auth, setAuth ] = useRecoilState(authState);
    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);
    const [ locale, setLocale ] = useRecoilState(localeState);

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
            });
    }, [ authenticationService ]);

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
        if (!authenticationService) return Promise.reject<void>(`No authentication service.`);
        if (!authenticated) return Promise.reject<void>(`Not signed in`);

        await authenticationService.switchUser(userId);
    }, [ authenticationService, authenticated ]);

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
        };
    }, [ authenticated, authenticationService ]);

    useEffect(() => {
        if (!authenticationService) return;
        if (!auth.transferToken) return;

        authenticationService.transfer(auth.transferToken).then(() => {
            setSignedOut(false);
            refresh();
        }).catch(err => {
            console.error(err);
            setAuthError(true);
        });

        setAuth({
            ...auth,
            transferToken: undefined,
        });
    }, [ authenticationService, auth ]);

    useEffect(() => {
        if (!authenticationService) return;

        const openUrlHandler = (urlString: string) => {
            const url = new URL(urlString);

            const cordova = (window as any).cordova;
            if (cordova) {
                cordova.plugins.browsertab.close();
            }

            if (url.searchParams) {

                const languageCode = url.searchParams.get(`iso`);
                if (languageCode) {
                    setLocale({
                        ...locale,
                        languageCode,
                    });
                }

                const region = url.searchParams.get(`region`);
                if (region) {
                    setSelectedRegion({
                        ...selectedRegion,
                        regionId: region,
                    });
                }

                const token = url.searchParams.get(`token`);
                if(token){
                    setAuth({
                        ...auth,
                        transferToken: token,
                    });
                }

            }
        };

        (window as any).handleOpenURL = (url: string) => {
            // NOTE: Using setTimeout to prevent handleOpenURL from blocking app launch.
            setTimeout(() => openUrlHandler(url), 0);
        };

        refresh();
    }, []);

    return {
        authReady,
        authError,
        authenticated,
        refresh,
        signOut,
        switchUser,
    };
};

export function AuthenticationContextProvider ({ children }: Props) {

    const {
        authenticated,
        refresh,
        authReady,
        authError,
        signOut,
    } = useAuthentication();

    const context = useMemo<AuthenticationContext>(() => {
        return {
            authenticated,
            loading: !authReady,
            error: authError,
            actions: {
                signOut,
                refreshAuthenticationToken: refresh,
            },
        };
    }, [ authReady, authenticated ]);

    return (
        <AuthenticationContext.Provider value={context}>
            {children}
        </AuthenticationContext.Provider >
    );
}

export function useAuthenticationContext () {
    return useContext(AuthenticationContext);
}
