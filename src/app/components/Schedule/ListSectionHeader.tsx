import {
    createStyles,
    ListSubheader,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listSubheaderText: {
        padding: theme.spacing(3, 2, 0),
        fontWeight: theme.typography.fontWeightBold as number,
        color: grey[700],
    },
}));

interface Props {
    title: string;
}

export default function ScheduleListSectionHeader (props: Props) {
    const { title } = props;
    const theme = useTheme();
    const classes = useStyles();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));
    return (
        <ListSubheader
            component="div"
        >
            <Typography
                variant={isXsDown ? `subtitle1` : `h6`}
                className={classes.listSubheaderText}
            >{title}</Typography>
        </ListSubheader>
    );
}
