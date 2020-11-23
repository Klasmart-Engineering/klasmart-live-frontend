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

import { OrganizationPayload, isRoleTeacher, useUserInformation } from "../../context-provider/user-information-context";
import { Header } from "../../components/header";
import StyledButton from "../../components/styled/button";
import StyledIcon from "../../components/styled/icon";
import { State } from "../../store/store";
import { setSelectedOrg } from "../../store/reducers/session";
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
    const [shouldSelect, setShouldSelect] = useState<boolean>(false);
    const [errCode, setErrCode] = useState<number | null>(null);

    useEffect(() => {
        // 1. information returns undefined
        if (!information) {
            setShouldSelect(false);
            setErrCode(401);
            return;
        }

        // 1. information exists
        if (information.organizations.length === 0) { // 2. User has no organization
            setShouldSelect(false);
            setErrCode(403)
        } else if (information.organizations.length === 1) { // 2. User has 1 organization
            setShouldSelect(false);
            const { organization_id, organization_name } = information.organizations[0].organization;
            const roles = information.organizations[0].roles;
            if (roles.length === 1) {
                const isTeacher = isRoleTeacher(roles[0].role_name);
                if (isMobile && isTeacher) {
                    setErrCode(403);
                    return;
                }
            } else if (roles.length > 1) {
                const someRolesAreStudent = roles.some(role => !isRoleTeacher(role.role_name));
                if (isMobile && !someRolesAreStudent) {
                    setErrCode(403);
                    return;
                }
            }
            setErrCode(null)
            dispatch(setSelectedOrg({ organization_id, organization_name }));
        } else { // 2. User has more than 2 organizations
            setShouldSelect(true);
            setErrCode(null);
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
    const [org, setOrg] = useState<OrganizationPayload>(selectedOrg ? selectedOrg : { organization_id: "", organization_name: "" });
    const { information } = useUserInformation();

    const organizations = useMemo(() => {
        if (!information) return [];

        return information.organizations.map(o => {
            return {
                organization_id: o.organization.organization_id,
                organization_name: o.organization.organization_name,
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
    handler: { org: OrganizationPayload, setOrg: React.Dispatch<React.SetStateAction<OrganizationPayload>> },
    organizations: OrganizationPayload[]
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
    org: OrganizationPayload,
    checked: boolean,
    setOrg: React.Dispatch<React.SetStateAction<OrganizationPayload>>
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