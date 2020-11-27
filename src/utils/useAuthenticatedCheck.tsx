import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocale } from "../store/reducers/session";
import { checkUserAuthenticated, transferToken } from "./accountUtils";

export const useAuthenticatedCheck = (cookiesReady: boolean) => {
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);

    const dispatch = useDispatch();

    const refresh = useCallback(() => {
        setAuthReady(false);
        setAuthError(false);

        checkUserAuthenticated()
            .then((auth) => {
                setAuthenticated(auth);
                setAuthReady(true);
            });
    }, []);

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