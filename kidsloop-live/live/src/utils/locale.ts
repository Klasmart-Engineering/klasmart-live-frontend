import { fallbackLocale, getIntl } from "../localization/locale";

const localeCache = new Map<string, ReturnType<typeof getIntl>>();

export function getLanguage(languageCode: string) {
    let language = localeCache.get(languageCode);
    if (language !== undefined) { return language; }
    language = getIntl(languageCode);
    localeCache.set(languageCode, language);
    if (language !== undefined) { return language; }
    return fallbackLocale;
}
