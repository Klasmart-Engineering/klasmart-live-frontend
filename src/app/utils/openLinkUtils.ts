import { useRegionSelect } from "@/providers/region-select-context";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { FilePath } from "../context-provider/authentication-context";
import { urlFilePathState } from "../model/appModel";

export const useOpenLink = () => {
    const { region } = useRegionSelect();

    const openUrl = (endpoint: string) => {
        const cordova = (window as any).cordova;
        if (!cordova) return;

        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                cordova.InAppBrowser.open(endpoint, `_system`, `location=no, zoom=no`);
            } else {
                cordova.plugins.browsertab.openUrl(endpoint, (successResp: any) => { console.log(successResp); }, () => {
                    console.error(`no browser tab available`);
                });
            }
        });
    };

    const openPrivacyPolicy = useCallback(() => {
        const endpoint = region?.services.privacy ?? `https://www.kidsloop.net/policies/privacy-notice/`;
        openUrl(endpoint);
    }, [ region ]);

    const openCookiesPolicy = useCallback(() => {
        const endpoint = region?.services.cookies ?? `https://www.kidsloop.net/cookies-policy/`;
        openUrl(endpoint);
    }, [ region ]);

    const openTermsOfUse = useCallback(() => {
        const endpoint = region?.services.terms ?? `https://www.kidsloop.net/policies/terms/`;
        openUrl(endpoint);
    }, [ region ]);

    const openContact = useCallback(() => {
        const endpoint = region?.services.contact ?? `https://www.kidsloop.net/contact-us/`;
        openUrl(endpoint);
    }, [ region ]);

    return {
        openPrivacyPolicy,
        openCookiesPolicy,
        openTermsOfUse,
        openContact,
    };
};

export const useOpenDeepLink = () => {
    const [ urlFilePath, setUrlFilePath ] = useRecoilState(urlFilePathState);
    const { openPrivacyPolicy, openCookiesPolicy, openTermsOfUse, openContact } = useOpenLink();
    const history = useHistory();

    const openDeepLink = useCallback(() => {
        switch (urlFilePath) {
            case FilePath.PRIVACY_POLICY:
                openPrivacyPolicy();
                break;
            case FilePath.COOKIE_POLICY:
                openCookiesPolicy();
                break;
            case FilePath.TERMS_OF_USE:
                openTermsOfUse();
                break;
            case FilePath.CONTACT:
                openContact();
                break;
            default:
                break;
        }
        setUrlFilePath(``);
    }, [urlFilePath]);

    return {
        openDeepLink,
    };
}
