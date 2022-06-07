import { OrganizationList } from "@/app/components/organization/organizationList";
import ParentsIcon from "@/assets/img/profile-org-selection/parents_icon_button.svg";
import BackIcon from "@/assets/img/profile-org-selection/student_arrow_button.svg";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { dialogsState, selectOrgAfterSwitchingProfile } from "@/app/model/appModel";
import { THEME_BACKGROUND_JOIN_APP } from "@/config";
import {
    Box,
    Dialog,
    DialogContent,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DialogParentalLock from "@/app/components/ParentalLock";

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

    useEffect(() => {
        if (meDataLoading) return;

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
            })

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

export function SelectOrgDialog ({ history }:any) {
    const classes = useStyles();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const { data: meData } = useMeQuery();

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);

    const handleParentsClick = () => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: true,
        });
    };

    const handleBackClick = () => {
        setDialogs({
            ...dialogs,
            isSelectOrganizationOpen: false,
        });
    }

    if(dialogs.isParentalLockOpen && dialogs.isSelectOrganizationOpen){
        return (
            <DialogParentalLock
                onCompleted={() => {
                    history.push(`/report/parent-dashboard`);
                    setDialogs({
                        ...dialogs,
                        isSelectOrganizationOpen: false,
                        isParentalLockOpen: false,
                    });
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
                    width={50}
                    onClick={handleBackClick}
                />
                <img
                    alt="parent dashboard icon"
                    src={ParentsIcon}
                    width={50}
                    onClick={handleParentsClick}
                />
            </Box>
            <DialogContent className={classes.content}>
                <OrganizationList
                    organizations={activeOrganizations}
                    selectedOrganization={selectedOrganization}
                    onClick={org => setSelectedOrganization(org)}
                />
            </DialogContent>
        </Dialog>
    );
}
