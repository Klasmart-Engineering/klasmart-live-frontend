import { useCallback, useEffect, useState } from "react";
import { checkUserAuthenticated } from "./accountUtils";

export const useAuthenticatedCheck = () => {
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
        refresh();
    }, [])

    return { authReady, authenticated, refresh };
}