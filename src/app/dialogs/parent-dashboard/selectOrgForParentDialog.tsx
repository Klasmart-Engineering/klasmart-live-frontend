import AppBar,
{ AppBarStyle } from "@/app/components/layout/AppBar";
import { OrganizationList } from "@/app/components/organization/organizationList";
import { useSelectedOrganization } from "@/app/data/user/atom";
import { EntityStatus } from "@/app/data/user/dto/sharedDto";
import { useMeQuery } from "@/app/data/user/queries/meQuery";
import BackButton from "@/assets/img/parent-dashboard/back_icon_parents.svg";
import {
    THEME_BACKGROUND_SELECT_DIALOG,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Dialog,
    DialogContent,
    makeStyles,
} from "@material-ui/core";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

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
interface Props {
    open: boolean;
    onBackClick: () => void;
    onOrgClicked: () => void;
}

export function SelectOrgForParentDialog (props: Props) {
    const {
        open,
        onBackClick,
        onOrgClicked,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedOrganization, setSelectedOrganization ] = useSelectedOrganization();
    const { data: meData } = useMeQuery();
    const activeOrganizationMemberships = useMemo(() => meData?.me?.organizationsWithPermission.filter((membership) => membership.status === EntityStatus.ACTIVE) ?? [], [ meData ]);
    const activeOrganizations = useMemo(() => activeOrganizationMemberships.map((membership) => membership.organization), [ activeOrganizationMemberships ]);

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={open}
            onClose={onBackClick}
        >
            <AppBar
                title={intl.formatMessage({
                    id: `hamburger.parentsDashboard`,
                    defaultMessage: `Parent Dashboard`,
                })}
                style={AppBarStyle.ROUNDED}
                leading={<img
                    src={BackButton}
                    alt="back button"
                    onClick={onBackClick}
                         />
                }
            />
            <DialogContent className={classes.content}>
                <OrganizationList
                    organizations={activeOrganizations}
                    selectedOrganization={selectedOrganization}
                    onClick={org => {
                        setSelectedOrganization(org);
                        onOrgClicked();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
