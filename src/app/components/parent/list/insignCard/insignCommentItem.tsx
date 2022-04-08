import {
    LIVE_COLOR,
    TEXT_COLOR_CONSTRAST_DEFAULT,
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
        backgroundColor: LIVE_COLOR,
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
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
    },
}));

export interface InsignCommentProps {
  messageId: string;
}

export const InsignCommentItem = (props: InsignCommentProps) => {
    const { messageId } = props;
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
                        >
                            <FormattedMessage
                                id={messageId}
                                defaultMessage="Anna is doing such a great job this week and she finished ALL her homework..."
                            />
                        </Typography>
                    }
                />
            </List>
        </Box>
    );
};
