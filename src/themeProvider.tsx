import "inter-ui";
import {
    createTheme,
    responsiveFontSizes,
    Theme,
} from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";

export function themeProvider (languageCode: string, themeMode: string) {
    function setTypography (languageCode: string) {
        let localeFontFamily = `Inter`;
        const localeWeightLight = 300;
        const localeWeightRegular = 400;
        const localeWeightMedium = 500;
        const localeWeightBold = 700;

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
    const typography: TypographyOptions = {
        button: {
            textTransform: `none`,
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
        fontSize: 12,
    };

    const breakpoints = {
        values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1280,
            xl: 1920,
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
                    fontWeight: localeTypography.localeWeightBold,
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
                color: palette.text?.primary,
            },
        },
        MuiAppBar: {
            colorPrimary: {
                color: palette.text?.primary,
                backgroundColor: `#ffffff`,
            },
        },
        MuiListItemText:{
            secondary: {
                fontSize: `0.68rem`,
            },
        },
        MuiListSubheader:{
            root:{
                fontWeight: localeTypography.localeWeightBold,
                color: palette.text?.secondary,
                lineHeight: `28px`,
            },
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
