import { Header } from "@/app/components/layout/header";
import {
    dialogsState,
    localeState,
} from "@/app/model/appModel";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
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
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

export function SettingsDialog () {
    const theme = useTheme();
    const intl = useIntl();
    const {
        noPadding,
        avatarLanguage,
        listItemTextPrimary,
        fullHeight,
    } = useStyles();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ locale ] = useRecoilState(localeState);
    const langText = LANGUAGES_LABEL.find((language:Language) => language.code === locale.languageCode);

    return (
        <Dialog
            fullScreen
            aria-labelledby="settings-dialog"
            open={dialogs.isSettingsOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isSettingsOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="settings-dialog"
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
                    container
                    alignContent="space-between"
                    className={fullHeight}>
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
                                onClick={() => setDialogs({
                                    ...dialogs,
                                    isSettingsLanguageOpen: true,
                                })}>
                                <ListItemAvatar>
                                    <Avatar className={avatarLanguage}>
                                        <LanguageIcon
                                            color={`#ffffff`}
                                            size={24} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    classes={{
                                        primary: listItemTextPrimary,
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
            </DialogContent>
        </Dialog>
    );
}
