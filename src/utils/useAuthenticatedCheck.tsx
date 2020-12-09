import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useServices } from "../context-provider/services-provider";
import { setLocale } from "../store/reducers/session";

// NOTE: Minutes * 60 * 1000
const TOKEN_REFRESH_TIMEOUT_MS = 10 * 60 * 1000;

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
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
        if (!cookiesReady) return;
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
    }, [cookiesReady])

    return { authReady, authError, authenticated, refresh };
}