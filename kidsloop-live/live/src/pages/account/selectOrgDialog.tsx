import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";

import { isRoleTeacher, useUserInformation } from "../../context-provider/user-information-context";
import { Header } from "../../components/header";
import StyledButton from "../../components/styled/button";
import StyledIcon from "../../components/styled/icon";
import { State } from "../../store/store";
import { Organization, setSelectedOrg } from "../../store/reducers/session";
import { setErrCode } from "../../store/reducers/communication";
import { setSelectOrgDialogOpen } from "../../store/reducers/control";
import DefaultOrganization from "../../assets/img/avatars/Avatar_Student_01.jpg";

const useStyles = makeStyles((theme: Theme) => ({
    noPadding: {
        padding: 0
    },
    icon: {
        "&:hover": {
            color: "white"
        }
    }
}));

export function useShouldSelectOrganization() {
    const dispatch = useDispatch();
    const { information } = useUserInformation();
    const isMobileOnly = useSelector((state: State) => state.session.userAgent.isMobileOnly);
    const isTablet = useSelector((state: State) => state.session.userAgent.isTablet);
    const isMobile = isMobileOnly || isTablet
    const selectedOrganization = useSelector((state: State) => state.session.selectedOrg);
    const errCode = useSelector((state: State) => state.communication.errCode);
    const [shouldSelect, setShouldSelect] = useState<boolean>(false);

    useEffect(() => {
        if (!information) return;
        if (selectedOrganization && selectedOrganization.organization_id) {
            // NOTE: Ensure user is a member of the selected organization.
            const organization = information.organizations.find((org => {
                org.id === selectedOrganization.organization_id;
            }));

            if (!organization) {
                dispatch(setSelectedOrg(null));
                return;
            }

            const { roles } = organization;
            if (roles.length === 1) {
                const isTeacher = isRoleTeacher(roles[0].name);
                if (isMobile && isTeacher) {
                    dispatch(setErrCode(403));
                    return;
                }
            } else if (roles.length > 1) {
                const someRolesAreStudent = roles.some(role => !isRoleTeacher(role.name));
                if (isMobile && !someRolesAreStudent) {
                    dispatch(setErrCode(403));
                    return;
                }
            }

            // NOTE: The selected organization is OK.
            setShouldSelect(false);
            dispatch(setErrCode(null));
            return;
        } else { // NOTE: Organization isn't selected
            if (information.organizations.length === 0) {
                setShouldSelect(false);
                dispatch(setErrCode(403));
            } else if (information.organizations.length === 1) {
                const { name, id } = information.organizations[0];
                dispatch(setSelectedOrg({ organization_id: id, organization_name: name }));
            } else {
                setShouldSelect(true);
                dispatch(setErrCode(null));
            }
        }
    }, [information]);

    return { errCode, shouldSelect }
}

export function SelectOrgDialog() {
    const theme = useTheme();
    const { noPadding } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const open = useSelector((state: State) => state.control.selectOrgDialogOpen);
    const [org, setOrg] = useState<Organization>(selectedOrg ? selectedOrg : { organization_id: "", organization_name: "" });
    const { information } = useUserInformation();

    const organizations = useMemo(() => {
        if (!information) return [];

        return information.organizations.map(o => {
            return {
                organization_id: o.id,
                organization_name: o.name,
            }
        })
    }, [information]);

    const handleClickSelect = () => {
        dispatch(setSelectedOrg(org));
        dispatch(setSelectOrgDialogOpen(false));
    }

    return (
        <Dialog
            aria-labelledby="select-org-dialog"
            fullScreen
            open={open}
            onClose={() => dispatch(setSelectOrgDialogOpen(false))}
        >
            <DialogTitle
                id="select-org-dialog"
                disableTypography
                className={noPadding}
            >
                <Header />
            </DialogTitle>
            <DialogContent dividers>
                <Grid item xs={12} style={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(4) }}>
                    <Typography variant="body2" align="center">
                        <FormattedMessage id="selectOrg_title" />
                    </Typography>
                </Grid>
                <OrgList handler={{ org, setOrg }} organizations={organizations} />
            </DialogContent>
            <DialogActions className={noPadding}>
                <Grid item xs={12}>
                    <StyledButton
                        fullWidth
                        extendedOnly
                        size="large"
                        onClick={handleClickSelect}
                        style={{ color: "white", backgroundColor: "#0E78D5", borderRadius: 0 }}
                    >
                        <Typography variant="button">
                            <FormattedMessage id="selectOrg_buttonSelect" />
                        </Typography>
                    </StyledButton>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}



function OrgList({ handler, organizations }: {
    handler: { org: Organization, setOrg: React.Dispatch<React.SetStateAction<Organization>> },
    organizations: Organization[]
}) {
    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            alignContent="center"
            spacing={3}
        >
            {organizations.length === 0 ? null : organizations.map((o) =>
                <OrgCard
                    key={o.organization_id}
                    org={o}
                    checked={handler.org.organization_id === o.organization_id}
                    setOrg={handler.setOrg}
                />
            )}
        </Grid>
    )
}

function OrgCard({ org, checked, setOrg }: {
    org: Organization,
    checked: boolean,
    setOrg: React.Dispatch<React.SetStateAction<Organization>>
}) {
    const theme = useTheme();
    const square = theme.spacing(15)

    useEffect(() => {
        console.log(org.organization_name)
    }, [checked === true])
    return (
        <Grid container direction="column" justify="space-between" alignItems="center" spacing={1} item xs={6}>
            <Grid item >
                <Button
                    onClick={() => setOrg(org)}
                    style={{
                        position: "relative",
                        padding: 0,
                        borderRadius: 12,
                        backgroundColor: "transparent",
                        boxShadow: checked ? "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)" : "unset"
                    }}
                >
                    <img
                        alt={`${org.organization_name ? org.organization_name : "Organization"}'s thumbnail`}
                        src={DefaultOrganization}
                        height={square}
                        style={{ display: "block", borderRadius: 12 }}
                    />
                    <CheckedOrgOverlay checked={checked} />
                </Button>
            </Grid>
            <Grid item>
                <Typography variant="caption" align="center">{org.organization_name}</Typography>
            </Grid>
        </Grid>
    )
}

function CheckedOrgOverlay({ checked }: { checked: boolean }) {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                borderRadius: 12,
                background: "rgba(14, 120, 213, 0.5)",
                opacity: checked ? 1 : 0
            }}
        >
            <Grid item xs={12} style={{ textAlign: "center" }}>
                {checked ? <StyledIcon icon={<CheckIcon />} color="white" size="5rem" /> : null}
            </Grid>
        </Grid>
    )
}