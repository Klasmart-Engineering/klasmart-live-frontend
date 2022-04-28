import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { UserList } from "@/app/components/user/userList";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import {
    useSelectedUser,
    useSelectedOrganizationValue,
} from "@/app/data/user/atom";
import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { useMyUsersQuery } from "@/app/data/user/queries/myUsersQuery";
import {
    dialogsState,
    selectOrgAfterSwitchingProfile,
    shouldShowNoOrgProfileState,
    shouldShowNoStudentRoleState,
} from "@/app/model/appModel";
import { THEME_BACKGROUND_SELECT_DIALOG } from "@/config";
import { useQueryClient } from "@kl-engineering/cms-api-client";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from '@material-ui/core/styles';
import React,
{
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => ({
    content: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
    },
}));

export function useShouldSelectUser () {
    const { enqueueSnackbar } = useSnackbar();

    const { authenticated } = useAuthenticationContext();
    const { authenticationService } = useServices();

    const [ shouldSelectUser, setShouldSelectUser ] = useState<boolean>(false);
    const setShouldShowNoOrgProfile = useSetRecoilState(shouldShowNoOrgProfileState);
    const setShouldShowNoStudentRole = useSetRecoilState(shouldShowNoStudentRoleState);

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

    const [ filteredMyUsersData, setFilteredMyUsersData ] = useState<ReadUserDto[]>();

    useEffect(() => {
        const studentProfiles = myUsersData?.my_users.filter((user) => user.organizationsWithPermission.some((organizationMembership) => organizationMembership.status === EntityStatus.ACTIVE));

        setFilteredMyUsersData(studentProfiles);
    }, [ myUsersData ]);

    const selectedValidUser = useMemo(() => {
        return selectedUser &&
            meData?.me?.user_id === selectedUser.user_id &&
            filteredMyUsersData?.some(user => selectedUser.user_id === user.user_id);
    }, [
        selectedUser,
        filteredMyUsersData,
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
        if (!filteredMyUsersData) return;
        if (!myUsersData) return;
        if (loading) return;

        if (!selectedValidUser) {
            if (filteredMyUsersData.length === 0 && myUsersData.my_users.length > 0) {
                setShouldSelectUser(false);
                setShouldShowNoStudentRole(true);
                return;
            } else if (myUsersData.my_users.length === 0) {
                setShouldSelectUser(false);
                setShouldShowNoOrgProfile(true);
                return;
            }
            if (myUsersData.my_users.length > 1) {
                setShouldSelectUser(true);
                setShouldShowNoOrgProfile(false);
                setShouldShowNoStudentRole(false);
                return;
            }

            selectUser(filteredMyUsersData[0]);
            setShouldSelectUser(false);
        } else {
            setShouldSelectUser(false);
        }
    }, [
        filteredMyUsersData,
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
    const classes = useStyles();
    const intl = useIntl();

    const dialogs = useRecoilValue(dialogsState);
    const setDialogs = useSetRecoilState(dialogsState);

    const { data: myUsersData } = useMyUsersQuery();
    const { data: meData } = useMeQuery();
    const [selectedUser, setSelectedUser ] = useSelectedUser();
    const selectedOrganization = useSelectedOrganizationValue();
    const cmsQueryClient = useQueryClient();

    const [ filteredMyUsersData, setFilteredMyUsersData ] = useState<ReadUserDto[]>();
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);

    const selectUser = useCallback((user: ReadUserDto) => {
        console.log(`selecting user: ${user.user_id}`);
        setSelectedUser(user);
    }, [ setSelectedUser ]);

    useEffect(() => {
        cmsQueryClient.getQueryCache().clear();
        cmsQueryClient.getMutationCache().clear();
    }, [ meData ]);

    useEffect(() => {
        const studentProfiles = myUsersData?.my_users.filter((user) => user.organizationsWithPermission.some((organizationMembership) => organizationMembership.status === EntityStatus.ACTIVE));

        setFilteredMyUsersData(studentProfiles);
    }, [ myUsersData ]);

    const handleBackClick = () => {
        setSelectOrgAfterSwitchingProfile(false);
        setDialogs({
            ...dialogs,
            isSelectUserOpen: false,
        });
    };

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-user-dialog"
            open={dialogs.isSelectUserOpen}
            onClose={handleBackClick}
        >
            <AppBar
                title={intl.formatMessage({
                    id: `account_selectUser`,
                    defaultMessage: `Select a Profile`,
                })}
                leading={!!(selectedUser && selectedOrganization)  && <BackButton onClick={handleBackClick} />}
            />
            <DialogContent className={classes.content}>
                <UserList
                    users={filteredMyUsersData ?? []}
                    selectedUser={meData?.me}
                    onClick={user => selectUser(user)}
                />
            </DialogContent>
        </Dialog>
    );
}
