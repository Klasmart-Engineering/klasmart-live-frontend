import "inter-ui";
import {
    TEXT_COLOR_CONSTRAST_DEFAULT,
    TEXT_COLOR_PRIMARY_DEFAULT,
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_BACKGROUND_DEFAULT,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_GREY_200,
    THEME_COLOR_PRIMARY_DARK_DEFAULT,
    THEME_COLOR_PRIMARY_DEFAULT,
    THEME_COLOR_PRIMARY_LIGHT_DEFAULT,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import {
    BreakpointOverrides,
    ComponentsOverrides,
    createTheme,
    PaletteOptions,
    responsiveFontSizes,
    Theme,
    useTheme,
} from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

export function themeProvider (languageCode: string, themeMode: string) {
    const defaultTheme = useTheme();

    function setTypography () {
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

    const localeTypography = setTypography();
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

    const breakpointOverrides: BreakpointOverrides = {
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 1024,
                lg: 1280,
                xl: 1920,
            },
        },
    };

    const palette: PaletteOptions = {
        background: {
            default: THEME_COLOR_BACKGROUND_DEFAULT,
            paper: THEME_COLOR_BACKGROUND_PAPER,
        },
        primary: {
            contrastText: TEXT_COLOR_CONSTRAST_DEFAULT,
            dark: THEME_COLOR_PRIMARY_DARK_DEFAULT,
            light: THEME_COLOR_PRIMARY_LIGHT_DEFAULT,
            main: THEME_COLOR_PRIMARY_DEFAULT,
        },
        secondary: {
            main: THEME_COLOR_SECONDARY_DEFAULT,
        },
        text: {
            primary: TEXT_COLOR_PRIMARY_DEFAULT,
            secondary: TEXT_COLOR_SECONDARY_DEFAULT,
        },
        grey: {
            200: THEME_COLOR_GREY_200,
        },
    };

    const componentOverrides = {
        components: {
            MuiTabs: {
                styleOverrides: {
                    root: {
                        minHeight: 0,
                        padding: 10,
                        borderBottom: `1px solid rgba(0,0,0,0.1)`,
                        "& .MuiTabs-flexContainer": {
                            zIndex: 5,
                            position: `relative`,
                        },
                        "& .MuiTab-iconWrapper": {
                            height: 14,
                            margin: `${defaultTheme.spacing(0, 1, 0, 0)} !important`,
                        },
                    },
                    indicator: {
                        backgroundColor: THEME_COLOR_BACKGROUND_DEFAULT,
                        height: `100%`,
                        borderRadius: 40,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        minWidth: `0 !important`,
                        minHeight: `0 !important`,
                        padding: `${defaultTheme.spacing(1, 2)} !important`,
                        fontSize: `0.85rem`,
                        transition: `opacity 100ms ease-in-out`,
                        flexDirection: `row`,
                        "&:hover": {
                            opacity: 1,
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                },
            },
            MuiStepper: {
                styleOverrides: {
                    root: {
                        background: `transparent`,
                        padding: 0,
                    },
                },
            },
            MuiStep: {
                styleOverrides: {
                    root: {
                        margin: defaultTheme.spacing(0.5, 0),
                        padding: defaultTheme.spacing(1.25),
                        borderRadius: defaultTheme.spacing(1),
                    },
                },
            },
            MuiStepConnector: {
                styleOverrides: {
                    root: {
                        display: `none`,
                    },
                },
            },
            MuiStepButton: {
                styleOverrides: {
                    root: {
                        "&.Mui-disabled": {
                            opacity: `0.3`,
                        },
                    },
                },
            },
            MuiStepLabel: {
                styleOverrides: {
                    label: {
                        color: `inherit`,
                        opacity: 0.6,
                        fontSize: `0.85rem`,
                        textAlign: `left` as const,
                        "&.Mui-active": {
                            opacity: 1,
                            fontWeight: localeTypography.localeWeightBold,
                        },
                    },
                },
            },
            MuiStepIcon: {
                styleOverrides: {
                    root: {
                        fontSize: `1.65rem`,
                    },
                },
            },
            MuiAccordionSummary: {
                styleOverrides: {
                    expandIconWrapper: {
                        color: palette.text?.primary,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    colorPrimary: {
                        color: palette.text?.primary,
                        backgroundColor: `#ffffff`,
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    secondary: {
                        fontSize: `0.68rem`,
                    },
                },
            },
            MuiListSubheader: {
                styleOverrides: {
                    root: {
                        fontWeight: localeTypography.localeWeightBold,
                        color: palette.text?.secondary,
                        lineHeight: `28px`,
                        "&.MuiListSubheader-sticky": {
                            backgroundColor: `inherit`,
                        },
                    },
                },
            },
        },
    } as ComponentsOverrides;

    let theme: Theme;
    if (themeMode === `light`) {
        palette.mode = `light`;
    }

    theme = createTheme({
        ...componentOverrides,
        ...breakpointOverrides,
        palette,
        typography,
    });

    return (theme = responsiveFontSizes(theme));
}
