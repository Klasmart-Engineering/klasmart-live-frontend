
import { heightActionButton } from "@/app/utils/fixedValues";
import {
    THEME_COLOR_INACTIVE_BUTTON,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import {
    ButtonBase,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React,
{ ReactElement } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        color: THEME_COLOR_INACTIVE_BUTTON,
        height: heightActionButton,
        display: `flex`,
        width: `100%`,
    },
    active : {
        backgroundColor: `#C5E9FB`,
        color: THEME_COLOR_SECONDARY_DEFAULT,
    },
    icon: {
        marginBottom: 3,
    },
}));

interface Props {
    onClick: () => void;
    title: string;
    icon: ReactElement<any, string>;
    active: boolean;
}

export function BottomNavigationButton (props: Props) {
    const {
        onClick,
        title,
        icon,
        active,
    } = props;
    const classes = useStyles();
    return (
        <ButtonBase
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
            onClick={onClick}
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid
                    item
                    className={classes.icon}
                >
                    {icon}
                </Grid>
                <Grid item>
                    <Typography
                        variant="subtitle2">
                        <FormattedMessage id={title} />
                    </Typography>
                </Grid>
            </Grid>
        </ButtonBase>
    );
}
