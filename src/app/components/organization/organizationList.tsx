import { OrganizationListItem } from "./organizationListItem";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";

interface Props {
    organizations: ReadOrganizationDto[];
    selectedOrganization?: ReadOrganizationDto;
    onClick?: (organization: ReadOrganizationDto) => void;
}

const useStyles = makeStyles((theme) => createStyles({
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
    root: {
        overflowX: `scroll`,
    },
    contentCenter: {
        justifyContent: "center",
    },
}));

export const OrganizationList: React.FC<Props> = ({
    organizations, selectedOrganization, onClick,
}) => {
    const classes = useStyles();

    return (
        <>
            <Typography
                className={classes.title}
                variant="h4"
            >
                <FormattedMessage
                    id="account_selectOrg"
                />
            </Typography>

            <Grid
                container
                wrap="nowrap"
                className={clsx(classes.root, {
                    [classes.contentCenter]: organizations.length <= 5
                })}
            >
                {organizations.map((organization) =>
                    (
                    <Grid
                        key={organization.organization_id}
                        sm={3}
                        item>
                        <OrganizationListItem
                            key={organization.organization_id}
                            organization={organization}
                            isSelected={organization.organization_id === selectedOrganization?.organization_id}
                            onClick={onClick}
                        />
                    </Grid>
                    ))}
            </Grid>
        </>
    );
};
