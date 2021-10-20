import english from "./en.json";
import indonesian from "./id.json";
import korean from "./ko.json";
import vietnamese from "./vi.json";
import chinese from "./zh_CN.json";
import thai from "./th.json";
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
    messages: english,
}, intlCache);
export function getIntl (locale: string) {
    switch (locale) {
    case `en`:
        return createIntl({
            locale: `en`,
            messages: english,
        }, intlCache);
    case `ko`:
        return createIntl({
            locale: `ko`,
            messages: korean,
        }, intlCache);
    case `zh-CN`:
        return createIntl({
            locale: `zh-CN`,
            messages: chinese,
        }, intlCache);
    case `vi`:
        return createIntl({
            locale: `vi`,
            messages: vietnamese,
        }, intlCache);
    case `id`:
        return createIntl({
            locale: `id`,
            messages: indonesian,
        }, intlCache);
    case `th`:
        return createIntl({
            locale: `th`,
            messages: thai,
        }, intlCache);
    }
}
