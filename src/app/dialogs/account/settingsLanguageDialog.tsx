import { Header } from "@/app/components/layout/header";
import {
    dialogsState,
    localeState,
} from "@/app/model/appModel";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from '@material-ui/core/Grid';
import {
    makeStyles,
    useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles(() => ({
    noPadding: {
        padding: 0,
    },
    icon: {
        "&:hover": {
            color: `white`,
        },
    },
}));

export function SettingsLanguageDialog () {
    const theme = useTheme();
    const intl = useIntl();
    const { noPadding } = useStyles();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ locale, setLocale ] = useRecoilState(localeState);

    return (
        <Dialog
            fullScreen
            aria-labelledby="settings-language-dialog"
            open={dialogs.isSettingsLanguageOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isSettingsLanguageOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="settings-language-dialog"
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <DialogContent
                dividers
                style={{
                    padding: 0,
                }}>
                <Grid
                    item
                    xs={12}
                    style={{
                        paddingTop: theme.spacing(2),
                        paddingBottom: theme.spacing(4),
                    }}>
                    <Typography
                        variant="h4"
                        align="center">
                        <FormattedMessage id="settings.language.title" />
                    </Typography>
                    <List>
                        {LANGUAGES_LABEL.map((language) => {
                            const selected = locale.languageCode === language.code;

                            return(
                                <ListItem
                                    key={language.code}
                                    button
                                    onClick={() => setLocale({
                                        ...locale,
                                        languageCode: language.code,
                                    })}
                                >
                                    <ListItemText>{language.text}</ListItemText>
                                    {selected &&
                                        <ListItemIcon>
                                            <CheckIcon
                                                color={theme.palette.success.main}
                                                size={24} />
                                        </ListItemIcon>
                                    }
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
