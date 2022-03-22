import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import {
    Button,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({
    button: {
        boxShadow: `none`,
        backgroundColor: theme.palette.grey[200],
        marginBottom: theme.spacing(1),
        "&:hover": {
            boxShadow: `none`,
            backgroundColor: theme.palette.grey[200],
        },
    },
}));

const ONETRUST_CDN_LOCATION = `cdn-ukwest.onetrust.com`;
const ONETRUST_APP_ID_ANDROID = `344ed2bc-5559-42fa-ad9d-867b6f9ee3a0-test`;
const ONETRUST_APP_ID_IOS = `8894f33b-5bc6-4a2e-8c1d-6bb490912f01-test`;

export function Onetrust () {
    const classes = useStyles();

    const { isIOS } = useCordovaSystemContext();

    const [ storageLocation ] = useState(ONETRUST_CDN_LOCATION);
    const [ domainId ] = useState(isIOS ? ONETRUST_APP_ID_IOS : ONETRUST_APP_ID_ANDROID);
    const [ languageCode ] = useState(`en`);
    const [ params ] = useState(undefined);

    useEffect(() => {
        (window as any).OneTrust.startSDK(storageLocation, domainId, languageCode, params, () => {
            (window as any).OneTrust.shouldShowBanner((shouldShow: boolean) => {
                if (shouldShow) {
                    (window as any).OneTrust.showBannerUI();
                }
            });
        }, (error: any) => {
            console.error(`OneTrust startSDK error: ${JSON.stringify(error)}`);
        });
    }, [
        storageLocation,
        domainId,
        languageCode,
    ]);

    const showBanner = useCallback(() => {
        (window as any).OneTrust.showBannerUI();
    }, []);

    const showPreferenceCenter = useCallback(() => {
        (window as any).OneTrust.showPreferenceCenterUI();
    }, []);

    return (
        process.env.NODE_ENV === `development` ? <>
            <Button
                fullWidth
                variant="contained"
                size="large"
                className={clsx(classes.button)}
                onClick={() => { showBanner(); }}
            >
                OneTrust: Show Banner UI
            </Button>
            <Button
                fullWidth
                variant="contained"
                size="large"
                className={clsx(classes.button)}
                onClick={() => { showPreferenceCenter(); }}
            >
                OneTrust: Show Preference Center
            </Button>
        </> : <></>
    );
}
