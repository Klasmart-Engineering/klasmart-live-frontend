import { useCallback, useEffect, useMemo } from "react";
import { localeCodes, fallbackLocale, getIntl } from "../localization/localeCodes";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setLocale } from "../store/reducers/session";
import { State } from "../store/store";

const localeCache = new Map<string, ReturnType<typeof getIntl>>();

function storeLanguageLocaleCookie(languageCode: string) {
    Cookies.set("locale", languageCode, { path: "/", domain: ".kidsloop.net" });
}

export function useLocaleLanguage() {
    const dispatch = useDispatch();
    const languageCode = useSelector((state: State) => state.session.locale);

    const language = useMemo(() => {
        return getLanguage(languageCode);
    }, [languageCode])

    useEffect(() => {
        storeLanguageLocaleCookie(languageCode);
    }, [languageCode]);

    const languageFromCookieLocale = useCallback((excplicitLanguageCode?: string) => {
        const selectedLanguageCode = excplicitLanguageCode ?? Cookies.get("locale") ?? languageCode;
        dispatch(setLocale(selectedLanguageCode))
    }, []);

    return { language, languageCode, languageFromCookieLocale };
}

export function getLanguage(languageCode: string) {
    let language = localeCache.get(languageCode);
    if (language !== undefined) { return language; }
    language = getIntl(languageCode);
    localeCache.set(languageCode, language);
    if (language !== undefined) { return language; }
    return fallbackLocale;
}

// It's a temporary that sending a ui value as a url parameter.
// Later we may be able to send the hub UI's redux value like <Live lang={lang} theme={theme} />
export function getDefaultLanguageCode() {
    const languages = navigator.languages || [
        (navigator as any).language,
        (navigator as any).browerLanguage,
        (navigator as any).userLanguage,
        (navigator as any).systemLanguage,
    ];
    for (const language of languages) {
        if (localeCodes.indexOf(language) !== -1) {
            return language;
        }
    }
    return "en";
}
