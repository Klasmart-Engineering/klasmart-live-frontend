import english from "./en.json";
import spanish from "./es.json";
import indonesian from "./id.json";
import korean from "./ko.json";
import thai from "./th.json";
import vietnamese from "./vi.json";
import chinese from "./zh_CN.json";
import englishWeb from "@/localization/en.json";
import spanishWeb from "@/localization/es.json";
import indonesianWeb from "@/localization/id.json";
import koreanWeb from "@/localization/ko.json";
import thaiWeb from "@/localization/th.json";
import vietnameseWeb from "@/localization/vi.json";
import chineseWeb from "@/localization/zh_CN.json";
import { Language } from "kidsloop-px/dist/types/components/LanguageSelect";
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
    `es`,
    `th`,
];

export const LANGUAGES_LABEL: Language[] = [
    {
        code: `en`,
        text: `English`,
    },
    {
        code: `es`,
        text: `Español`,
    },
    {
        code: `ko`,
        text: `한국어`,
    },
    {
        code: `zh-CN`,
        text: `汉语 (简体)`,
    },
    {
        code: `vi`,
        text: `Tiếng Việt`,
    },
    {
        code: `id`,
        text: `Indonesian`,
    },
    {
        code: `th`,
        text: `ไทย`,
    },
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
    case `es`:
        return createIntl({
            locale: `es`,
            messages: {
                ...spanish,
                ...spanishWeb,
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
