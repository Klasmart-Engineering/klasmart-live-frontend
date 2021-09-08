import ChromeLogo from "@/assets/img/browser/chrome_logo.svg";
import SafariLogo from "@/assets/img/browser/safari_logo.png";
import {
    getDefaultLanguageCode,
    getLanguage,
} from "./locale";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import React,
{ useState } from "react";
import {
    isIOS,
    isIOS13,
    isMacOs,
} from "react-device-detect";
import {
    FormattedMessage,
    RawIntlProvider,
} from "react-intl";

const url = new URL(window.location.href);
if (url.hostname !== `localhost` && url.hostname !== `live.beta.kidsloop.net`) {
    window.addEventListener(`contextmenu`, (e: MouseEvent) => { e.preventDefault(); }, false);
}

export function BrowserGuide () {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            style={{
                display: `flex`,
                flexGrow: 1,
                height: `100vh`,
            }}
        >
            <GuideContent />
        </Grid>
    );
}

function GuideContent () {
    // const browserName = iOS ? "Safari" : "Chrome";
    const apple = isMacOs || isIOS || isIOS13;
    const [ languageCode, _ ] = useState(url.searchParams.get(`lang`) || getDefaultLanguageCode());
    const locale = getLanguage(languageCode);
    return (
        <RawIntlProvider value={locale}>
            <Grid
                container
                direction="column"
                alignItems="center"
                alignContent="center"
                spacing={1}
            >
                <Grid item>
                    <img
                        src={apple ? SafariLogo : ChromeLogo}
                        height={80} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        {apple ? (isMacOs ?
                            <FormattedMessage id="browser_guide_title_macos" /> :
                            <FormattedMessage id="browser_guide_title_ios" />
                        ) : <FormattedMessage id="browser_guide_title" />}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">
                        <FormattedMessage id="browser_guide_body" />
                    </Typography>
                </Grid>
            </Grid>
        </RawIntlProvider>
    );
}
