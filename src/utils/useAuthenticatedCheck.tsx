import { useCallback, useEffect, useState } from "react";
import { checkUserAuthenticated, refreshAuthenticationToken } from "./accountUtils";

// NOTE: Minutes * 60 * 1000
const TOKEN_REFRESH_TIMEOUT_MS = 10 * 60 * 1000;

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const refresh = useCallback(async () => {
        setAuthReady(false);

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

        refresh();
    }, [cookiesReady])

    return { authReady, authenticated, refresh };
}