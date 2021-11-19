import {
    createStyles,
    ListSubheader,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listSubheaderText: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        fontWeight: 600, // theme.typography.fontWeightBold
    },
}));

interface Props {
    title: string;
}

export default function ScheduleListSectionHeader (props: Props) {
    const { title } = props;
    const classes = useStyles();
    return (
        <ListSubheader
            component="div"
            className={classes.listSubheaderText}
        >
            {title}
        </ListSubheader>
    );
}
