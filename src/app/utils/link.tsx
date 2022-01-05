import { URL_REGEX } from "@/config";
import { Link } from "@material-ui/core";
import React from "react";

export function generateDescriptionHasHyperLink (description: string, onClick: (url: string) => void) {
    const texts = description.split(` `);
    return texts.map((url) => URL_REGEX.test(url)
        ? (
            <Link
                href={undefined}
                variant="body1"
                onClick={() => onClick(url)}
            >
                {`${url} `}
            </Link>
        )
        : `${url} `);
}

export function openHyperLink (link: string) {
    const cordova = (window as any).cordova;
    let browser: any;
    if (!cordova) return;
    cordova.plugins.browsertab.isAvailable((result: any) => {
        if (!result) {
            browser = cordova.InAppBrowser.open(link, `_system`, `location=no, zoom=no`);
        } else {
            cordova.plugins.browsertab.openUrl(link, (successResp: any) => {
                console.log(successResp);
            }, (failureResp: any) => {
                console.error(`no browser tab available`);
            });
        }
    });
}
