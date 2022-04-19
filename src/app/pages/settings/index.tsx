import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState } from "@/app/model/appModel";
import { useOpenLink } from "@/app/utils/openLinkUtils";
import { 
    THEME_COLOR_BACKGROUND_LIST, TEXT_COLOR_SIGN_OUT, 
    TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE, COLOR_ORG_ICON_DEFAULT,
    THEME_COLOR_ORG_MENU_DRAWER,
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
import { PrivacyTip as PrivacyIcon } from "@styled-icons/material-outlined/PrivacyTip";
import { QuestionCircle as ContactIcon } from "@styled-icons/bootstrap/QuestionCircle";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

enum SettingItem{
    LANGUAGE,
    SUPPORT,
    ABOUT,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    fullHeight: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    avatar: {
        backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
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
    const langText = LANGUAGES_LABEL.find((language: Language) => language.code === locale.languageCode);
    const { openContact } = useOpenLink();
    const AVATAR_SIZE = 20;

    const settingArray = [
        {
            id: SettingItem.LANGUAGE,
            subHeader: `hamburger.settings.general`,
            primary: "settings.general.language",
            secondary: langText?.text,
            icon:  <LanguageIcon
            color={theme.palette.common.white}
            size={AVATAR_SIZE} />
        },
        {
            id: SettingItem.SUPPORT,
            subHeader: `hamburger.settings.support`,
            primary: "hamburger.settings.support.contact",
            secondary: '',
            icon:  <ContactIcon
            color={theme.palette.common.white}
            size={AVATAR_SIZE} />
        },
        {
            id: SettingItem.ABOUT,
            subHeader: `hamburger.settings.about`,
            primary: "hamburger.settings.about.privacy",
            secondary: '',
            icon:  <PrivacyIcon
            color={theme.palette.common.white}
            size={AVATAR_SIZE} />
        },
    ];

    const handleBackClick = () => {
        history.goBack();
    };

    const handleSettingItemsClick = (id: SettingItem) => {
        switch (id){
            case SettingItem.LANGUAGE: 
                history.push(`/settings/select-language`);
                break;
            case SettingItem.SUPPORT:
                openContact();
                break;
            case SettingItem.ABOUT:
                history.push(`/settings/privacy`);
                break;
            default:
                break;
        }
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
                                [classes.customPadding]: item.id !== SettingItem.LANGUAGE,
                            })}
                            onClick={() => handleSettingItemsClick(item.id)}
                        >
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    {item.icon}
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
