import Messages from "./messages/messages";
import SendMessage from "./messages/sendMessage";
import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import React from 'react';
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    title:{
        fontSize: `1rem`,
        fontWeight: theme.typography.fontWeightBold as number,
        textAlign: `center`,
    },
    divider: {
        height: 1,
    },
}));

function Chat () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid item>
                <Typography className={classes.title}>
                    <FormattedMessage id="toolbar_chat" />
                </Typography>
                <Divider
                    flexItem
                    className={classes.divider}
                    orientation="horizontal" />
            </Grid>
            <Grid
                item
                xs
                style={{
                    overflowY: `auto`,
                }}>
                <Messages />
            </Grid>
            <Grid item>
                <SendMessage />
            </Grid>
        </Grid>
    );
}

export default Chat;
