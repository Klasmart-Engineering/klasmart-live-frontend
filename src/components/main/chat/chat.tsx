import Messages from "./messages/messages";
import SendMessage from "./messages/sendMessage";
import {
    Grid,
    Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React from 'react';
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
    fullHeight: {
        height: `100%`,
        padding: theme.spacing(0.5),
    },
    title: {
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
    },
    divider: {
        height: 1,
    },
    messagesContainer: {
        overflowY: `auto`,
    },
    messagesContainerDialog: {
        overflowY: `auto`,
        flex: `1 1 auto`,
        maxHeight: `50vh`,
    },
}));

interface Props {
	dialog: boolean;
}

function Chat (props: Props) {
    const { dialog } = props;
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}
        >
            <Grid item>
                <Typography className={classes.title}>
                    <FormattedMessage id="toolbar_chat" />
                </Typography>
                <Divider
                    flexItem
                    className={classes.divider}
                    orientation="horizontal"
                />
            </Grid>
            <Grid
                item
                xs
                className={clsx(classes.messagesContainer, {
                    [classes.messagesContainerDialog]: dialog,
                })}
            >
                <Messages />
            </Grid>
            <Grid item>
                <SendMessage />
            </Grid>
        </Grid>
    );
}

export default Chat;
