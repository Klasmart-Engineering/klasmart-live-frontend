import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import SettingsList,
{ SettingsItemData } from "@/app/components/settings/SettingsList";
import { localeState } from "@/app/model/appModel";
import BackButton from "@/assets/img/parent-dashboard/back_icon_parents.svg";
import CheckIcon from "@/assets/img/settings/check_icon.svg";
import {
    SCHEDULE_BLACK_TEXT,
    THEME_BACKGROUND_SELECT_DIALOG,
} from "@/config";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import { Box } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    root: {
        height: `100%`,
        display: `flex`,
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        flexDirection: `column`,
    },
    contentContainer: {
        margin: theme.spacing(2),
    },
    divider: {
        marginBottom: 1,
    },
    listItem: {
        backgroundColor: theme.palette.background.paper,
        height: theme.spacing(7),
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    listItemText: {
        color: SCHEDULE_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `1rem`,
    },
    listItemTextSelected: {
        color: SCHEDULE_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1rem`,
    },
}));

export default function SelectLanguagePage () {
    const history = useHistory();
    const intl = useIntl();
    const classes = useStyles();
    const [ locale, setLocale ] = useRecoilState(localeState);
    const handleBackClick = () => {
        history.goBack();
    };

    const settingsArray: SettingsItemData[] = LANGUAGES_LABEL.map((item, index) => (
        {
            title: item.text,
            rightIconString: locale.languageCode === item.code ? CheckIcon : undefined,
            hasDivider: index < LANGUAGES_LABEL.length - 1,
            onClick: () => setLocale({
                ...locale,
                languageCode: item.code,
            }),
            isHighlight: locale.languageCode === item.code,
        }
    ));

    return (
        <Box className={classes.root}>
            <AppBar
                title={intl.formatMessage({
                    id: `settings.language.title`,
                    defaultMessage: `Select Language`,
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
