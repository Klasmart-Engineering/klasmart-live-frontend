import { THEME_COLOR_PRIMARY_DEFAULT } from "@/config";
import { AttendeeType } from "@/types/attendee";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { Person as ParticipantsIcon } from "@styled-icons/material/Person";
import React from "react";

interface Props {
    attendees: AttendeeType[];
}

const useStyles = makeStyles((theme: Theme) => ({
    listItem: {
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1),
    },
    listItemActive: {
        backgroundColor: `rgb(0 0 0 / 10%)`,
    },
    icon: {
        color: theme.palette.common.white,
        minWidth: `auto`,
        paddingRight: theme.spacing(1),
        "& svg": {
            backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
            padding: theme.spacing(0.25),
            borderRadius: theme.spacing(2),
        },
    },
}));

function ClassAttendeesList (props: Props) {
    const classes = useStyles();

    const { attendees } = props;

    return (
        <List>
            {attendees.map(attendee => (
                <ListItem
                    key={attendee.id}
                    button
                    className={classes.listItem}
                >
                    <ListItemIcon className={classes.icon}>
                        <ParticipantsIcon
                            size="1.25rem"
                        />
                    </ListItemIcon>
                    <ListItemText primary={attendee.name} />
                </ListItem>
            ))}
        </List>
    );
}

export default ClassAttendeesList;
