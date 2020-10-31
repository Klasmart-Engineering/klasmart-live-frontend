import { useCallback, useEffect, useState } from "react";
import { checkUserAuthenticated } from "./accountUtils";

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const refresh = useCallback(() => {
        setAuthReady(false);

        checkUserAuthenticated()
            .then((auth) => {
                setAuthReady(true);
                setAuthenticated(auth);
            });
    }, []);

    useEffect(() => {
        if (!cookiesReady) return;

        refresh();
    }, [cookiesReady])

    return { authReady, authenticated, refresh };
}