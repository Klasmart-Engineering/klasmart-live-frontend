import { localeCodes } from "../../localization/localeCodes";
import { setLocale } from "../../store/reducers/session";
import { State } from "../../store/store";
import Cookies from "js-cookie";
import {
    useCallback,
    useEffect,
    useMemo,
} from "react";
import { IntlShape } from "react-intl";
import {
    useDispatch,
    useSelector,
} from "react-redux";

export function useLocaleCookie (): [IntlShape, () => void] {
    const dispatch = useDispatch();
    const languageCode = useSelector((state: State) => state.session.locale);

    const language = useMemo(() => {
        return getLanguage(languageCode);
    }, [ languageCode ]);

    useEffect(() => {
        Cookies.set(`locale`, languageCode, {
            path: `/`,
            domain: `.kidsloop.net`,
        });
    }, [ languageCode ]);

    const setLanguageFromLocaleCookie = useCallback(() => {
        const selectedLanguageCode = Cookies.get(`locale`);

        if (selectedLanguageCode && localeCodes.includes(selectedLanguageCode)) {
            dispatch(setLocale(selectedLanguageCode));
        }
    }, []);

    return [ language, setLanguageFromLocaleCookie ];
}
