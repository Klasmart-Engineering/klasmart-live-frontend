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

    const { authenticationService } = useServices();

    const [ auth, setAuth ] = useRecoilState(authState);
    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);
    const [ locale, setLocale ] = useRecoilState(localeState);

    const refresh = useCallback(async () => {
        if (!authenticationService) return;
        if (signedOut) return;

        setAuthReady(false);
        setAuthError(false);

        await authenticationService.refresh()
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
