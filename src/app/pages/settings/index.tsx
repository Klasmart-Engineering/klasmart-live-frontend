import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import DialogParentalLock from "@/app/components/ParentalLock";
import {
    dialogsState,
    localeState,
} from "@/app/model/appModel";
import { useOpenLink } from "@/app/utils/openLinkUtils";
import StyledIcon from "@/components/styled/icon";
import {
    COLOR_ORG_ICON_DEFAULT,
    TEXT_COLOR_SIGN_OUT,
    TEXT_COLOR_SUB_HEADER_SETTINGS_PAGE,
    THEME_COLOR_BACKGROUND_LIST,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import { Language } from "@kl-engineering/kidsloop-px/dist/src/components/LanguageSelect";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
    Theme,
    useTheme,
} from '@mui/material/styles';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { QuestionCircle as ContactIcon } from "@styled-icons/bootstrap/QuestionCircle";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import { PrivacyTip as PrivacyIcon } from "@styled-icons/material-outlined/PrivacyTip";
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import clsx from "clsx";
import React,
{ useEffect } from "react";
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
            id: SettingItem.SUPPORT,
            subHeader: `hamburger.settings.support`,
            primary: `hamburger.settings.support.contact`,
            icon: <ContactIcon />,
        },
        {
            id: SettingItem.ABOUT,
            subHeader: `hamburger.settings.about`,
            primary: `hamburger.settings.about.privacy`,
            icon: <PrivacyIcon />,
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
                                    [classes.customPadding]: !item.secondary,
                                })}
                                onClick={() => handleSettingItemsClick(item.id)}
                            >
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <StyledIcon
                                            icon={item.icon}
                                            size="medium"
                                            color={theme.palette.common.white}
                                        />
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
