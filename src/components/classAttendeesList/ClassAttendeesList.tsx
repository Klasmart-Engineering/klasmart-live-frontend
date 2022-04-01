import { THEME_COLOR_PRIMARY_DEFAULT } from "@/config";
import { classActiveUserIdState } from "@/store/layoutAtoms";
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
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1),
        margin: theme.spacing(0.5, 0),
    },
    active: {
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

interface Props {
    attendees: AttendeeType[];
}

function ClassAttendeesList (props: Props) {
    const classes = useStyles();

    const { attendees } = props;
    const [ classActiveUserId, setClassActiveUserId ] = useRecoilState(classActiveUserIdState);

    const handleClick = (id: string) => {
        setClassActiveUserId(id);
    };

    return (
        <List>
            {attendees.map(attendee => (
                <ListItem
                    key={attendee.id}
                    button
                    className={clsx(classes.item, {
                        [classes.active]: classActiveUserId === attendee.id,
                    })}
                    onClick={() => handleClick(attendee.id)}
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
