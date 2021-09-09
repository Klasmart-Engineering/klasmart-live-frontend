import {
    fallbackLocale,
    getIntl,
    localeCodes,
} from "@/localization/localeCodes";

const localeCache = new Map<string, ReturnType<typeof getIntl>>();

export function getLanguage (languageCode: string) {
    let language = localeCache.get(languageCode);
    if (language !== undefined) { return language; }
    language = getIntl(languageCode);
    localeCache.set(languageCode, language);
    if (language !== undefined) { return language; }
    return fallbackLocale;
}

// It's a temporary that sending a ui value as a url parameter.
// Later we may be able to send the hub UI's redux value like <Live lang={lang} theme={theme} />
export function getDefaultLanguageCode () {
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
    return `en`;
}
