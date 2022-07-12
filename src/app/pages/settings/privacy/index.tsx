import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import DialogParentalLock from "@/app/components/ParentalLock";
import SettingsList,
{ SettingsItemData } from "@/app/components/settings/SettingsList";
import { dialogsState } from "@/app/model/appModel";
import { useOpenLink } from "@/app/utils/openLinkUtils";
import BackButton from "@/assets/img/parent-dashboard/back_icon_parents.svg";
import ForwardIcon from "@/assets/img/settings/forward_arrow.svg";
import { THEME_BACKGROUND_SELECT_DIALOG } from "@/config";
import { Box } from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

enum PrivacyItem{
    PRIVACY_POLICY,
    COOKIES_POLICY,
    TERMS_OF_USE,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        height: `100%`,
        display: `flex`,
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        flexDirection: `column`,
    },
    contentContainer: {
        margin: theme.spacing(2),
    },
}));

export default function PrivacyPage () {
    const intl = useIntl();
    const classes = useStyles();
    const history = useHistory();
    const {
        openPrivacyPolicy,
        openCookiesPolicy,
        openTermsOfUse,
    } = useOpenLink();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ privacyItemSelected, setPrivacyItemSelected ] = useState<PrivacyItem>();

    const privacyArray = [
        {
            id: PrivacyItem.PRIVACY_POLICY,
            primary: `account_selectOrg_privacyPolicy`,
        },
        // {
        //     id: PrivacyItem.COOKIES_POLICY,
        //     primary: `hamburger.settings.cookiesPolicy`,
        // },
        {
            id: PrivacyItem.TERMS_OF_USE,
            primary: `hamburger.settings.about.termsOfUse`,
        },
    ];

    const handleBackClick = () => {
        history.goBack();
    };

    const handlePrivacyItemsClick = (id: PrivacyItem) => {
        switch (id){
        case PrivacyItem.PRIVACY_POLICY:
            openPrivacyPolicy();
            break;
        case PrivacyItem.COOKIES_POLICY:
            openCookiesPolicy();
            break;
        case PrivacyItem.TERMS_OF_USE:
            openTermsOfUse();
            break;
        default:
            break;
        }
    };

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    useEffect(() => {
        setParentalLock(false);
    }, []);

    if (dialogs.isParentalLockOpen && privacyItemSelected !== undefined) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    setParentalLock(false);
                    handlePrivacyItemsClick(privacyItemSelected);
                    setPrivacyItemSelected(undefined);
                }}
            />
        );
    }

    const settingsArray: SettingsItemData[] = privacyArray.map((item, index) => (
        {
            title: item.primary,
            rightIconString: ForwardIcon,
            hasDivider: index < privacyArray.length - 1,
            onClick: () => {
                setParentalLock(true);
                setPrivacyItemSelected(item.id);
            },
        }
    ));

    return (
        <Box className={classes.root}>
            <AppBar
                title={intl.formatMessage({
                    id: `hamburger.settings.about.privacy`,
                    defaultMessage: `Privacy`,
                })}
                style={AppBarStyle.ROUNDED}
                leading={(
                    <img
                        src={BackButton}
                        alt="back button"
                        onClick={handleBackClick}
                    />
                )}
            />
            <SettingsList
                settingArray={settingsArray}
                containerStyle={classes.contentContainer}
            />
        </Box>
    );
}
