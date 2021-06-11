import { UserAvatar, useSnackbar } from "kidsloop-px";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";

import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";

import { useUserInformation } from "../../context-provider/user-information-context";
import { useRegionSelect } from "../../context-provider/region-select-context";
import { Header } from "../../components/header";
import { State } from "../../store/store";
import { setSelectedOrg, setSelectedUserId } from "../../store/reducers/session";
import { setSelectUserDialogOpen } from "../../store/reducers/control";
import { UserInformation } from "../../services/user/IUserInformationService";
import { List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from "@material-ui/core";
import { ParentalGate } from "../../components/parentalGate";

const useStyles = makeStyles((theme: Theme) => ({
    noPadding: {
        padding: 0
    },
    icon: {
        "&:hover": {
            color: "white"
        }
    }
}));

export function useShouldSelectUser() {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { myUsers, actions, authenticated } = useUserInformation();

    const [shouldSelectUser, setShouldSelectUser] = useState<boolean>(false);
    const [userSelectErrorCode, setUserSelectErrorCode] = useState<number>();

    const selectedUserId = useSelector((state: State) => state.session.selectedUserId);

    useEffect(() => {
        if (!authenticated) return;
        if (!myUsers) return;

        const didNotSelectUser = selectedUserId === undefined;
        const invalidUserSelected = selectedUserId && myUsers && (myUsers?.some(u => selectedUserId === u.id) === false);

        if (didNotSelectUser || invalidUserSelected) {
            if (myUsers && myUsers.length > 1) {
                setShouldSelectUser(true);
            } else {
                setShouldSelectUser(false);

                if (myUsers && myUsers.length == 1) {
                    actions?.selectUser(myUsers[0].id).then(() => {
                        dispatch(setSelectedUserId(myUsers[0].id));
                        dispatch(setSelectUserDialogOpen(false));
                    }).catch(error => {
                        console.error(error);
                        enqueueSnackbar("Unable to select user", { variant: "error" });
                    });
                }
            }
        } else {
            setShouldSelectUser(false);
        }
    }, [myUsers, selectedUserId, authenticated, actions]);

    return { userSelectErrorCode, shouldSelectUser }
}

export function SelectUserDialog() {
    const theme = useTheme();
    const { noPadding } = useStyles();

    const dispatch = useDispatch();

    const open = useSelector((state: State) => state.control.selectUserDialogOpen);

    const { myUsers } = useUserInformation();
    const { region } = useRegionSelect();
    const { actions } = useUserInformation();

    const [parentalLock, setParentalLock] = useState<boolean>(false);

    const openPrivacyPolicy = () => {
        const cordova = (window as any).cordova;
        if (!cordova) return;

        const privacyEndpoint = region?.services.privacy ?? "https://www.kidsloop.net/policies/privacy-notice/";

        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                cordova.InAppBrowser.open(privacyEndpoint, "_system", "location=no, zoom=no");
            } else {
                cordova.plugins.browsertab.openUrl(
                    privacyEndpoint,
                    (successResp: any) => { console.log(successResp) },
                    (failureResp: any) => {
                        console.error("no browser tab available");
                    }
                )
            }
        })
    }

    async function handleSignOut() {
        dispatch(setSelectUserDialogOpen(false));
        dispatch(setSelectedUserId(undefined));
        dispatch(setSelectedOrg(undefined));
        actions?.signOutUser();
    }

    useEffect(() => {
        setParentalLock(false);
    }, [open]);

    if (parentalLock) {
        return <Dialog
            aria-labelledby="select-org-dialog"
            fullScreen
            open={open}
            onClose={() => dispatch(setParentalLock(false))}
        >
            <DialogTitle
                id="select-org-dialog"
                disableTypography
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <ParentalGate onCompleted={() => { openPrivacyPolicy(); setParentalLock(false); }} />
        </Dialog>
    }

    return (
        <Dialog
            aria-labelledby="select-org-dialog"
            fullScreen
            open={open}
            onClose={() => dispatch(setSelectUserDialogOpen(false))}
        >
            <DialogTitle
                id="select-user-dialog"
                disableTypography
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <DialogContent dividers style={{ padding: 0 }}>
                <Grid item xs={12} style={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(4) }}>
                    <Typography variant="h4" align="center">
                        <FormattedMessage id="account_selectUser_whichUser" />
                    </Typography>
                </Grid>
                <UserList users={myUsers} />
            </DialogContent>
            <DialogActions className={noPadding}>
                <Grid item xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={() => { setParentalLock(true); }}
                    >
                        <Typography align="center" style={{ padding: theme.spacing(2, 0) }}>
                            <FormattedMessage id="account_selectOrg_privacyPolicy" />
                        </Typography>
                    </Link>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={() => handleSignOut()}
                    >
                        <Typography align="center" style={{ padding: theme.spacing(2, 0) }}>
                            <FormattedMessage id="account_selectOrg_signOut" />
                        </Typography>
                    </Link>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

function UserList({ users }: { users?: UserInformation[] }) {
    const { enqueueSnackbar } = useSnackbar();
    const { selectedUserProfile, actions } = useUserInformation();
    const dispatch = useDispatch();

    const selectUser = useCallback(async (userId: string) => {
        try {
            await actions?.selectUser(userId);
            dispatch(setSelectUserDialogOpen(false));
        } catch (error) {
            enqueueSnackbar("Couldn't select user.", { variant: "error" });
        }
    }, [actions]);

    const theme = useTheme();

    return (
        <List>
            {users && users.map((user) => {
                const givenName = user.givenName ?? ``;
                const familyName = user.familyName ?? ``;
                const fullName = givenName + ` ` + familyName;
                const username = user.username ?? ``;
                const userName = fullName === ` ` ? username ?? `Name undefined` : fullName;
                return <ListItem
                    key={user.id}
                    button
                    onClick={() => selectUser(user.id)}
                >
                    <ListItemAvatar>
                        <UserAvatar name={userName} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={userName}
                        secondary={userName === `Name undefined` ?
                            `Please update your profile` :
                            user.dateOfBirth ? `Birthday: ` + user.dateOfBirth : ``}
                    />
                    {user.id === selectedUserProfile?.id && (
                        <ListItemIcon>
                            <CheckIcon color={theme.palette.success.main} size={24} />
                        </ListItemIcon>
                    )}
                </ListItem>;
            })}
        </List>
    )
}
