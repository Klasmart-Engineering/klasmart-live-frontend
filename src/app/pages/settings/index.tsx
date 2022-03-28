import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState } from "@/app/model/appModel";
import { THEME_COLOR_BACKGROUND_LIST } from "@/config";
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
import Grid from '@material-ui/core/Grid';
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from '@material-ui/core/styles';
import { NavigateNext as NextIcon } from "@styled-icons/material/NavigateNext";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => createStyles({
    fullHeight: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    avatarLanguage: {
        backgroundColor: `#E78FAD`,
    },
    listContainer: {
        paddingTop: theme.spacing(2),
    },
    listItem: {
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    listItemTextPrimary: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
}));

export default function SettingsPage () {
    const intl = useIntl();
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [ locale ] = useRecoilState(localeState);

    const handleBackClick = () => {
        history.goBack();
    };

    const handleSelectLanguageClick = () => {
        history.push(`/settings/select-language`);
    };

    const langText = LANGUAGES_LABEL.find((language: Language) => language.code === locale.languageCode);

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
                    <List
                        subheader={
                            <ListSubheader
                                component="div"
                                id="settings-general"
                            >
                                <FormattedMessage id="settings.general.title" />
                            </ListSubheader>
                        }
                    >
                        <ListItem
                            button
                            className={classes.listItem}
                            onClick={handleSelectLanguageClick}
                        >
                            <ListItemAvatar>
                                <Avatar className={classes.avatarLanguage}>
                                    <LanguageIcon
                                        color={`#ffffff`}
                                        size={24}
                                    />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemTextPrimary,
                                }}
                                primary={intl.formatMessage({
                                    id: `settings.general.language`,
                                })}
                                secondary={langText?.text}
                            />
                            <NextIcon
                                color={theme.palette.grey[600]}
                                size={24}
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </>
    );
}
