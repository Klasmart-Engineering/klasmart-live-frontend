import DialogParentalLock from "@/app/components/ParentalLock";
import { UserList } from "@/app/components/user/userList";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import { useSetSelectedUser, useSelectedUser, useSelectedOrganizationValue } from "@/app/data/user/atom";
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
import ParentsIcon from "@/assets/img/profile-org-selection/parents_icon_button.svg";
import BackIcon from "@/assets/img/profile-org-selection/student_arrow_button.svg";
import { THEME_BACKGROUND_JOIN_APP, THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";
import { useQueryClient } from "@kl-engineering/cms-api-client";
import { OrganizationAvatar, useSnackbar } from "@kl-engineering/kidsloop-px";
import { Box, Typography } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React,
{
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    root: {
        backgroundColor: THEME_BACKGROUND_JOIN_APP,
    },
    header: {
        width: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `space-between`,
        padding: theme.spacing(2, 2, 0),
    },
    headerLeft: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `row`,
    },
    selectOrg: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `row`,
        margin: theme.spacing(0, 1.5),
        borderRadius: theme.spacing(4),
        padding: theme.spacing(1, 3),
        background: theme.palette.common.white,
    },
    orgText: {
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,  
        marginLeft: theme.spacing(1), 
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 1,
        maxWidth: `30vw`,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1.15rem`,
        },
    },
    content: {
        padding: 0,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
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

export function SelectUserDialog ({ history }:any) {
    const classes = useStyles();

    const dialogs = useRecoilValue(dialogsState);
    const setDialogs = useSetRecoilState(dialogsState);

    const { data: myUsersData } = useMyUsersQuery();
    const { data: meData } = useMeQuery();
    const setSelectedUser = useSetSelectedUser();
    const cmsQueryClient = useQueryClient();

    const [ filteredMyUsersData, setFilteredMyUsersData ] = useState<ReadUserDto[]>();
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);
    const selectedOrganization = useSelectedOrganizationValue();

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

    const handleParentsClick = () => {
        setSelectOrgAfterSwitchingProfile(false);
        setDialogs({
            ...dialogs,
            isParentalLockOpen: true,
        });
    };

    const handleSelectOrg = () => {
        if(activeOrganizations.length < 2) return;
        setDialogs({
            ...dialogs,
            isSelectOrganizationOpen: true,
            isSelectUserOpen: false,
        });
    };

    if(dialogs.isParentalLockOpen && dialogs.isSelectUserOpen){
        return (
            <DialogParentalLock
                onCompleted={() => {
                    history.push(`/report/parent-dashboard`);
                    setDialogs({
                        ...dialogs,
                        isSelectUserOpen: false,
                        isParentalLockOpen: false,
                    });
                }}
            />
        );
    }

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-user-dialog"
            open={dialogs.isSelectUserOpen}
            classes={{
                paper: classes.root,
            }}
            onClose={handleBackClick}
        >
            <Box className={classes.header}>
                <Box className={classes.headerLeft}>
                    <img
                        alt="back icon"
                        src={BackIcon}
                        width={50}
                        onClick={handleBackClick}
                    />
                    {selectedOrganization &&
                    <Box className={classes.selectOrg}  onClick={handleSelectOrg}>
                        <OrganizationAvatar
                            name={selectedOrganization?.organization_name ?? ``}
                            size="medium"
                        />
                        <Typography
                            className={classes.orgText}
                            variant="h5"
                        >
                            {selectedOrganization?.organization_name}
                        </Typography>
                    </Box>
                    }
                </Box>
                <img
                    alt="parent dashboard icon"
                    src={ParentsIcon}
                    width={50}
                    onClick={handleParentsClick}
                />
            </Box>
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
