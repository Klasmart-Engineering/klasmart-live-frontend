import { Header } from "@/app/components/layout/header";
import { UserList } from "@/app/components/user/userList";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import {
    useSelectedUser,
    useSetSelectedUser,
} from "@/app/data/user/atom";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { useMyUsersQuery } from "@/app/data/user/queries/myUsersQuery";
import { ParentalGate } from "@/app/dialogs/parentalGate";
import { dialogsState } from "@/app/model/appModel";
import { useDisplayPrivacyPolicy } from "@/app/utils/privacyPolicyUtils";
import { useQueryClient } from "@kidsloop/cms-api-client";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';
import Link from "@material-ui/core/Link";
import {
    makeStyles,
    useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from "kidsloop-px";
import React,
{
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

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

export function useShouldSelectUser () {
    const { enqueueSnackbar } = useSnackbar();

    const { authenticated } = useAuthenticationContext();
    const { authenticationService } = useServices();

    const [ shouldSelectUser, setShouldSelectUser ] = useState<boolean>(false);

    const {
        data: meData,
        loading: meLoading,
        refetch,
    } = useMeQuery({
        skip: !authenticated,
    });
    const { data: myUsersData, loading: myUsersLoading } = useMyUsersQuery({
        skip: !authenticated,
    });
    const loading = useMemo(() => meLoading || myUsersLoading, [ meLoading, myUsersLoading ]);

    const [ selectedUser, setSelectedUser ] = useSelectedUser();

    const selectedValidUser = useMemo(() => {
        return selectedUser &&
            meData?.me?.user_id === selectedUser.user_id &&
            myUsersData?.my_users?.some(user => selectedUser.user_id === user.user_id);
    }, [
        selectedUser,
        myUsersData,
        meData,
    ]);

    const switchUser = useCallback(async (selectUser: ReadUserDto) => {
        try {
            await authenticationService?.switchUser(selectUser.user_id);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`Unable to select user`, {
                variant: `error`,
            });

            return;
        }
        await refetch();
    }, [
        authenticationService,
        enqueueSnackbar,
        refetch,
    ]);

    const selectUser = useCallback((selectUser: ReadUserDto) => {
        setSelectedUser(selectUser);
    }, [ setSelectedUser ]);

    useEffect(() => {
        if (!selectedUser || meLoading || !authenticated) return;

        if (selectedUser.user_id !== meData?.me?.user_id) {
            console.log(`switching to user ${selectedUser.user_id}, meLoading: ${meLoading}`);
            switchUser(selectedUser);
        }
    }, [
        authenticated,
        selectedUser,
        meData,
        selectUser,
        meLoading,
        switchUser,
    ]);

    useEffect(() => {
        if (!authenticated) return;
        if (!myUsersData) return;
        if (loading) return;

        if (!selectedValidUser) {
            if (myUsersData.my_users.length > 1) {
                setShouldSelectUser(true);
                return;
            }

            selectUser(myUsersData.my_users[0]);
        } else {
            setShouldSelectUser(false);
        }
    }, [
        myUsersData,
        selectedValidUser,
        authenticated,
        authenticationService,
        loading,
        selectUser,
    ]);

    return {
        selectedValidUser,
        shouldSelectUser,
        loading,
    };
}

export function SelectUserDialog () {
    const theme = useTheme();
    const { noPadding } = useStyles();

    const { actions } = useAuthenticationContext();
    const dialogs = useRecoilValue(dialogsState);
    const setDialogs = useSetRecoilState(dialogsState);

    const { data: myUsersData } = useMyUsersQuery();
    const { data: meData } = useMeQuery();
    const setSelectedUser = useSetSelectedUser();

    const [ parentalLock, setParentalLock ] = useState<boolean>(false);

    const displayPrivacyPolicy = useDisplayPrivacyPolicy();
    const cmsQueryClient = useQueryClient();

    const selectUser = useCallback((user: ReadUserDto) => {
        cmsQueryClient.getQueryCache().clear();
        cmsQueryClient.getMutationCache().clear();
        console.log(`selecting user: ${user.user_id}`);
        setSelectedUser(user);
    }, [ setSelectedUser ]);

    useEffect(() => {
        setParentalLock(false);
    }, []);

    if (parentalLock) {
        return <Dialog
            fullScreen
            aria-labelledby="select-user-dialog"
            open={dialogs.isSelectUserOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isParentalLockOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="select-user-dialog"
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <ParentalGate onCompleted={() => {
                displayPrivacyPolicy();
                setParentalLock(false);
            }} />
        </Dialog>;
    }

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-user-dialog"
            open={dialogs.isSelectUserOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isSelectUserOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="select-user-dialog"
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
                        <FormattedMessage id="account_selectUser_whichUser" />
                    </Typography>
                </Grid>
                <UserList
                    users={myUsersData?.my_users ?? []}
                    selectedUser={meData?.me}
                    onClick={user => selectUser(user)}
                />
            </DialogContent>
            <DialogActions className={noPadding}>
                <Grid
                    item
                    xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={() => { setParentalLock(true); }}
                    >
                        <Typography
                            align="center"
                            style={{
                                padding: theme.spacing(2, 0),
                            }}>
                            <FormattedMessage id="account_selectOrg_privacyPolicy" />
                        </Typography>
                    </Link>
                </Grid>
                <Divider
                    flexItem
                    orientation="vertical" />
                <Grid
                    item
                    xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={() => actions?.signOut()}
                    >
                        <Typography
                            align="center"
                            style={{
                                padding: theme.spacing(2, 0),
                            }}>
                            <FormattedMessage id="account_selectOrg_signOut" />
                        </Typography>
                    </Link>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}
