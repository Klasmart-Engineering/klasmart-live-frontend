import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import DialogParentalLock from "@/app/components/ParentalLock";
import SettingsList,
{ SettingsItemData } from "@/app/components/settings/SettingsList";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { ConfirmSignOutDialog } from "@/app/dialogs/confirmSignOutDialog";
import {
    dialogsState,
    isNavigatedLandscapeScreen,
    isShowOnBoardingState,
    localeState,
    shouldClearCookieState,
} from "@/app/model/appModel";
import { useOpenLink } from "@/app/utils/openLinkUtils";
import BackButton from "@/assets/img/parent-dashboard/back_icon_parents.svg";
import ForwardIcon from "@/assets/img/settings/forward_arrow.svg";
import {
    BACKGROUND_PROCESS_GREY,
    TEXT_COLOR_CONSTRAST_DEFAULT,
    THEME_BACKGROUND_SELECT_DIALOG,
} from "@/config";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import { Language } from "@kl-engineering/kidsloop-px/dist/types/components/LanguageSelect";
import {
    Box,
    Button,
    List,
} from "@material-ui/core";
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
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

enum SettingItem{
    LANGUAGE,
    SUPPORT,
    ABOUT,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        height: `100%`,
        display: `flex`,
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        flexDirection: `column`,
    },
    listContainer: {
        width: `100%`,
        padding: theme.spacing(2),
        overflowY: `scroll`,
    },
    customMargin: {
        marginTop: theme.spacing(1),
    },
    signOutButton: {
        borderRadius: theme.spacing(3),
        borderTopRightRadius: theme.spacing(1),
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
        backgroundColor: BACKGROUND_PROCESS_GREY,
        "&:hover": {
            backgroundColor: BACKGROUND_PROCESS_GREY,
        },
        fontSize: `1.15rem`,
        margin: theme.spacing(`auto`, 2, 6, 2),
        height: theme.spacing(7),
        fontWeight: theme.typography.fontWeightBold as number,
        [theme.breakpoints.up(`sm`)]: {
            height: theme.spacing(9),
            fontSize: theme.spacing(3.5),
            marginLeft: theme.spacing(2.5),
            marginRight: theme.spacing(2.5),
        },
    },
}));

export default function SettingsPage () {
    const intl = useIntl();
    const classes = useStyles();
    const { actions } = useAuthenticationContext();
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    const history = useHistory();
    const [ openConfirmationPopup, setOpenConfirmationPopup ] = useState(false);

    const [ locale ] = useRecoilState(localeState);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const setIsNavigatedLandscapeScreen = useSetRecoilState(isNavigatedLandscapeScreen);
    const langText = LANGUAGES_LABEL.find((language: Language) => language.code === locale.languageCode);
    const { openContact } = useOpenLink();

    const settingArray = [
        {
            id: SettingItem.LANGUAGE,
            primary: `settings.general.language`,
            secondary: langText?.text,
        },
        {
            id: SettingItem.ABOUT,
            primary: `hamburger.settings.about.privacy`,
        },
        {
            id: SettingItem.SUPPORT,
            subHeader: `hamburger.settings.support`,
            primary: `hamburger.settings.support.contact`,
        },
    ];

    const handleBackClick = () => {
        history.goBack();
    };

    const handleSettingItemsClick = (id: SettingItem) => {
        switch (id) {
        case SettingItem.LANGUAGE:
            history.push(`/settings/select-language`);
            break;
        case SettingItem.SUPPORT:
            setParentalLock(true);
            break;
        case SettingItem.ABOUT:
            history.push(`/settings/privacy`);
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

    if (dialogs.isParentalLockOpen) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    setParentalLock(false);
                    openContact();
                }}
            />
        );
    }

    const settingsArray: SettingsItemData[] = settingArray.map((item, index) => (
        {
            title: item.primary,
            description: item.secondary,
            rightIconString: ForwardIcon,
            hasDivider: index < settingArray.length - 1,
            onClick: () => handleSettingItemsClick(item.id),
        }
    ));

    return (
        <Box className={classes.root}>
            <AppBar
                title={intl.formatMessage({
                    id: `settings.title`,
                    defaultMessage: `Settings`,
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
            <List className={classes.listContainer}>
                <SettingsList settingArray={settingsArray} />
                <SettingsList
                    containerStyle={classes.customMargin}
                    settingArray={[
                        {
                            title: `settings.version`,
                            values: {
                                version: process.env.VERSION,
                            },
                        },
                    ]}
                />
            </List>
            <Button
                className={classes.signOutButton}
                onClick={() => setOpenConfirmationPopup(true)}
            >
                <FormattedMessage id="account_selectOrg_signOut" />
            </Button>
            <ConfirmSignOutDialog
                visible={openConfirmationPopup}
                closeLabel={intl.formatMessage({
                    id: `button_cancel`,
                })}
                confirmLabel={intl.formatMessage({
                    id: `account_selectOrg_signOut`,
                })}
                title={intl.formatMessage({
                    id: `hamburger.signOut.confirm`,
                })}
                onClose={() => setOpenConfirmationPopup(false)}
                onConfirm={() => {
                    setOpenConfirmationPopup(false);
                    actions?.signOut();
                    setShouldClearCookie(true);
                    setShowOnBoarding(true);
                    setIsNavigatedLandscapeScreen(false);
                }}
            />
        </Box>
    );
}
