import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";

import { Header } from "../../components/header";
import StyledButton from "../../components/styled/button";
import StyledIcon from "../../components/styled/icon";
import { State } from "../../store/store";
import { Organization, setSelectedOrg } from "../../store/reducers/session";
import { setSelectOrgOpen } from "../../store/reducers/control";
import Bada from "../../assets/img/bada.svg";

const useStyles = makeStyles((theme: Theme) => ({
    noSpacing: { padding: 0 },
}));

export function SelectOrgDialog() {
    const { noSpacing } = useStyles();
    const dispatch = useDispatch();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const open = useSelector((state: State) => state.control.selectOrgOpen);
    const [org, setOrg] = useState<Organization>(selectedOrg);

    const handleClickSelect = () => {
        dispatch(setSelectedOrg(org));
        dispatch(setSelectOrgOpen(false));
    }

    return (
        <Dialog
            aria-labelledby="select-org-dialog"
            fullScreen
            open={open}
            onClose={() => dispatch(setSelectOrgOpen(false))}
        >
            <DialogTitle
                id="select-org-dialog"
                disableTypography
                className={noSpacing}
            >
                <Header />
            </DialogTitle>
            <DialogContent dividers>
                <OrgList handler={{ org, setOrg }} />
            </DialogContent>
            <DialogActions className={noSpacing}>
                <Grid item xs={12}>
                    <StyledButton
                        fullWidth
                        extendedOnly
                        size="large"
                        onClick={handleClickSelect}
                        style={{ backgroundColor: "#C5E9FB", borderRadius: 0 }}
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

const ORGANIZATIONS = [
    { organization_id: "org1", organization_name: "Organization1" },
    { organization_id: "org2", organization_name: "Organization2" },
    { organization_id: "org3", organization_name: "Organization3" },
    { organization_id: "org4", organization_name: "Organization4" },
    { organization_id: "org5", organization_name: "Organization5" },
    { organization_id: "org6", organization_name: "Organization6" },
    { organization_id: "org7", organization_name: "Organization7" },
]

function OrgList({ handler }: {
    handler: {
        org: Organization,
        setOrg: React.Dispatch<React.SetStateAction<Organization>>
    }
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
            {ORGANIZATIONS.map((o) =>
                <Grid key={o.organization_id} item xs={6}>
                    <OrgCard org={o} checked={handler.org.organization_id === o.organization_id} setOrg={handler.setOrg} />
                </Grid>
            )}
        </Grid>
    )
}

function OrgCard({ org, checked, setOrg }: {
    org: Organization,
    checked: boolean,
    setOrg: React.Dispatch<React.SetStateAction<Organization>>
}) {
    const ALT = `${org.organization_name ? org.organization_name : "Organization"}'s thumbnail`
    // const [checked, setChecked] = useState(false);

    return (
        <Card elevation={3}>
            <CardActionArea onClick={() => setOrg(org)}>
                <Grid style={{ position: "relative", flexGrow: 1 }}>
                    <CheckedOrgOverlay checked={checked} />
                    <CardMedia component="img" alt={ALT} title={ALT} image={Bada} style={{ maxHeight: 150 }} />
                </Grid>
                <CardContent style={{ flexGrow: 0 }}>
                    <Typography variant="h6" align="center">{org.organization_name}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
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
                backgroundColor: checked ? "rgba(197, 233, 251, 0.8)" : undefined
            }}
        >
            <Grid item xs={12} style={{ textAlign: "center" }}>
                {checked ? <StyledIcon icon={<CheckIcon />} color="white" size="5rem" /> : null}
            </Grid>
        </Grid>
    )
}