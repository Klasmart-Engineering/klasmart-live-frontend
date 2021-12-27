import {
    createStyles,
    ListSubheader,
    makeStyles,
    Typography,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listSubheaderText: {
        padding: `24px 32px 0px`,
        fontWeight: theme.typography.fontWeightBold as number,
        color: grey[700],
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
        >
            <Typography
                variant="subtitle1"
                className={classes.listSubheaderText}
            >{title}</Typography>
        </ListSubheader>
    );
}
