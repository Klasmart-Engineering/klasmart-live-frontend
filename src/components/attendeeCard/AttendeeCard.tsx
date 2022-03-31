import {
    THEME_COLOR_PRIMARY_DARK_DEFAULT,
    THEME_COLOR_PRIMARY_DEFAULT,
} from '@/config';
import {
    Avatar,
    CardActionArea,
    Paper,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Check as CheckIcon } from "@styled-icons/bootstrap/Check";
import { Person as PersonIcon } from "@styled-icons/material/Person";
import clsx from 'clsx';
import React from 'react';

const THEME_COLOR_AVATAR_BACKGROUND = `#C3D8EB`;
const AVATAR_SIZE = 95;

const useStyles = makeStyles((theme) => ({
    root: {
        height: `100%`,
    },
    paper: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        padding: theme.spacing(4, 1.5),
        textAlign: `center`,
        height: `100%`,
        boxSizing: `border-box`,
        backgroundColor: theme.palette.common.white,
        borderRadius: theme.spacing(1),
    },
    avatar: {
        backgroundColor: THEME_COLOR_AVATAR_BACKGROUND,
        marginBottom: theme.spacing(2),
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        "& > svg": {
            width: AVATAR_SIZE - theme.spacing(3),
            height: AVATAR_SIZE - theme.spacing(3),
            color: theme.palette.common.white,
        },
    },
    selected: {
        color: theme.palette.getContrastText(theme.palette.common.white),

        "& $avatar": {
            backgroundColor: theme.palette.common.white,
        },
    },
    selectedStudent: {
        color: theme.palette.getContrastText(THEME_COLOR_PRIMARY_DARK_DEFAULT),
        backgroundColor: THEME_COLOR_PRIMARY_DARK_DEFAULT,
        "& $avatar > svg": {
            color: THEME_COLOR_PRIMARY_DARK_DEFAULT,
        },
    },
    selectedTeacher: {
        color: theme.palette.getContrastText(THEME_COLOR_PRIMARY_DEFAULT),
        backgroundColor: THEME_COLOR_PRIMARY_DEFAULT,
        "& $avatar > svg": {
            color: THEME_COLOR_PRIMARY_DEFAULT,
        },
    },
    name: {
        fontWeight: 500,
    },
}));

interface Props {
    type: string;
    name: string;
    selected: boolean;
    className?: string;
    onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

const AttendeeCard = (props: Props) => {
    const {
        className,
        type,
        name,
        selected,
        onClick,
    } = props;

    const classes = useStyles();

    const handleSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClick(event);
    };

    return (
        <CardActionArea
            disableRipple
            className={clsx(className, classes.root)}
            onClick={handleSelect}
        >
            <Paper
                elevation={3}
                className={clsx(classes.paper, {
                    [classes.selected]: selected,
                    [classes.selectedTeacher]: selected && type === `Teacher`,
                    [classes.selectedStudent]: selected && type === `Student`,
                })}
            >
                <Avatar className={classes.avatar}>
                    {selected ? <CheckIcon /> : <PersonIcon />}
                </Avatar>
                <Typography className={classes.name}>{name}</Typography>
            </Paper>
        </CardActionArea>
    );
};

export default AttendeeCard;
