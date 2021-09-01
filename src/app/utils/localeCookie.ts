import { localeCodes } from "../../localization/localeCodes";
import { localeState } from "../model/appModel";
import Cookies from "js-cookie";
import {
    useCallback,
    useEffect,
    useMemo,
} from "react";
import { IntlShape } from "react-intl";
import { useRecoilState } from "recoil";
import { getLanguage } from "src/utils/locale";

export function useLocaleCookie (): [IntlShape, () => void] {
    const [ locale, setLocale ] = useRecoilState(localeState);

    const language = useMemo(() => {
        return getLanguage(locale.languageCode);
    }, [ locale ]);

    useEffect(() => {
        Cookies.set(`locale`, locale.languageCode, {
            path: `/`,
            domain: `.kidsloop.net`,
        });
    }, [ locale ]);

    const setLanguageFromLocaleCookie = useCallback(() => {
        const selectedLanguageCode = Cookies.get(`locale`);

        if (selectedLanguageCode && localeCodes.includes(selectedLanguageCode)) {
            setLocale({
                ...locale,
                languageCode: selectedLanguageCode,
            });
        }
    }, [ setLocale ]);

    return [ language, setLanguageFromLocaleCookie ];
}
