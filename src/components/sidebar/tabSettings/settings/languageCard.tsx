
import LanguageSelect from "@/components/languageSelect";
import { THEME_COLOR_BACKGROUND_DEFAULT } from "@/config";
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        background: theme.palette.background.paper,
        borderRadius: 12,
    },
    head:{
        padding: theme.spacing(2),
        borderBottom: `1px solid ${THEME_COLOR_BACKGROUND_DEFAULT}`,
        textAlign: `center`,
    },
    body:{
        padding: theme.spacing(2),
    },
}));

function LanguageCard () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.root}>
            <Grid
                item
                className={classes.head}>
                <Typography variant="h5">
                    <FormattedMessage id="settings_language_title" />
                </Typography>
            </Grid>
            <Grid
                item
                xs
                className={classes.body}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Typography>
                                    <FormattedMessage id="settings_language_select_language" />
                                </Typography>
                            </td>
                            <td><LanguageSelect /></td>
                        </tr>
                    </tbody>
                </table>

            </Grid>
        </Grid>
    );
}

export default LanguageCard;
