import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import {
    dialogsState,
    shouldClearCookieState,
} from "@/app/model/appModel";
import BackIcon from "@/assets/img/back_icon.svg";
import NoOrgFoundLogo from "@/assets/img/not_found.svg";
import { TEXT_COLOR_SECONDARY_DEFAULT } from "@/config";
import {
    Button,
    Dialog,
    Grid,
    Theme,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: theme.spacing(4),
    },
    content: {
        textAlign: `center`,
        paddingTop: theme.spacing(3),
    },
    titleText: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        fontWeight: theme.typography.fontWeightBold as number,
        color: TEXT_COLOR_SECONDARY_DEFAULT,
    },
    noOrgIcon: {
        marginLeft: theme.spacing(6),
    },
    goBackContainer: {
        position: `absolute`,
        bottom: theme.spacing(16),
        left: 0,
        right: 0,
    },
}));

export function NoOrgDialog (): JSX.Element {
    const { actions } = useAuthenticationContext();
    const classes = useStyles();
    const dialogs = useRecoilValue(dialogsState);
    const setDialogs = useSetRecoilState(dialogsState);
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);

    return (
        <Dialog
            fullScreen
            open={dialogs.isShowNoOrgProfile}
            onClose={() => setDialogs({
                ...dialogs,
                isShowNoOrgProfile: false,
            })}>
            <Grid
                container
                className={classes.container}
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <img
                        className={classes.noOrgIcon}
                        alt="No Organization Found Logo"
                        src={NoOrgFoundLogo}
                    />
                </Grid>
                <Grid item>
                    <Typography
                        className={classes.titleText}
                        variant="h4">
                        <FormattedMessage id="signIn.noOrganization.title" />
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        style={{
                            color: TEXT_COLOR_SECONDARY_DEFAULT,
                        }}>
                        <FormattedMessage id="signIn.noOrganization.body" />
                    </Typography>
                </Grid>
                <Grid
                    item
                    style={{
                        textAlign: `center`,
                    }}>
                    <div className={classes.goBackContainer}>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => {
                                actions?.signOut();
                                setShouldClearCookie(true);
                            }}>
                            <img
                                alt="No Organization Found Back"
                                src={BackIcon}
                                style={{
                                    marginRight: 2,
                                }}
                            />
                            <FormattedMessage id="common.goBack" />
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Dialog>
    );
}
