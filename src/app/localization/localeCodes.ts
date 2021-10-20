import english from "./en.json";
import indonesian from "./id.json";
import korean from "./ko.json";
import vietnamese from "./vi.json";
import chinese from "./zh_CN.json";
import thai from "./th.json";
import englishWeb from "@/localization/en.json";
import indonesianWeb from "@/localization/id.json";
import koreanWeb from "@/localization/ko.json";
import vietnameseWeb from "@/localization/vi.json";
import chineseWeb from "@/localization/zh_CN.json";
import thaiWeb from "@/localization/th.json";
import {
    createIntl,
    createIntlCache,
} from "react-intl";

export const localeCodes = [
    `en`,
    `ko`,
    `zh-CN`,
    `vi`,
    `id`,
    `th`,
];

const intlCache = createIntlCache();
export const fallbackLocale = createIntl({
    locale: `en`,
    messages: {
        ...english,
        ...englishWeb,
    },
}, intlCache);
export function getIntl (locale: string) {
    switch (locale) {
    case `en`:
        return createIntl({
            locale: `en`,
            messages: {
                ...english,
                ...englishWeb,
            },
        }, intlCache);
    case `ko`:
        return createIntl({
            locale: `ko`,
            messages: {
                ...korean,
                ...koreanWeb,
            },
        }, intlCache);
    case `zh-CN`:
        return createIntl({
            locale: `zh-CN`,
            messages: {
                ...chinese,
                ...chineseWeb,
            },
        }, intlCache);
    case `vi`:
        return createIntl({
            locale: `vi`,
            messages: {
                ...vietnamese,
                ...vietnameseWeb,
            },
        }, intlCache);
    case `id`:
        return createIntl({
            locale: `id`,
            messages: {
                ...indonesian,
                ...indonesianWeb,
            },
        }, intlCache);
    case `th`:
        return createIntl({
            locale: `th`,
            messages: {
                ...thai,
                ...thaiWeb,
            },
        }, intlCache);
    default: return fallbackLocale;
    }
}
