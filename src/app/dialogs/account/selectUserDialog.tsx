import DialogParentalLock from "@/app/components/ParentalLock";
import { UserList } from "@/app/components/user/userList";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import {
    useSelectedOrganizationValue,
    useSelectedUser,
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
import OrganizationIcon from "@/assets/img/schedule-icon/organization-icon.svg";
import ParentsIcon from "@/assets/img/schedule-icon/parents-dashboard-mobile.svg";
import BackIcon from "@/assets/img/schedule-icon/schedule-back-button-mobile.svg";
import Loading from "@/components/loading";
import {
    BACK_BUTTON_HEIGHT_MEDIUM,
    BACK_BUTTON_WIDTH_MEDIUM,
    PARENTS_DASHBOARD_WIDTH_MEDIUM,
    SCHEDULE_BLACK_TEXT,
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    THEME_BACKGROUND_JOIN_APP,
    THEME_COLOR_LIGHT_BLACK_TEXT,
} from "@/config";
import { useQueryClient } from "@kl-engineering/cms-api-client";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    alpha,
    Box,
    Typography,
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
import { History } from "history";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
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
            padding: theme.spacing(0.5, 3),
            background: theme.palette.common.white,
        },
        orgText: {
            fontWeight: theme.typography.fontWeightBold as number,
            textAlign: `center`,
            color: THEME_COLOR_LIGHT_BLACK_TEXT,
            marginLeft: theme.spacing(1),
            display: `-webkit-box`,
            overflow: `hidden`,
            WebkitBoxOrient: `vertical`,
            WebkitLineClamp: 1,
            maxWidth: `30vw`,
            [theme.breakpoints.down(`sm`)]: {
                fontSize: `1rem`,
            },
        },
        content: {
            padding: 0,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
        },
        selectLoading: {
            backgroundColor: alpha(THEME_BACKGROUND_JOIN_APP, 0.6),
            position: `absolute`,
            width: `100%`,
            height: `100%`,
            bottom: 5,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
        },
        titleWrapper: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            flexDirection: `row`,
            paddingTop: theme.spacing(16),
            paddingBottom: theme.spacing(5),
            [theme.breakpoints.down(`sm`)]: {
                paddingTop: theme.spacing(1.5),
                paddingBottom: theme.spacing(1),
            },
        },
        title: {
            fontWeight: theme.typography.fontWeightBold as number,
            textAlign: `center`,
            color: SCHEDULE_BLACK_TEXT,
            fontSize: `1.3rem`,
            [theme.breakpoints.up(`md`)]: {
                fontSize: `1.75rem`,
            },
        },
        switchIcon: {
            width: 30,
            marginRight: theme.spacing(2),
            [theme.breakpoints.down(`sm`)]: {
                width: 25,
            },
        },
        backButton: {
            [theme.breakpoints.up(`md`)]: {
                width: BACK_BUTTON_WIDTH_MEDIUM,
                height: BACK_BUTTON_HEIGHT_MEDIUM,
            },
        },
        parentsDashboardIcon: {
            [theme.breakpoints.up(`md`)]: {
                width: PARENTS_DASHBOARD_WIDTH_MEDIUM,
                height: PARENTS_DASHBOARD_WIDTH_MEDIUM,
            },
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

interface Props{
    history: History<unknown>;
}

export function SelectUserDialog ({ history }: Props) {
    const classes = useStyles();

    const dialogs = useRecoilValue(dialogsState);
    const setDialogs = useSetRecoilState(dialogsState);

    const { data: myUsersData } = useMyUsersQuery();
    const { data: meData } = useMeQuery();
    const [ selectedUser, setSelectedUser ] = useSelectedUser();
    const [ selectLoading, setSelectLoading ] = useState(false);
    const cmsQueryClient = useQueryClient();

    const [ filteredMyUsersData, setFilteredMyUsersData ] = useState<ReadUserDto[]>();
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);
    const selectedOrganization = useSelectedOrganizationValue();

    useEffect(() => {
        if (dialogs.isSelectUserOpen) return;
        setSelectLoading(false);
    }, [ dialogs.isSelectUserOpen ]);

    useEffect(() => {
        cmsQueryClient.getQueryCache()
            .clear();
        cmsQueryClient.getMutationCache()
            .clear();
    }, [ meData ]);

    useEffect(() => {
        const studentProfiles = myUsersData?.my_users.filter((user) => user.organizationsWithPermission.some((organizationMembership) => organizationMembership.status === EntityStatus.ACTIVE));

        setFilteredMyUsersData(studentProfiles);
    }, [ myUsersData ]);

    const selectUser = (user: ReadUserDto) => {
        if (selectedUser?.user_id === user.user_id) {
            handleBackClick();
        }else{
            setSelectLoading(true);
            setSelectedUser(user);
            setSelectOrgAfterSwitchingProfile(true);
        }
    };

    const handleBackClick = () => {
        setDialogs({
            ...dialogs,
            isSelectUserOpen: false,
        });
        if(!selectedUser || !selectedOrganization){
            history.push(`/select-user-role`);
        }
    };

    const handleParentsClick = () => {
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
                    setDialogs({
                        ...dialogs,
                        isSelectUserOpen: false,
                        isParentalLockOpen: false,
                    });
                    history.push(`/parent-dashboard`);
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
                        className={classes.backButton}
                        src={BackIcon}
                        onClick={handleBackClick}
                    />
                    {selectedOrganization &&
                    <Box
                        className={classes.selectOrg}
                        onClick={handleSelectOrg}
                    >
                        <img
                            alt="organization icon"
                            src={OrganizationIcon}
                            className={classes.parentsDashboardIcon}
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
                    className={classes.parentsDashboardIcon}
                    onClick={handleParentsClick}
                />
            </Box>
            <DialogContent className={classes.content}>
                <Box className={classes.titleWrapper}>
                    <Typography
                        className={classes.title}
                        variant="subtitle2"
                    >
                        <FormattedMessage
                            id={`account_selectUser_whichUser`}
                            defaultMessage="Switch profile"
                        />
                    </Typography>
                </Box>
                {selectLoading ? (
                    <Box className={classes.selectLoading}>
                        <Loading />
                    </Box>
                ): (
                    <UserList
                        users={filteredMyUsersData ?? []}
                        selectedUser={meData?.me}
                        onClick={user => selectUser(user)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
