import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState } from "@/app/model/appModel";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
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
import Typography from '@material-ui/core/Typography';
import { NavigateNext as NextIcon } from "@styled-icons/material/NavigateNext";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import { Language } from "kidsloop-px/dist/types/components/LanguageSelect";
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
    },
    noPadding: {
        padding: 0,
    },
    icon: {
        "&:hover": {
            color: `white`,
        },
    },
    avatarLanguage: {
        backgroundColor: `#E78FAD`,
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

    const langText = LANGUAGES_LABEL.find((language:Language) => language.code === locale.languageCode);

    return (
        <>
            <AppBar leading={<BackButton onClick={handleBackClick} />} />
            <Grid
                container
                alignContent="space-between"
                className={classes.fullHeight}>
                <Grid
                    item
                    xs={12}>
                    <div style={{
                        paddingTop: theme.spacing(2),
                        paddingBottom: theme.spacing(4),
                    }}>
                        <Typography
                            variant="h4"
                            align="center">
                            <FormattedMessage id="settings.title" />
                        </Typography>
                    </div>
                    <List
                        subheader={
                            <ListSubheader
                                component="div"
                                id="settings-general">
                                <FormattedMessage id="settings.general.title" />
                            </ListSubheader>
                        }>
                        <ListItem
                            button
                            onClick={handleSelectLanguageClick}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatarLanguage}>
                                    <LanguageIcon
                                        color={`#ffffff`}
                                        size={24} />
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
                                size={24} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </>
    );
}
