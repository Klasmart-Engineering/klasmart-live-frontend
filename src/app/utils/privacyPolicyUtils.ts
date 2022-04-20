import { useRegionSelect } from "@/providers/region-select-context";
import { useCallback } from "react";

export const useDisplayPrivacyPolicy = () => {
    const { region } = useRegionSelect();

    const displayPrivacyPolicy = useCallback(() => {
        const cordova = (window as any).cordova;
        if (!cordova) return;

        const privacyEndpoint = region?.services.privacy ?? `https://www.kidsloop.net/policies/privacy-notice/`;

        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                cordova.InAppBrowser.open(privacyEndpoint, `_system`, `location=no, zoom=no`);
            } else {
                cordova.plugins.browsertab.openUrl(privacyEndpoint, (successResp: any) => { console.log(successResp); }, () => {
                    console.error(`no browser tab available`);
                });
            }
        });
    }, [ region ]);

    return displayPrivacyPolicy;
};
