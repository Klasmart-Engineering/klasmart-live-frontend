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
        padding: theme.spacing(3, 1.5, 0),
        fontWeight: theme.typography.fontWeightBold as number,
        color: grey[700],
    },
}));

interface Props {
    title: string;
}

export default function ListSectionHeader (props: Props) {
    const { title } = props;
    const theme = useTheme();
    const classes = useStyles();
    return (
        <ListSubheader
            component="div"
            disableGutters
        >
            <Typography
                variant={`subtitle2`}
                className={classes.listSubheaderText}
            >{title}
            </Typography>
        </ListSubheader>
    );
}
