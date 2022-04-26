import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { OrganizationList } from "@/app/components/organization/organizationList";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import { dialogsState, selectOrgAfterSwitchingProfile } from "@/app/model/appModel";
import {
    THEME_BACKGROUND_SELECT_DIALOG,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Dialog,
    DialogContent,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React,
{
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const useStyles = makeStyles((theme) => ({
    fullWidth: {
        width: `100%`,
    },
    content: {
        padding: theme.spacing(5, 2, 2),
        backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,

        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(8, 4, 2),
        },
    },
    header: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        paddingBottom: theme.spacing(4),
        textAlign: `center`,
        lineHeight: 1.5,
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
    const theme = useTheme();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const { data: meData } = useMeQuery();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));

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
                    id: `account_selectOrg`,
                    defaultMessage: `Select an Organization`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <DialogContent className={classes.content}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="flex-start"
                    direction="column">
                    <Grid
                        item
                        xs={8}
                        sm={6}>
                        <Typography
                            variant={isSmUp ? `h4` : `h5`}
                            className={classes.header}>
                            <FormattedMessage
                                id="account_selectOrg_whichOrg"
                                defaultMessage="Which organization are you studying with?" />
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        className={classes.fullWidth}>
                        <OrganizationList
                            organizations={activeOrganizations}
                            selectedOrganization={selectedOrganization}
                            onClick={org => setSelectedOrganization(org)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
