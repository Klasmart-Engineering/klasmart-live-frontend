import { Header } from "../../components/layout/header";
import { isRoleTeacher } from "../../context-provider/authentication-context";
import { dialogsState } from "../../model/appModel";
import { ParentalGate } from "../parentalGate";
import { useSignOut } from "./useSignOut";
import { OrganizationList } from "@/app/components/organization/organizationList";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { ReadMembershipDto } from "@/app/data/user/dto/readMembershipDto";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { RoleStatus } from "@/app/data/user/dto/readRoleDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { useDisplayPrivacyPolicy } from "@/app/utils/privacyPolicyUtils";
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
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

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

export function useShouldSelectOrganization () {
    const [ shouldSelectOrganization, setShouldSelectOrganization ] = useState<boolean>(false);
    const [ organizationSelectErrorCode, setOrganizationSelectErrorCode ] = useState<number | string | null>(null);
    const [ hasStudentRole, setHasStudentRole ] = useState<boolean | null>(null);

    const { data: meData, loading: meDataLoading } = useMeQuery();

    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();

    const setErrorState = (errorCode: number | string) => {
        setShouldSelectOrganization(false);
        setHasStudentRole(null);
        setOrganizationSelectErrorCode(errorCode);
    };

    const verifyMembershipStudentRole = (membership: ReadMembershipDto) => {
        if (!membership.roles) return false;

        const roles = membership.roles.filter(r => r.status === RoleStatus.ACTIVE);
        if (roles.length === 1) {
            if (isRoleTeacher(roles[0].role_name ?? ``)) {
                return false;
            }
        } else if (roles.length > 1) {
            if (!roles.some(role => !isRoleTeacher(role.role_name ?? ``))) {
                return false;
            }
        }

        return true;
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
            const selected = meData.me.memberships?.find(membership =>
                membership.organization_id === selectedOrganization?.organization_id);
            if (selected && verifyMembershipStudentRole(selected)) {
                setHasStudentRole(true);
                setShouldSelectOrganization(false);
                setOrganizationSelectErrorCode(null);
                return;
            } else {
                setSelectedOrganization(undefined);
            }
        }

        // 1. information exists
        if (!meData.me.memberships?.length) { // 2. User has no organization.
            // If a teacher accesses there will be no organization, because we only fetch organizations with student permissions.
            setErrorState(`403x02`); //Students Only
        } else if (meData.me.memberships?.length === 1) { // 2. User has 1 organization
            setShouldSelectOrganization(false);

            const membership = meData.me.memberships[0];
            if (!verifyMembershipStudentRole(membership)) {
                setHasStudentRole(false);
                setOrganizationSelectErrorCode(`403x01`); //Access Restricted
                return;
            }

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
    const theme = useTheme();
    const { noPadding } = useStyles();

    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const { data: meData } = useMeQuery();

    const [ parentalLock, setParentalLock ] = useState<boolean>(false);

    const displayPrivacyPolicy = useDisplayPrivacyPolicy();

    const organizations = useMemo(() => {
        if (!meData?.me?.memberships) return [];
        const memberships = meData.me.memberships;

        return memberships
            .map(membership => membership.organization)
            .filter(organization => organization) as ReadOrganizationDto[];
    }, [ meData ]);

    const { signOut } = useSignOut();

    useEffect(() => {
        setParentalLock(false);
    }, []);

    if (parentalLock) {
        return <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={dialogs.isSelectOrganizationOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isParentalLockOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="select-org-dialog"
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <ParentalGate onCompleted={() => { displayPrivacyPolicy(); setParentalLock(false); }} />
        </Dialog>;
    }

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={dialogs.isSelectOrganizationOpen}
            onClose={() => setDialogs({
                ...dialogs,
                isSelectOrganizationOpen: false,
            })}
        >
            <DialogTitle
                disableTypography
                id="select-org-dialog"
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
                        <FormattedMessage id="account_selectOrg_whichOrg" />
                    </Typography>
                </Grid>
                <OrganizationList
                    organizations={organizations}
                    selectedOrganization={selectedOrganization}
                    onClick={org => setSelectedOrganization(org)}
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
                        onClick={() => signOut()}
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
