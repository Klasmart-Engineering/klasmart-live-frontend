import {
    THEME_COLOR_PRIMARY_DARK_DEFAULT,
    THEME_COLOR_PRIMARY_DEFAULT,
} from "@/config";
import { AttendeeType } from "@/types/attendee";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { Person as ParticipantsIcon } from "@styled-icons/material/Person";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        borderRadius: theme.spacing(2.5, 1, 2.5, 2.5),
        color: theme.palette.common.white,
        maxWidth: 220,
        textAlign: `center`,
        padding: theme.spacing(1.5, 2),
        display: `flex`,
        alignItems: `center`,
        backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
    },
    student: {
        backgroundColor: THEME_COLOR_PRIMARY_DARK_DEFAULT,
        "& $icon": {
            color: THEME_COLOR_PRIMARY_DARK_DEFAULT,
        },
    },
    icon: {
        color: THEME_COLOR_PRIMARY_DEFAULT,
        paddingRight: theme.spacing(1),
        "& svg": {
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(0.25),
            borderRadius: theme.spacing(2),
        },
    },
    name: {
        overflow: `hidden`,
        whiteSpace: `nowrap`,
        textOverflow: `ellipsis`,
    },
}));

interface Props {
    user: AttendeeType;
}

function ClassActiveUser (props: Props) {
    const classes = useStyles();
    const { user } = props;

    return (
        <div className={clsx(classes.root, {
            [classes.student]: user.type === `Student`,
        })}
        >
            <div className={classes.icon}>
                <ParticipantsIcon
                    size="1.25rem"
                />
            </div>
            <Typography
                variant="h6"
                className={classes.name}
            >
                {user.name}
            </Typography>
        </div>
    );
}

export default ClassActiveUser;
