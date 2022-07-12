import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import { ParentDashboardUserListItem } from "@/app/components/parent-dashboard/parentDashboardUserListItem";
import { CordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import {
    useSelectedOrganization,
    useSelectedUser,
} from "@/app/data/user/atom";
import {
    ReadUserDto,
    RoleType,
} from "@/app/data/user/dto/readUserDto";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { useMyUsersQuery } from "@/app/data/user/queries/myUsersQuery";
import { useShouldSelectUser } from "@/app/dialogs/account/selectUserDialog";
import { SelectOrgForParentDialog } from "@/app/dialogs/parent-dashboard/selectOrgForParentDialog";
import {
    isSelectOrgParentDialogOpenState,
    selectOrgAfterSwitchingProfile,
    selectOrgFromParentDashboardState,
} from "@/app/model/appModel";
import BackButton from "@/assets/img/parent-dashboard/back_icon_parents.svg";
import SettingButton from "@/assets/img/parent-dashboard/setting_icon_parents.svg";
import {
    THEME_BACKGROUND_SELECT_DIALOG,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ORG_MENU_DRAWER,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import { ClassType } from "@/store/actions";
import { changeStatusBarColor } from "@/utils/utils";
import {
    Box,
    List,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => ({
    root: {
        height: `100%`,
        display: `flex`,
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        flexDirection: `column`,
    },
    listRoot: {
        padding: theme.spacing(1, 2),
        width: `100%`,
        height: `100%`,
        flex: 1,
        overflowY: `scroll`,
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(4, 10),
        },
    },
    header: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        paddingBottom: theme.spacing(4),
        textAlign: `center`,
        lineHeight: 1.5,
    },
    buttonSettings: {
        borderRadius: `100%`,
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
        padding: theme.spacing(0.5),
    },
}));

const PARENT_DASHBOARD_BACK_ID = `parentDashboardBackId`;

export function ParentDashboardPage () {
    const classes = useStyles();
    const intl = useIntl();
    const history = useHistory();

    const [ classType, setClassType ] = useState<ClassType>(ClassType.LIVE);
    const [ filteredMyUsersData, setFilteredMyUsersData ] = useState<ReadUserDto[]>();
    const [ isInitState, setIsInitState ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ isSelectOrgParentDialogOpen, setIsSelectOrgParentDialogOpen ] = useRecoilState(isSelectOrgParentDialogOpenState);
    const [ isSelectOrgFromParentDashboard, setIsSelectOrgFromParentDashboard ] = useRecoilState(selectOrgFromParentDashboardState);
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);
    const { addOnBack, removeOnBack } = useContext(CordovaSystemContext);
    const [ selectedUser, setSelectedUser ] = useSelectedUser();
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();

    const { shouldSelectUser } = useShouldSelectUser();
    const { data: myUsersData } = useMyUsersQuery();
    const { data: meData } = useMeQuery();

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);

    const selectUser = useCallback((user: ReadUserDto, classType: ClassType) => {
        setIsLoading(true);
        setClassType(classType);
        setIsInitState(false);
        setSelectedUser(user);
        if (user.user_id !== meData?.me?.user_id) return;
        if (activeOrganizations.length > 1) {
            setIsSelectOrgParentDialogOpen(true);
        } else {
            onOrgClicked(classType);
        }
    }, [ activeOrganizations, meData ]);

    useEffect(() => {
        if (selectedUser?.user_id !== meData?.me?.user_id) return;
        setIsLoading(false);
    }, [
        selectedUser,
        meData?.me?.user_id,
        shouldSelectUser,
    ]);

    useEffect(() => {
        if (isInitState || isLoading) return;

        if (activeOrganizations.length === 1) {
            const membership = activeOrganizationMemberships[0];
            setSelectedOrganization(membership.organization);
            onOrgClicked(classType);
        } else {
            setIsSelectOrgParentDialogOpen(true);
        }
    }, [
        isLoading,
        classType,
        isInitState,
        setSelectedOrganization,
    ]);

    useEffect(() => {
        setIsSelectOrgFromParentDashboard(true);
        setSelectOrgAfterSwitchingProfile(false);
        changeStatusBarColor(THEME_COLOR_ORG_MENU_DRAWER);
    }, []);

    useEffect(() => {
        const studentProfiles = myUsersData?.my_users.filter((user) => user.organizationsWithPermission.some((organizationMembership) => organizationMembership.roles.some((role) => role.role_name.toLowerCase() === RoleType.STUDENT)));
        setFilteredMyUsersData(studentProfiles ?? []);
    }, [ myUsersData ]);

    useEffect(() => {
        if (isSelectOrgFromParentDashboard) {
            addOnBack?.({
                id: PARENT_DASHBOARD_BACK_ID,
                onBack: handleBackClick,
            });
        } else {
            removeOnBack?.(PARENT_DASHBOARD_BACK_ID);
        }
    }, [ isSelectOrgFromParentDashboard ]);

    const onOrgClicked = (classType: ClassType) => {
        setIsSelectOrgParentDialogOpen(false);
        switch (classType) {
        case ClassType.LIVE:
            history.push(`/schedule/category-live`);
            break;
        case ClassType.REPORT:
            history.push(`/report/parent-dashboard`);
            break;
        default:
            history.push(`/schedule/category-study/${classType}`);
            break;
        }
        setIsSelectOrgFromParentDashboard(false);
        changeStatusBarColor(THEME_COLOR_BACKGROUND_PAPER);
    };

    const handleBackClick = () => {
        setIsSelectOrgFromParentDashboard(false);
        if(!(selectedOrganization && selectedUser)){
            history.push(`/select-user-role`);
            return;
        }
        history.goBack();
    };

    const handleSettingsClick = () => {
        setIsSelectOrgFromParentDashboard(false);
        history.push(`/settings`);
    };

    return (
        <Box className={classes.root}>
            <AppBar
                title={intl.formatMessage({
                    id: `hamburger.parentsDashboard`,
                    defaultMessage: `Parent Dashboard`,
                })}
                style={AppBarStyle.ROUNDED}
                leading={(
                    <img
                        src={BackButton}
                        alt="back button"
                        onClick={handleBackClick}
                    />
                )}
                trailing={(
                    <img
                        className={classes.buttonSettings}
                        src={SettingButton}
                        alt="setting button"
                        width={15}
                        height={15}
                        onClick={handleSettingsClick}
                    />
                )}
            />
            <List
                disablePadding
                className={classes.listRoot}
            >
                {filteredMyUsersData?.map((user) =>
                    (
                        <ParentDashboardUserListItem
                            key={user.user_id}
                            user={user}
                            onSelectClassType={selectUser}
                        />
                    ))}
            </List>
            <SelectOrgForParentDialog
                open={isSelectOrgParentDialogOpen}
                onOrgClicked={() => onOrgClicked(classType)}
                onBackClick={() => setIsSelectOrgParentDialogOpen(false)}
            />
        </Box>
    );
}
