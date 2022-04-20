import DialogParentalLock from "@/app/components/ParentalLock";
import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState, dialogsState } from "@/app/model/appModel";
import { useDisplayPrivacyPolicy } from "@/app/utils/privacyPolicyUtils";
import { 
    THEME_COLOR_BACKGROUND_LIST, TEXT_COLOR_SIGN_OUT, 
    THEME_COLOR_POLICY_AVATAR, TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    THEME_COLOR_LANGUAGE_AVATAR, COLOR_ORG_ICON_DEFAULT,
} from "@/config";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import { Language } from "@kl-engineering/kidsloop-px/dist/types/components/LanguageSelect";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import clsx from "clsx";
import Grid from '@material-ui/core/Grid';
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from '@material-ui/core/styles';
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import { PrivacyTip as PolicyIcon } from "@styled-icons/material-outlined/PrivacyTip";
import React, { useEffect } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

enum SettingItem{
    LANGUAGE,
    PRIVACY_POLICY,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    fullHeight: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    avatarLanguage: {
        backgroundColor: THEME_COLOR_LANGUAGE_AVATAR,
    },
    avatarPolicy: {
        backgroundColor: THEME_COLOR_POLICY_AVATAR,
    },
    listContainer: {
        padding: theme.spacing(2),
    },
    listSubHeader: {
        color: TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
        fontWeight: theme.typography.fontWeightRegular as number,
    },
    listItem: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(1.5),
        marginBottom: theme.spacing(2),
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    customPadding: {
        padding: theme.spacing(2),
    },
    listItemTextPrimary: {
        color: TEXT_COLOR_SIGN_OUT,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
}));

export default function SettingsPage () {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [ locale ] = useRecoilState(localeState);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const langText = LANGUAGES_LABEL.find((language: Language) => language.code === locale.languageCode);
    const displayPrivacyPolicy = useDisplayPrivacyPolicy();

    const settingArray = [
        {
            id: SettingItem.LANGUAGE,
            subHeader: `settings.general.title`,
            classNameAvatar: classes.avatarLanguage,
            primary: "settings.general.language",
            secondary: langText?.text,
        },
        {
            id: SettingItem.PRIVACY_POLICY,
            subHeader: `hamburger.settings.about.privacy`,
            classNameAvatar: classes.avatarPolicy,
            primary: "account_selectOrg_privacyPolicy",
            secondary: '',
        },
    ];

    useEffect(() => {
        setParentalLock(false);
    }, []);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    const handleBackClick = () => {
        history.goBack();
    };

    const handleSettingItemsClick = (id: SettingItem) => {
        switch (id){
            case SettingItem.LANGUAGE: 
                history.push(`/settings/select-language`);
                break;
            case SettingItem.PRIVACY_POLICY:
                setParentalLock(true);
                break;
            default:
                break;
        }
    }

    if (dialogs.isParentalLockOpen) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    displayPrivacyPolicy();
                    setParentalLock(false);
                }}
            />
        );
    }

    return (
        <>
            <AppBar
                title={intl.formatMessage({
                    id: `settings.title`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <Grid
                container
                alignContent="space-between"
                className={classes.fullHeight}
            >
                <Grid
                    item
                    xs={12}
                    className={classes.listContainer}
                >
                    {settingArray.map((item) => (
                        <List
                        key={item.id}
                        subheader={
                            <ListSubheader
                                disableGutters
                                component="div"
                                className={classes.listSubHeader}
                            >
                                <FormattedMessage id={item.subHeader} />
                            </ListSubheader>
                        }
                    >
                        <ListItem
                            button
                            className={clsx(classes.listItem, { 
                                [classes.customPadding]: item.id === SettingItem.PRIVACY_POLICY,
                            })}
                            onClick={() => handleSettingItemsClick(item.id)}
                        >
                            <ListItemAvatar>
                                <Avatar className={item.classNameAvatar}>
                                    {item.id === SettingItem.PRIVACY_POLICY ?
                                    <PolicyIcon
                                    color={theme.palette.common.white}
                                    size={24}
                                    /> :
                                    <LanguageIcon
                                        color={theme.palette.common.white}
                                        size={24}
                                    />}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemTextPrimary,
                                }}
                                primary={intl.formatMessage({
                                    id: item.primary,
                                })}
                                secondary={item.secondary}
                            />
                            <ArrowRight
                                color={COLOR_ORG_ICON_DEFAULT}
                                size={24}
                            />
                        </ListItem>
                    </List>
                    ))}
                </Grid>
            </Grid>
        </>
    );
}
