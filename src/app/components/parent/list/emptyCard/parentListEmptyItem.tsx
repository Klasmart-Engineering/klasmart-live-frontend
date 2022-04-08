import ForwardIcon from "@/assets//img/parent-dashboard/forward_arrow.svg";
import {
    BODY_TEXT,
    COLOR_CONTENT_TEXT,
} from "@/config";
import {
    Box,
    createStyles,
    List,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `auto`,
        margin: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: 10,
        backgroundColor: theme.palette.background.paper,
        "&:last-child":{
            marginBottom: theme.spacing(1),
        },
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    list: {
        padding: `20px`,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: BODY_TEXT,
    },
    listItem: {
        marginTop: theme.spacing(1.75),
    },
    text: {
        color: COLOR_CONTENT_TEXT,
        fontWeight: theme.typography.fontWeightRegular as number,
    },
}));

export interface ParentEmptyProps {
  title: string;
  messageId: string;
}

export const ParentListEmptyItem = (props: ParentEmptyProps) => {
    const {
        title,
        messageId,
    } = props;
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            <List className={classes.list}>
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            className={classes.title}
                            variant="body2"
                        > {title}
                        </Typography>}
                />
                <ListItemText
                    disableTypography
                    className={classes.listItem}
                    primary={
                        <Typography
                            className={classes.text}
                            variant="body2"
                        >
                            <FormattedMessage
                                id={messageId}
                                defaultMessage="There were no scheduled live classes this week"
                            />
                        </Typography>
                    }
                />
            </List>
        </Box>
    );
};
