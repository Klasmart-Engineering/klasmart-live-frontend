import { createStyles, Grid, makeStyles, Paper, Slide, Theme, Typography } from "@material-ui/core";
import React from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import { Message } from "./room";
import { mapGenerator } from "./utils/map";

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
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        paperContainer: {
            border: "1px solid #c9caca",
            borderRadius: 12,
            margin: theme.spacing(1, 0),
        },
        smallAvatar: {
            height: theme.spacing(2),
            marginRight: theme.spacing(1),
            width: theme.spacing(2),
        },
    }));

interface Props { messages: Map<string, Message>; }

export function Messages({ messages }: Props): JSX.Element {
    const classes = useStyles();

    if (!messages || messages.size === 0) { return <Typography style={{ color: "rgb(200,200,200)" }}>No messages yet...</Typography>; }

    return <>
        {
            [...mapGenerator(messages, ([, m], i) => (
                <Slide key={m.id} direction="right" in={i < 32} mountOnEnter unmountOnExit>
                    <Grid item xs={12}>
                        <Paper elevation={0} className={classes.paperContainer}>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                className={classes.liveChatInput}
                                spacing={1}
                            >
                                <Grid item xs={12} md={9}>
                                    <Typography variant="body2" style={{ wordBreak: "break-word" }}>
                                        { `${m.session.name}: ${m.message}` }
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
                                    <Grid container item xs={12} justify="flex-end" alignItems="center">
                                        <Typography variant="caption" color="primary">
                                            <FormattedDate value={new Date(Number(m.id.split("-")[0]))} />
                                            &nbsp;
                                            <FormattedTime value={new Date(Number(m.id.split("-")[0]))} />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Slide>
            ))]
        }
    </>;
}
