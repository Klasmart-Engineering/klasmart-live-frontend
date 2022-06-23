import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import DialogParentalLock from "@/app/components/ParentalLock";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { ConfirmSignOutDialog } from "@/app/dialogs/confirmSignOutDialog";
import {
    dialogsState,
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
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import { Language } from "@kl-engineering/kidsloop-px/dist/types/components/LanguageSelect";
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import { QuestionCircle as ContactIcon } from "@styled-icons/bootstrap/QuestionCircle";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import { PrivacyTip as PrivacyIcon } from "@styled-icons/material-outlined/PrivacyTip";
import clsx from "clsx";
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
    listItem: {
        backgroundColor: theme.palette.background.paper,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
        height: theme.spacing(7),
    },
    divider: {
        marginBottom: 1,
    },
    listItemTextPrimary: {
        color: `#444444`,
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1rem`,
    },
    listItemTextSecondary: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        paddingLeft: theme.spacing(2),
    },
    contentContainer: {
        width: `auto`,
        overflow: `hidden`,
        borderRadius: theme.spacing(1.25),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    customMargin: {
        marginTop: theme.spacing(1),
    },
    signOutButton: {
        borderRadius: theme.spacing(3),
        borderTopRightRadius: theme.spacing(1),
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
        backgroundColor: BACKGROUND_PROCESS_GREY,
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
    const langText = LANGUAGES_LABEL.find((language: Language) => language.code === locale.languageCode);
    const { openContact } = useOpenLink();

    const settingArray = [
        {
            id: SettingItem.LANGUAGE,
            subHeader: `hamburger.settings.general`,
            primary: `settings.general.language`,
            secondary: langText?.text,
            icon: <LanguageIcon />,
        },
        {
            id: SettingItem.ABOUT,
            subHeader: `hamburger.settings.about`,
            primary: `hamburger.settings.about.privacy`,
            icon: <PrivacyIcon />,
        },
        {
            id: SettingItem.SUPPORT,
            subHeader: `hamburger.settings.support`,
            primary: `hamburger.settings.support.contact`,
            icon: <ContactIcon />,
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

    const getClasses = (settingItem: SettingItem) => {
        switch (settingItem) {
        case SettingItem.LANGUAGE:
        case SettingItem.ABOUT:
            return clsx(classes.listItem, classes.divider);
        case SettingItem.SUPPORT:
            return classes.listItem;
        }
    };
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
                <Box className={classes.contentContainer}>
                    {settingArray.map((item) => (
                        <ListItem
                            key={item.id}
                            button
                            className={getClasses(item.id)}
                            onClick={() => handleSettingItemsClick(item.id)}
                        >
                            <ListItemText
                                primary={
                                    <Grid
                                        container
                                        wrap="nowrap"
                                    >
                                        <Grid item>
                                            <Typography
                                                className={classes.listItemTextPrimary}
                                            > {intl.formatMessage({
                                                    id: item.primary,
                                                })}
                                            </Typography>
                                        </Grid>
                                        {
                                            item.secondary &&
                                            <Grid item>
                                                <Typography
                                                    className={clsx(classes.listItemTextPrimary, classes.listItemTextSecondary)}
                                                > {item.secondary}
                                                </Typography>
                                            </Grid>
                                        }

                                    </Grid>}
                            />
                            <img
                                alt="forward icon"
                                src={ForwardIcon}
                            />
                        </ListItem>
                    ))}
                </Box>
                <Box className={clsx(classes.contentContainer, classes.customMargin)}>
                    <ListItem className={classes.listItem}>
                        <ListItemText
                            classes={{
                                primary: classes.listItemTextPrimary,
                            }}
                            primary={
                                <FormattedMessage
                                    id="settings.version"
                                    values={{
                                        version: process.env.VERSION,
                                    }}
                                />}
                        />

                    </ListItem>
                </Box>
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
                }}
            />
        </Box>
    );
}
