import Messages from "./messages/messages";
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
            </Grid>
            <Divider
                flexItem
                className={classes.divider}
                orientation="horizontal" />
            <Grid
                item
                xs>
                <Messages />
            </Grid>
        </Grid>
    );
}

export default Chat;
