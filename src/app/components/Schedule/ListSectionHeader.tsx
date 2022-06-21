import {
    ListSubheader,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { grey } from '@mui/material/colors';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    return (
        <ListSubheader
            disableGutters
            component="div"
        >
            <Typography
                variant={isSmDown ? `subtitle1` : `h6`}
                className={clsx(classes.listSubheaderText, {
                    [classes.disablePadding]: disablePadding,
                })}
            >{title}
            </Typography>
        </ListSubheader>
    );
}
