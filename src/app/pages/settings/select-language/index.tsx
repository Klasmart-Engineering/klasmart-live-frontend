import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { localeState } from "@/app/model/appModel";
import { LANGUAGES_LABEL } from "@/localization/localeCodes";
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Check as CheckIcon } from "@styled-icons/bootstrap/Check";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    listItemSelected: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    divider: {
        margin: theme.spacing(0, 2),
    },
    listContainer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    checkIcon: {
        color: theme.palette.success.main,
        margin: `0 auto`,
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

    return (
        <>
            <AppBar
                showTitleInAppbar={intl.formatMessage({
                    id: `settings.language.title`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <Grid
                item
                xs={12}
            >
                <List className={classes.listContainer}>
                    {LANGUAGES_LABEL.map((language) => {
                        const isSelected = locale.languageCode === language.code;

                        return(
                            <>
                                <ListItem
                                    key={language.code}
                                    button
                                    className={classes.root}
                                    onClick={() => setLocale({
                                        ...locale,
                                        languageCode: language.code,
                                    })}
                                >
                                    <ListItemText
                                        primary={language.text}
                                        primaryTypographyProps={{
                                            className: clsx({
                                                [classes.listItemSelected] : isSelected,
                                            }),
                                        }}
                                    />
                                    {isSelected &&
                                        <ListItemIcon>
                                            <CheckIcon
                                                className={classes.checkIcon}
                                                size={36} />
                                        </ListItemIcon>
                                    }
                                </ListItem>
                                <Divider className={classes.divider} />
                            </>
                        );
                    })}
                </List>
            </Grid>
        </>
    );
}
