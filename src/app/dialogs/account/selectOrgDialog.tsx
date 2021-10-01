import { useRegionSelect } from "../../../providers/region-select-context";
import { Header } from "../../components/layout/header";
import {
    isRoleTeacher,
    useUserInformation,
} from "../../context-provider/user-information-context";
import {
    dialogsState,
    selectedOrganizationState,
    selectedUserState,
} from "../../model/appModel";
import {
    Organization,
    OrganizationResponse,
} from "../../services/user/IUserInformationService";
import { ParentalGate } from "../parentalGate";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
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
import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";
import { OrganizationAvatar } from "kidsloop-px";
import React,
{
    useCallback,
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

    const { selectedUserProfile } = useUserInformation();

    const [ selectedOrganization, setSelectedOrganization ] = useRecoilState(selectedOrganizationState);

    const setErrorState = (errorCode: number | string) => {
        setShouldSelectOrganization(false);
        setHasStudentRole(null);
        setOrganizationSelectErrorCode(errorCode);
    };

    const verifyOrganizationStudentRole = (organization: Organization) => {
        const roles = organization.roles;
        if (roles.length === 1) {
            if(isRoleTeacher(roles[0].role_name)) {
                return false;
            }
        } else if (roles.length > 1) {
            const someRolesAreStudent = roles.some(role => !isRoleTeacher(role.role_name));
            if (!someRolesAreStudent) {
                return false;
            }
        }

        return true;
    };

    useEffect(() => {
        // 1. User profile haven't been selected
        if (!selectedUserProfile) {
            setErrorState(401);
            return;
        }

        // NOTE: User already selected organization.
        if (selectedOrganization) {
            const selected = selectedUserProfile.organizations.find(o => o.organization.organization_id === selectedOrganization?.organization_id);
            if (selected && verifyOrganizationStudentRole(selected)) {
                setHasStudentRole(true);
                setShouldSelectOrganization(false);
                setOrganizationSelectErrorCode(null);
                return;
            }
        }

        // 1. information exists
        if (selectedUserProfile.organizations.length === 0) { // 2. User has no organization.
            // If a teacher accesses there will be no organization, because we only fetch organizations with student permissions.
            setErrorState(`403x02`); //Students Only
        } else if (selectedUserProfile.organizations.length === 1) { // 2. User has 1 organization
            setShouldSelectOrganization(false);
            const {
                organization_id,
                organization_name,
                status,
            } = selectedUserProfile.organizations[0].organization;

            if (!verifyOrganizationStudentRole(selectedUserProfile.organizations[0])) {
                setHasStudentRole(false);
                setOrganizationSelectErrorCode(`403x01`); //Access Restricted
                return;
            }

            setOrganizationSelectErrorCode(null);
            setHasStudentRole(true);
            setSelectedOrganization({
                organization_id,
                organization_name,
                status,
            });
        } else { // 2. User has more than 2 organizations
            setShouldSelectOrganization(true);
            setHasStudentRole(true);
            setOrganizationSelectErrorCode(null);
        }
    }, [ selectedUserProfile, selectedOrganization ]);

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
    const [ , setSelectedOrganization ] = useRecoilState(selectedOrganizationState);
    const [ selectedUser, setSelectedUser ] = useRecoilState(selectedUserState);

    const { region } = useRegionSelect();
    const { selectedUserProfile, actions } = useUserInformation();

    const [ parentalLock, setParentalLock ] = useState<boolean>(false);

    const organizations = useMemo(() => {
        if (!selectedUserProfile) return [];

        return selectedUserProfile.organizations.map(o => {
            return {
                organization_id: o.organization.organization_id,
                organization_name: o.organization.organization_name,
                status: o.organization.status,
            };
        });
    }, [ selectedUserProfile ]);

    const openPrivacyPolicy = () => {
        const cordova = (window as any).cordova;
        if (!cordova) return;

        const privacyEndpoint = region?.services.privacy ?? `https://www.kidsloop.net/policies/privacy-notice/`;

        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                cordova.InAppBrowser.open(privacyEndpoint, `_system`, `location=no, zoom=no`);
            } else {
                cordova.plugins.browsertab.openUrl(privacyEndpoint, (successResp: any) => { console.log(successResp); }, () => {
                    console.error(`no browser tab available`);
                });
            }
        });
    };

    async function handleSignOut () {
        setDialogs({
            ...dialogs,
            isSelectOrganizationOpen: false,
        });

        setSelectedUser({
            ...selectedUser,
            userId: undefined,
        });

        setSelectedOrganization(undefined);

        actions?.signOutUser();
    }

    useEffect(() => {
        setParentalLock(false);
    }, [ open ]);

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
            <ParentalGate onCompleted={() => { openPrivacyPolicy(); setParentalLock(false); }} />
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
                <OrgList organizations={organizations} />
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
                        onClick={() => handleSignOut()}
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

function OrgList ({ organizations }: { organizations: OrganizationResponse[] }) {
    const theme = useTheme();

    const [ selectedOrganization, setSelectedOrganization ] = useRecoilState(selectedOrganizationState);
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const changeOrganization = useCallback((organization: OrganizationResponse) => {
        setSelectedOrganization(organization);
        setDialogs({
            ...dialogs,
            isSelectOrganizationOpen: false,
        });
    }, []);

    return (
        <List>
            {organizations.map((organization) => {
                return <ListItem
                    key={organization.organization_id}
                    button
                    onClick={() => changeOrganization(organization)}
                >
                    <ListItemAvatar>
                        <OrganizationAvatar name={organization.organization_name} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={organization.organization_name}
                    />
                    {organization.organization_id === selectedOrganization?.organization_id && (
                        <ListItemIcon>
                            <CheckIcon
                                color={theme.palette.success.main}
                                size={24} />
                        </ListItemIcon>
                    )}
                </ListItem>;
            })}
        </List>
    );
}