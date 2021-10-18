import {
    createTheme,
    responsiveFontSizes,
    Theme,
} from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

export function themeProvider (languageCode: string, themeMode: string) {
    function setTypography (languageCode: string) {
        let localeFontFamily = `Source Sans Pro`;
        const localeWeightLight = 400;
        const localeWeightMedium = 600;
        let localeWeightRegular = 400;
        const localeWeightBold = 700;

        switch (languageCode) {
        case `en`:
            localeFontFamily = `Source Sans Pro`;
            localeWeightRegular = 500;
            break;
        case `ko`:
            localeFontFamily = `NanumSquareRound`;
            localeWeightRegular = 600;
            break;
        case `zh-CN`:
            localeFontFamily = `Source Han Sans SC`;
            break;
        default:
            break;
        }
        localeFontFamily = [
            localeFontFamily,
            `-apple-system`,
            `Segoe UI`,
            `Helvetica`,
            `sans-serif`,
        ].join(`,`);
        return {
            localeFontFamily,
            localeWeightLight,
            localeWeightMedium,
            localeWeightRegular,
            localeWeightBold,
        };
    }

    const localeTypography = setTypography(languageCode);
    const typography = {
        button: {
            textTransform: `none`,
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
        fontSize: 12,
    } as any;

    const breakpoints = {
        values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1280,
            xl: 1920,
        },
    };

    const overrides = {
        MuiTabs: {
            root: {
                minHeight: 0,
                padding: 10,
                borderBottom: `1px solid rgba(0,0,0,0.1)`,
                "& $flexContainer": {
                    zIndex: 5,
                    position: `relative`,
                },
            },
            indicator: {
                backgroundColor: `#cfe1f9`,
                height: `100%`,
                borderRadius: 40,
            },
        },
        MuiTab: {
            root: {
                minWidth: `0 !important`,
                minHeight: `0 !important`,
                padding: `5px 16px`,
                fontSize: `0.85rem`,
                transition: `opacity 100ms ease-in-out`,
                "&:hover": {
                    opacity: 1,
                },
            },
        },
        MuiButton:{
            root:{
                borderRadius: 8,
            },
        },
        MuiStepper:{
            root:{
                background: `transparent`,
            },
        },
        MuiStepButton: {
            root: {
                cursor: `pointer`,
                marginBottom: 8,
                marginLeft: -1,

                "&.Mui-disabled": {
                    opacity: `0.3`,
                },
            },
        },
        MuiStepLabel:{
            label:{
                color: `inherit`,
                opacity: 0.6,
                fontSize: `0.85rem`,
                "&$active":{
                    opacity: 1,
                    fontWeight: 600,
                },
            },
        },
        MuiStepIcon:{
            root:{
                fontSize: `1.65rem`,
            },
        },
        MuiAccordionSummary:{
            expandIcon:{
                color: `#344966`,
            },
        },
        MuiAppBar: {
            colorPrimary: {
                color: `#344966`,
                backgroundColor: `#ffffff`,
            },
        },
    };

    const palette: PaletteOptions = {
        background: {
            default: `#cfe1f9`,
            paper: `#ffffff`,
        },
        primary: {
            contrastText: `#FFF`,
            dark: `#1896ea`,
            light: `#344966`,
            main: `#344966`,
        },
        text: {
            primary: `#344966`,
            secondary: `#9e9e9e`,
        },
        grey:{
            200: `#f1f6fc`,
        },
    };

    if (themeMode === `student`) {
        palette.background = {
            default: `red`,
        };
    }

    let theme: Theme;
    if (themeMode === `light`) {
        palette.type = `light`;
    }

    theme = createTheme({
        overrides,
        palette,
        typography,
        breakpoints,
    });

    return (theme = responsiveFontSizes(theme));
}
