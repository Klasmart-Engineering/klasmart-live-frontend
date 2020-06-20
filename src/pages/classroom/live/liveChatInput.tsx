import Avatar from "@material-ui/core/Avatar";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { Dispatch, SetStateAction, useState } from "react";
import CalmIslandLogo from "../../../assets/img/calmisland_logo.png";
import StyledFAB from "../../../components/fabButton";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    cssFocused: {
        "&$cssFocused": {
            backgroundColor: "#dff0ff",
            color: "#000", // focused
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
        padding: theme.spacing(2, 4),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(2, 2),
        },
    },
    paperContainer: {
        borderRadius: 12,
        boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
    smallAvatar: {
        height: theme.spacing(4),
        marginRight: theme.spacing(1),
        width: theme.spacing(4),
    },
}));

interface Props {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

export default function LiveChatInput(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const [focusedInput, setFocusedInput] = useState(false);
    const { message, setMessage } = props;

    return (
        <Grid item xs={12} style={{ marginBottom: theme.spacing(3) }}>
            <Paper elevation={4} className={classes.paperContainer}>
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
                                src={CalmIslandLogo}
                            />
                        </Grid>
                    </Hidden>
                    <Grid item style={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            id="live-chat-input"
                            label="Share something here"
                            variant="filled"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
                                            src={CalmIslandLogo}
                                            className={classes.smallAvatar}
                                        />
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
            </Paper>
        </Grid>
    );
}
