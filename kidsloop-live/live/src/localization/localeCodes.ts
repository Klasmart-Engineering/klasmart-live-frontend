import { createIntl, createIntlCache } from "react-intl";
import english from "./en";
import korean from "./ko";
import chinese from "./zh_cn";
import vietnamese from "./vi";

export const localeCodes = ["en", "ko", "zh-CN", "vi"];

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
    }
}
