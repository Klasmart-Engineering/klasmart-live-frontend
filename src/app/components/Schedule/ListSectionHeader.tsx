import { BODY_TEXT } from "@/config";
import {
    createStyles,
    ListSubheader,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listSubheaderText: {
        padding: theme.spacing(2, 0, 1, 1.5),
        fontWeight: theme.typography.fontWeightBold as number,
        color: BODY_TEXT,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.4rem`,
        },
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
    const classes = useStyles();

    return (
        <ListSubheader
            disableGutters
            component="div"
        >
            <Typography
                className={clsx(classes.listSubheaderText, {
                    [classes.disablePadding]: disablePadding,
                })}
            >{title}
            </Typography>
        </ListSubheader>
    );
}
