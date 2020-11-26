import { useCallback, useEffect, useState } from "react";
import { checkUserAuthenticated } from "./accountUtils";

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const refresh = useCallback(() => {
        setAuthReady(false);

        checkUserAuthenticated()
            .then((auth) => {
                setAuthenticated(auth);
                setAuthReady(true);
            });
    }, []);

    useEffect(() => {
        if (!cookiesReady) return;

        const openUrlHandler = (url: URL) => {
            console.log(`openUrlHandler: ${url}`);

            if (url.searchParams) {
                const languageCode = url.searchParams.get("iso");
                if (languageCode) {
                    // TODO: Set the language code redux state.
                }

                const token = url.searchParams.get("token");
                if (token) {
                    // TODO: Set the necessary cookies and continue to refresh.
                }
            }

            refresh();
        };

        (window as any).handleOpenURL = (url: URL) => {
            // NOTE: Using setImmediate to prevent handleOpenURL from blocking app launch.
            setImmediate(() => openUrlHandler(url));
        };

        refresh();
    }, [cookiesReady])

    return { authReady, authenticated, refresh };
}