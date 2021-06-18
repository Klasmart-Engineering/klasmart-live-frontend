import { createIntl, createIntlCache } from "react-intl";
import english from "./en.json";
import korean from "./ko.json";
import chinese from "./zh_CN.json";
import vietnamese from "./vi.json";
import indonesian from "./id.json";

export const localeCodes = ["en", "ko", "zh-CN", "vi", "id"];

const intlCache = createIntlCache();
export const fallbackLocale = createIntl({ locale: "en", messages: english }, intlCache);
export function getIntl(locale: string) {
    switch (locale) {
        case "en":
            return createIntl({ locale: "en", messages: english }, intlCache);
        case "ko":
            return createIntl({ locale: "ko", messages: korean }, intlCache);
        case "zh-CN":
            return createIntl({ locale: "zh-CN", messages: chinese }, intlCache);
        case "vi":
            return createIntl({ locale: "vi", messages: vietnamese }, intlCache);
        case "id":
            return createIntl({ locale: "id", messages: indonesian }, intlCache);
    }
}
