import { CompositionRoot } from "./composition-root";
import { KidsloopPxProvider } from "./kidsloop-px-provider";
import RouterProvider from "@/router/Provider";
import { themeProvider } from "@/themeProvider";
import {
    getDefaultLanguageCode,
    getLanguage,
} from "@/utils/locale";
import { ThemeProvider } from "@material-ui/core";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useMemo,
    useState,
} from 'react';
import { RawIntlProvider } from "react-intl";

type Props = {
    children?: ReactChild | ReactChildren | null;
}

function Providers ({ children }: Props) {
    const [ languageCode, setLanguageCode ] = useState(getDefaultLanguageCode());
    const [ themeMode, setThemeMode ] = useState(`light`);
    const locale = getLanguage(languageCode);
    const isApp = !!process.env.IS_CORDOVA_BUILD;

    const themeContext = useMemo<IThemeContext>(() => ({
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    }), [
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    ]);

    return (
        <ThemeContext.Provider value={themeContext}>
            <RawIntlProvider value={locale}>
                <CompositionRoot>
                    <ThemeProvider theme={themeProvider(`en`, `light`, isApp)}>
                        <KidsloopPxProvider>
                            <RouterProvider>
                                {children}
                            </RouterProvider>
                        </KidsloopPxProvider>
                    </ThemeProvider>
                </CompositionRoot>
            </RawIntlProvider>
        </ThemeContext.Provider>
    );
}

export default Providers;

export interface IThemeContext {
    themeMode: string;
    languageCode: string;
    setThemeMode: React.Dispatch<React.SetStateAction<string>>;
    setLanguageCode: React.Dispatch<React.SetStateAction<string>>;
}

export const ThemeContext = createContext<IThemeContext>({
    themeMode: ``,
    setThemeMode: () => null,
    languageCode: ``,
    setLanguageCode: () => null,
} as any as IThemeContext);
