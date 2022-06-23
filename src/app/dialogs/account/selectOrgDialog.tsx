import { OrganizationList } from "@/app/components/organization/organizationList";
import DialogParentalLock from "@/app/components/ParentalLock";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import {
    dialogsState,
    selectOrgAfterSwitchingProfile,
    selectOrgFromParentDashboardState,
} from "@/app/model/appModel";
import ParentsIcon from "@/assets/img/profile-org-selection/parents_icon_button.svg";
import BackIcon from "@/assets/img/profile-org-selection/student_arrow_button.svg";
import Loading from "@/components/loading";
import {
    LARGE_ICON_WIDTH,
    THEME_BACKGROUND_JOIN_APP,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Box,
    Dialog,
    DialogContent,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { History } from 'history';
import React,
{
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => ({
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
    content: {
        padding: 0,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
    },
    selectLoading: {
        backgroundColor: `alpha(${THEME_BACKGROUND_JOIN_APP}, 0.6)`,
        position: `absolute`,
        width: `100%`,
        height: `100%`,
        bottom: 5,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    title: {
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(5),
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        [theme.breakpoints.down(`sm`)]: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(3),
            fontSize: `1.5rem`,
        },
    },
}));

export function useShouldSelectOrganization () {
    const [ shouldSelectOrganization, setShouldSelectOrganization ] = useState<boolean>(false);
    const [ organizationSelectErrorCode, setOrganizationSelectErrorCode ] = useState<number | string | null>(null);
    const [ hasStudentRole, setHasStudentRole ] = useState<boolean | null>(null);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const { data: meData, loading: meDataLoading } = useMeQuery();

    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();

    const activeOrganizations = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);

    const setErrorState = (errorCode: number | string) => {
        setShouldSelectOrganization(false);
        setHasStudentRole(null);
        setOrganizationSelectErrorCode(errorCode);
    };

    const selectOrgAfterSwitchingProfileValue = useRecoilValue(selectOrgAfterSwitchingProfile);
    const setSelectOrgAfterSwitchingProfile = useSetRecoilState(selectOrgAfterSwitchingProfile);
    const isSelectOrgFromParentDashboard = useRecoilValue(selectOrgFromParentDashboardState);

    useEffect(() => {
        if (meDataLoading || isSelectOrgFromParentDashboard) return;

        // 1. User profile haven't been selected
        if (!meData?.me) {
            setErrorState(401);
            return;
        }

        // NOTE: User already selected organization.
        if (selectedOrganization) {
            const selected = activeOrganizations.find((membership) => membership.organization.organization_id === selectedOrganization?.organization_id);
            if (selected) {
                if (!selectOrgAfterSwitchingProfileValue) {
                    setHasStudentRole(true);
                    setShouldSelectOrganization(false);
                    setOrganizationSelectErrorCode(null);
                    return;
                } else {
                    setSelectOrgAfterSwitchingProfile(false);
                    setDialogs({
                        ...dialogs,
                        isSelectOrganizationOpen: false,
                    });
                }
            } else {
                setSelectedOrganization(undefined);
            }
        }

        // 1. information exists
        if (!activeOrganizations.length) { // 2. User has no organization.
            // If a teacher accesses there will be no organization, because we only fetch organizations with student permissions.
            setErrorState(`403x02`); //Students Only
        } else if (activeOrganizations.length === 1) { // 2. User has 1 organization
            setShouldSelectOrganization(false);
            const membership = activeOrganizations[0];
            setOrganizationSelectErrorCode(null);
            setHasStudentRole(true);
            setSelectedOrganization(membership.organization);
            setDialogs({
                ...dialogs,
                isSelectOrganizationOpen: false,
            });

        } else { // 2. User has more than 2 organizations
            setShouldSelectOrganization(true);
            setHasStudentRole(true);
            setOrganizationSelectErrorCode(null);
        }
    }, [
        meData,
        meDataLoading,
        selectedOrganization,
        setSelectedOrganization,
    ]);

    /**
     * ABOUT hasStudentRole (Isu)
     * When saving account information in user-information-context.tsx,
     * it retrieves only
     * 1. organizations with student permission
     * 2. and classes that can be attended with student permission.
     * Therefore, hasStudentRole does not need to be used to verify initial login permissions.
     * But it was added because it can be used in the future.
     * For more information, see QUERY_ME at user-information-context.tsx.
     */
    return {
        organizationSelectErrorCode,
        shouldSelectOrganization,
        hasStudentRole,
    };
}

interface Props{
    history: History<unknown>;
}

export function SelectOrgDialog ({ history }: Props) {
    const classes = useStyles();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const [ selectLoading, setSelectLoading ] = useState(false);
    const { data: meData } = useMeQuery();

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);

    useEffect(() => {
        if (dialogs.isSelectOrganizationOpen) return;
        setSelectLoading(false);
    }, [ dialogs.isSelectOrganizationOpen ]);

    const handleParentsClick = () => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: true,
        });
    };

    const selectOrg = useCallback((org: ReadOrganizationDto) => {
        if(selectedOrganization?.organization_id === org.organization_id){
            handleBackClick();
        }else{
            setSelectLoading(true);
            setSelectedOrganization(org);
        }
    }, [ setSelectedOrganization, selectedOrganization ]);

    const handleBackClick = () => {
        if(!selectedOrganization){
            setDialogs({
                ...dialogs,
                isSelectOrganizationOpen: false,
                isSelectUserOpen: true,
            });
            return;
        }
        setDialogs({
            ...dialogs,
            isSelectOrganizationOpen: false,
        });
    };

    if(dialogs.isParentalLockOpen && dialogs.isSelectOrganizationOpen){
        return (
            <DialogParentalLock
                onCompleted={() => {
                    setDialogs({
                        ...dialogs,
                        isSelectOrganizationOpen: false,
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
            aria-labelledby="select-org-dialog"
            open={dialogs.isSelectOrganizationOpen}
            classes={{
                paper: classes.root,
            }}
            onClose={handleBackClick}
        >
            <Box className={classes.header}>
                <img
                    alt="back icon"
                    src={BackIcon}
                    width={LARGE_ICON_WIDTH}
                    onClick={handleBackClick}
                />
                <img
                    alt="parent dashboard icon"
                    src={ParentsIcon}
                    width={LARGE_ICON_WIDTH}
                    onClick={handleParentsClick}
                />
            </Box>
            <DialogContent className={classes.content}>
                <Typography
                    className={classes.title}
                    variant="h4"
                >
                    <FormattedMessage
                        id="account_selectOrg"
                    />
                </Typography>
                {selectLoading ? (
                    <Box className={classes.selectLoading}>
                        <Loading />
                    </Box>
                ):(
                    <OrganizationList
                        organizations={activeOrganizations}
                        selectedOrganization={selectedOrganization}
                        onClick={org => selectOrg(org)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
