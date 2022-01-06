import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState } from "@/app/model/appModel";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

export default function SelectLanguagePage () {
    const theme = useTheme();
    const history = useHistory();

    const [ locale, setLocale ] = useRecoilState(localeState);

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar leading={<BackButton onClick={handleBackClick} />} />
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
        </>
    );
}
