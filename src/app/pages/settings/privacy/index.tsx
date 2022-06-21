import AppBar from "@/app/components/layout/AppBar";
import DialogParentalLock from "@/app/components/ParentalLock";
import BackButton from "@/app/components/layout/BackButton";
import { useOpenLink } from "@/app/utils/openLinkUtils";
import { dialogsState } from "@/app/model/appModel";
import { 
    THEME_COLOR_BACKGROUND_LIST, TEXT_COLOR_SIGN_OUT, COLOR_ORG_ICON_DEFAULT,
} from "@/config";
import {
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { Theme } from '@mui/material/styles';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router";

enum PrivacyItem{
    PRIVACY_POLICY,
    COOKIES_POLICY,
    TERMS_OF_USE,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    fullHeight: {
        height: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_LIST,
    },
    listContainer: {
        padding: theme.spacing(2),
    },
    listItem: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(1.5),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1.5, 2.5),
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
    },
    listItemTextPrimary: {
        color: TEXT_COLOR_SIGN_OUT,
        fontWeight: theme.typography.fontWeightMedium as number,
    },
}));

export default function PrivacyPage () {
    const intl = useIntl();
    const classes = useStyles();
    const history = useHistory();
    const { openPrivacyPolicy, openCookiesPolicy, openTermsOfUse } = useOpenLink();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ privacyItemSelected, setPrivacyItemSelected ] = useState<PrivacyItem>();

    const privacyArray = [
        {
            id: PrivacyItem.PRIVACY_POLICY,
            primary: `account_selectOrg_privacyPolicy`,
        },
        // {
        //     id: PrivacyItem.COOKIES_POLICY,
        //     primary: `hamburger.settings.cookiesPolicy`,
        // },
        {
            id: PrivacyItem.TERMS_OF_USE,
            primary: `hamburger.settings.about.termsOfUse`,
        },
    ];

    const handleBackClick = () => {
        history.goBack();
    };

    const handlePrivacyItemsClick = (id: PrivacyItem) => {
        switch (id){
            case PrivacyItem.PRIVACY_POLICY: 
                openPrivacyPolicy();
                break;
            case PrivacyItem.COOKIES_POLICY:
                openCookiesPolicy();
                break;
            case PrivacyItem.TERMS_OF_USE:
                openTermsOfUse();
                break;
            default:
                break;
        }
    }

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    useEffect(() => {
        setParentalLock(false);
    }, []);

    if (dialogs.isParentalLockOpen && privacyItemSelected !== undefined) {
        return (
            <DialogParentalLock
                onCompleted={() => {
                    setParentalLock(false);
                    handlePrivacyItemsClick(privacyItemSelected);
                    setPrivacyItemSelected(undefined);
                }}
            />
        );
    }

    return (
        <>
            <AppBar
                title={intl.formatMessage({
                    id: `hamburger.settings.about.privacy`,
                    defaultMessage: `Privacy`,
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
                    <List>
                        {privacyArray.map((item) => (
                        <ListItem
                            key={item.id}
                            button
                            className={classes.listItem}
                            onClick={() => {
                                setParentalLock(true);
                                setPrivacyItemSelected(item.id);
                            }}>
                            <ListItemText
                                classes={{
                                    primary: classes.listItemTextPrimary,
                                }}
                                primary={intl.formatMessage({
                                    id: item.primary,
                                })}
                            />
                            <ArrowRight
                                color={COLOR_ORG_ICON_DEFAULT}
                                size={24}
                            />
                        </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </>
    );
}
