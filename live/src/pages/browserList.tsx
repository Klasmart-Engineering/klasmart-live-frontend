import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ChromeLogo from "../assets/img/browsers/logo-chrome.png";
import EdgeLogo from "../assets/img/browsers/logo-edge.png";
import FireFoxLogo from "../assets/img/browsers/logo-firefox.png";
import OperaLogo from "../assets/img/browsers/logo-opera.png";
import SafariLogo from "../assets/img/browsers/logo-safari.png";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles({
    card: {
        padding: "48px 40px !important",
    },
    browserLogo: {
        verticalAlign: "middle",
        display: "table-cell",
        width: 52,
    },
    textLogo: {
        verticalAlign: "middle",
        display: "table-cell",
        textDecoration: "none",
        paddingLeft: 12,
    }
}),
);
// tslint:enable:object-literal-sort-keys

export function detectIE() {
    var ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) { return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10); }
    // other browser
    return false;
}

export default function BrowserList() {
    const classes = useStyles();
    const isIE = detectIE();

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            alignContent="center"
            style={{
                flexGrow: 1,
                flexWrap: "nowrap",
                padding: "32px 0",
            }}
        >
            <Card>
                <CardContent className={classes.card}>
                    <Typography variant="h4" color="textSecondary" gutterBottom>Browser not supported</Typography>
                    <Typography color="textSecondary">We apologize for any inconvenience. We recommend using this site with one of the following browsers: </Typography>
                    <Grid container spacing={4} style={{ padding: "16px 0" }}>
                        <Grid item xs={6} style={{ width: "50%", display: "table" }}>
                            <a href="https://www.google.com/chrome/" target="_blank" className={classes.browserLogo}>
                                <img src={ChromeLogo} style={{ height: 48 }} />
                            </a>
                            <a href="https://www.google.com/chrome/" target="_blank" className={classes.textLogo}>
                                <Typography variant="caption">Google Chrome</Typography>
                            </a>
                        </Grid>
                        <Grid item xs={6} style={{ width: "50%", display: "table" }}>
                            <a href="http://www.firefox.com" target="_blank" className={classes.browserLogo}>
                                <img src={FireFoxLogo} style={{ height: 48 }} />
                            </a>
                            <a href="http://www.firefox.com" target="_blank" className={classes.textLogo}>
                                <Typography variant="caption">Mozilla FireFox</Typography>
                            </a>
                        </Grid>
                    </Grid>
                    <Typography color="textSecondary">We also support: </Typography>
                    <Grid container spacing={4} style={{ padding: "16px 0" }}>
                        <Grid item xs={12} style={{ display: "table" }}>
                            <a href="https://support.apple.com/downloads/#safari" target="_blank" className={classes.browserLogo}>
                                <img src={SafariLogo} style={{ height: 48 }} />
                            </a>
                            <a href="https://support.apple.com/downloads/#safari" target="_blank" className={classes.textLogo}>
                                <Typography variant="caption">Safari (MacOS / iOS only)</Typography>
                            </a>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}
