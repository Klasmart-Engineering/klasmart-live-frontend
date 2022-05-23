import {
    authState,
    isAuthenticatedStorage,
    isShowOnBoardingState,
    localeState,
    selectedRegionState,
    shouldClearCookieState,
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
import { useRecoilState, useSetRecoilState } from "recoil";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

type AuthenticationActions = {
    signOut: () => Promise<void>;
    refreshAuthenticationToken: () => Promise<void>;
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

const useAuthentication = () => {
    const [ authReady, setAuthReady ] = useState<boolean>(false);
    const [ authenticated, setAuthenticated ] = useState<boolean>(false);
    const [ authError, setAuthError ] = useState<boolean>(false);
    const [ signedOut, setSignedOut ] = useState<boolean>(false);
    const setIsAuthenticatedStorage = useSetRecoilState(isAuthenticatedStorage);

    const { authenticationService } = useServices();

    const [ auth, setAuth ] = useRecoilState(authState);
    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);
    const [ locale, setLocale ] = useRecoilState(localeState);
    const [ shouldClearCookie, setShouldClearCookie ] = useRecoilState(shouldClearCookieState);
    const setIsShowOnBoarding = useSetRecoilState(isShowOnBoardingState);

    const refresh = useCallback(async (force?: boolean) => {
        if (!authenticationService) return;
        if (signedOut && !force) return;

        setAuthReady(false);
        setAuthError(false);

        if (shouldClearCookie) {
            setAuthenticated(false);
            setIsAuthenticatedStorage(false);
            setAuthReady(true);
            return;
        }

        await authenticationService.refresh()
            .then(ok => {
                setAuthenticated(ok);
                setIsAuthenticatedStorage(ok);
                const cookiesSync = (window as any).cookiesSync;
                if(cookiesSync) {
                    cookiesSync.sync();
                }
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setAuthReady(true);
            });
    }, [
        authenticationService,
        signedOut,
        shouldClearCookie,
    ]);

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
            setIsAuthenticatedStorage(false);
        }
    }, []);

    const switchUser = useCallback(async (userId: string) => {
        if (!authenticationService) return Promise.reject<void>(`No authentication service.`);
        if (!authenticated) return Promise.reject<void>(`Not signed in`);

        await authenticationService.switchUser(userId);
    }, [ authenticationService, authenticated ]);

    useEffect(() => {
        if (!authenticationService) return;
        if (!auth.transferToken) return;

        authenticationService.transfer(auth.transferToken).then(() => {
            setIsShowOnBoarding(false);
            setSignedOut(false);
            refresh(true);
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
        const openUrlHandler = (urlString: string) => {
            const url = new URL(urlString);

            const cordova = (window as any).cordova;
            if (cordova) {
                cordova.plugins.browsertab.close();
            }

            //Set this flag to false to receive response from authenticationService.refresh()
            setShouldClearCookie(false);

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
        };

        (window as any).handleOpenURL = (url: string) => {
            // NOTE: Using setTimeout to prevent handleOpenURL from blocking app launch.
            setTimeout(() => openUrlHandler(url), 0);
        };
    }, [
        selectedRegion,
        auth,
        locale,
    ]);

    useEffect(() => {
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
    }, [
        authReady,
        authenticated,
        authError,
    ]);

    return (
        <AuthenticationContext.Provider value={context}>
            {children}
        </AuthenticationContext.Provider >
    );
}

export function useAuthenticationContext () {
    return useContext(AuthenticationContext);
}
