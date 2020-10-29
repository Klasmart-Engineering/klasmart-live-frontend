import { createIntl, createIntlCache } from "react-intl";
import english from "./en";
import korean from "./ko";
import chinese from "./zh_cn";

export const localeCodes = ["en", "ko", "zh-CN"];

const intlCache = createIntlCache();
export const fallbackLocale = createIntl({ locale: "en", messages: english }, intlCache);
export function getIntl(locale: string) {
    switch (locale) {
        case "zh-CN":
            return createIntl({ locale: "zh-CN", messages: chinese }, intlCache);
        case "ko":
            return createIntl({ locale: "ko", messages: korean }, intlCache);
        case "en":
            return createIntl({ locale: "en", messages: english }, intlCache);
    }
}

const localeCache = new Map<string, ReturnType<typeof getIntl>>();
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

export function getLanguage(languageCode: string) {
    let language = localeCache.get(languageCode);
    if (language !== undefined) { return language; }
    language = getIntl(languageCode);
    localeCache.set(languageCode, language);
    if (language !== undefined) { return language; }
    return fallbackLocale;
}
