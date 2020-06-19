import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React, { useState } from "react";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/fabButton";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    cssFocused: {
        "&$cssFocused": {
            backgroundColor: "#dff0ff",
            color: "#1896ea", // focused
        },

    },
    cssOutlinedInput: {
        "&$cssFocused": {
            borderColor: "#1896ea", // focused
        },
        "&:hover:not($disabled):not($cssFocused):not($error)": {
            backgroundColor: "#b8ddff",
            borderColor: "#7c8084", // hovered
        },
        "&:not(hover):not($disabled):not($cssFocused):not($error)": {
            borderColor: "#c9caca", // default
        },
        "backgroundColor": "#fcfcfb",
    },
    liveChatInput: {
        borderRadius: 12,
        // height: 500,
        padding: theme.spacing(2, 5),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 2),
        },
    },
    smallAvatar: {
        height: theme.spacing(4),
        marginRight: theme.spacing(1),
        width: theme.spacing(4),
    },
}));

export default function LiveChatInput() {
    const classes = useStyles();
    const [focusedInput, setFocusedInput] = useState(true);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.liveChatInput}
            spacing={2}
        >
            <Hidden smDown>
                <Grid item>
                    <Avatar
                        alt="Shawn Lee"
                    >
                        <AccountCircle />
                    </Avatar>
                </Grid>
            </Hidden>
            <Grid item style={{ flex: 1 }}>
                <TextField
                    fullWidth
                    multiline
                    id="live-chat-input"
                    label="Share something here"
                    variant="filled"
                    onClick={() => setFocusedInput(true)}
                    InputProps={{
                        classes: {
                            focused: classes.cssFocused,
                            root: classes.cssOutlinedInput,
                        },
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Collapse in={focusedInput}>
                    <Grid container item xs={12} justify="flex-end" alignItems="center">
                        <Hidden mdUp>
                            <Grid item>
                                <Avatar
                                    alt="Shawn Lee"
                                    className={classes.smallAvatar}
                                >
                                    <AccountCircle />
                                </Avatar>
                            </Grid>
                        </Hidden>
                        <StyledFAB
                            extendedOnly
                            size="small"
                        >
                            Send
                        </StyledFAB>
                    </Grid>
                </Collapse>
            </Grid>
        </Grid>
    );
}
