import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { OrganizationList } from "@/app/components/organization/organizationList";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { dialogsState } from "@/app/model/appModel";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from '@material-ui/core/styles';
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    content: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

export function useShouldSelectOrganization () {
    const [ shouldSelectOrganization, setShouldSelectOrganization ] = useState<boolean>(false);
    const [ organizationSelectErrorCode, setOrganizationSelectErrorCode ] = useState<number | string | null>(null);
    const [ hasStudentRole, setHasStudentRole ] = useState<boolean | null>(null);

    const { data: meData, loading: meDataLoading } = useMeQuery();

    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();

    const activeOrganizations = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);

    const setErrorState = (errorCode: number | string) => {
        setShouldSelectOrganization(false);
        setHasStudentRole(null);
        setOrganizationSelectErrorCode(errorCode);
    };

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
                setHasStudentRole(true);
                setShouldSelectOrganization(false);
                setOrganizationSelectErrorCode(null);
                return;
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

export function SelectOrgDialog () {
    const classes = useStyles();
    const intl = useIntl();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const { data: meData } = useMeQuery();

    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);

    const handleBackClick = () => setDialogs({
        ...dialogs,
        isSelectOrganizationOpen: false,
    });

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={dialogs.isSelectOrganizationOpen}
            onClose={handleBackClick}
        >
            <AppBar
                title={intl.formatMessage({
                    id: `account_selectOrg_whichOrg`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
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
