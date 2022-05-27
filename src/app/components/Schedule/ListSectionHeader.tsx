import {
    createStyles,
    ListSubheader,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listSubheaderText: {
        padding: theme.spacing(3, 0, 0),
        fontWeight: theme.typography.fontWeightBold as number,
        color: grey[700],
    },
    disablePadding: {
        padding: 0,
    },
}));

interface Props {
    title: string;
    disablePadding?: boolean;
}

export default function ScheduleListSectionHeader (props: Props) {
    const { title, disablePadding } = props;
    const theme = useTheme();
    const classes = useStyles();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));
    return (
        <ListSubheader
            disableGutters
            component="div"
        >
            <Typography
                variant={isXsDown ? `subtitle1` : `h6`}
                className={clsx(classes.listSubheaderText, {
                    [classes.disablePadding]: disablePadding,
                })}
            >{title}</Typography>
        </ListSubheader>
    );
}
