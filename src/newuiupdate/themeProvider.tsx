import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { Theme, createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

export function themeProvider(languageCode: string, themeMode: string) {
    function setTypography(languageCode: string) {
        let localeFontFamily = "Source Sans Pro";
        const localeWeightLight = 400;
        const localeWeightMedium = 600;
        let localeWeightRegular = 400;
        const localeWeightBold = 700;

        switch (languageCode) {
            case "en":
                localeFontFamily = "Source Sans Pro";
                localeWeightRegular = 600;
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
        
    };

    const palette: PaletteOptions = {
      background: {
          default: '#B4CDED',
          paper: "#ffffff",
      },
      primary: {
          contrastText: "#FFF",
          dark: "#1896ea",
          light: "#0E78D5",
          main: "#0E78D5",
      },
      text : {
          primary : "#616161",
          secondary : "#9e9e9e"
      }
  };


  if (themeMode === "student") {
      palette.background = {default : 'red'}
  }

  console.log('theme', themeMode);

    let theme: Theme;
    if (themeMode === "light") {
        palette.type = "light";
        theme = createMuiTheme({ overrides, palette, typography });
    } else {
        theme = createMuiTheme({ overrides, palette, typography });
    }

    return theme = responsiveFontSizes(theme);
}
