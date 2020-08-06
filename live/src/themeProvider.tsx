import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { Theme, createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

export function themeProvider(languageCode: string, themeMode: string) {
    function setTypography(languageCode: string) {
        let localeFontFamily = "CircularStd";
        const localeWeightLight = 400;
        const localeWeightMedium = 600;
        let localeWeightRegular = 400;
        const localeWeightBold = 700;

        switch (languageCode) {
            case "en":
                localeFontFamily = "CircularStd";
                break;
            case "ko":
                localeFontFamily = "NanumSquareRound";
                localeWeightRegular = 600;
                break;
            case "zh-CN":
                localeFontFamily = "Source Han Sans SC";
                break;
            default:
                break;
        }
        localeFontFamily = [localeFontFamily, "-apple-system", "Segoe UI", "Helvetica", "sans-serif"].join(",");
        return { localeFontFamily, localeWeightLight, localeWeightMedium, localeWeightRegular, localeWeightBold };
    }

    const localeTypography = setTypography(languageCode);
    const typography = {
        button: {
            textTransform: "none",
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
    } as any;

    const overrides = {
        MuiAppBar: {
            root: {
                backgroundColor: themeMode === "light" ? "#fafafa" : "#041125",
            },
        },
        MuiTable: {
            root: {
                backgroundColor: themeMode === "light" ? "#fff" : "#05152e",
            },
        },
        MuiTableCell: {
            stickyHeader: {
                backgroundColor: themeMode === "light" ? "#fafafa" : "#041125",
            },
        },
        MuiTabs: {
            root: {
                backgroundColor: themeMode === "light" ? "#FFF" : "#030D1C",
            },
        },
        MuiTab: {
            root: {
                backgroundColor: themeMode === "light" ? "#fafafa" : "#030D1C !important",
            },
        },
        MuiIconButton: {
            colorPrimary: {
                color: themeMode === "light" ? "#0E78D5" : "#fafafa !important", // TODO: Confirm color
                backgroundColor: themeMode === "light" ? "#f6fafe" : "#0E78D5 !important", // TODO: Confirm color
            },
        },
        MuiToggleButton: {
            root: {
                color: themeMode === "light" ? "#1B365D" : "#FFF",
                backgroundColor: themeMode === "light" ? "#FFF" : "#1B365D",
                "&:hover": {
                    "-webkit-transition": "all .4s ease",
                    color: themeMode === "light" ? "#FFF" : "#030D1C",
                    backgroundColor: themeMode === "light" ? "#1B365D" : "#FFF",
                    "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
                    "transition": "all .4s ease",
                },
            },
        }
    };

    const palette: PaletteOptions = {
        background: {
            default: themeMode === "light" ? "#fafafa" : "#030D1C",
            paper: themeMode === "light" ? "#FFF" : "#030D1C",
        },
        primary: {
            contrastText: "#FFF",
            dark: "#1896ea",
            light: "#0E78D5",
            main: "#0E78D5",
        },
    };

    let theme: Theme;
    if (themeMode === "light") {
        palette.type = "light";
        palette.background = { default: "#FFF" };
        theme = createMuiTheme({ overrides, palette, typography });
    } else {
        palette.type = "dark";
        theme = createMuiTheme({ overrides, palette, typography });
    }

    return theme = responsiveFontSizes(theme);
}
