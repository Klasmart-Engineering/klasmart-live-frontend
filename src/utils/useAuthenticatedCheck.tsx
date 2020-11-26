import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocale } from "../store/reducers/session";
import { checkUserAuthenticated, refreshAuthenticationToken, transferToken } from "./accountUtils";

// NOTE: Minutes * 60 * 1000
const TOKEN_REFRESH_TIMEOUT_MS = 10 * 60 * 1000;

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);

    const dispatch = useDispatch();

    const refresh = useCallback(async () => {
        setAuthReady(false);
        setAuthError(false);

        const gotValidToken = await refreshAuthenticationToken();
        if (!gotValidToken) {
            setAuthenticated(false);
            setAuthReady(true);
            return;
        }

        const gotValidUser = await checkUserAuthenticated();
        setAuthenticated(gotValidUser);
        setAuthReady(true);
    }, []);

    useEffect(() => {
        if (!authenticated) return;

        const repeatedTokenRefresh = setInterval(() => {
            refreshAuthenticationToken()
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

        const openUrlHandler = (urlString: string) => {
            const url = new URL(urlString);

            if (url.searchParams) {
                const languageCode = url.searchParams.get("iso");
                if (languageCode) {
                    dispatch(setLocale(languageCode))
                }

                const token = url.searchParams.get("token");
                if (token) {
                    transferToken(token).then(() => {
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