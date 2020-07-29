import { Typography, makeStyles, Theme, createStyles, Grid, Paper } from "@material-ui/core";
import React from "react";
import { Message } from "./room";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { mapGenerator } from "./utils/map";
import Tooltip from "@material-ui/core/Tooltip";
import { AccessTime as TimestampIcon } from "@styled-icons/material-twotone/AccessTime";

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
            padding: theme.spacing(0.5, 0.5, 0.5, 2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(0.5, 1),
            }
        },
        paperContainer: {
            border: "1px solid #c9caca",
            borderRadius: 12,
            margin: theme.spacing(0.5),
            [theme.breakpoints.down("sm")]: {
                margin: theme.spacing(0.5),
            },
        },
        smallAvatar: {
            height: theme.spacing(2),
            marginRight: theme.spacing(1),
            width: theme.spacing(2),
        },
        wrappedText: {
            whiteSpace: "pre-line",
            wordBreak: "break-all",
        }
    }));

interface Props { messages: Map<string, Message> }

function Messages ({ messages }: Props): JSX.Element {
    const classes = useStyles();

    if (!messages || messages.size === 0) {
        return (
            <Typography style={{ color: "rgb(200,200,200)", padding: 4 }}>
                <FormattedMessage id="no_messages" />
            </Typography>
        );
    }

    return <>
        {
            [...mapGenerator(messages, ([,m], i) => (
                // TODO: Animation for chat messages
                <Grid item xs={12}>
                    <Paper elevation={0} className={classes.paperContainer}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-end"
                            className={classes.liveChatInput}
                        >
                            <Grid item xs={12} md={11}>
                                <Typography className={classes.wrappedText} variant="body2">
                                    <strong>{`${m.session.name}`}</strong>{`: ${m.message}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={1} style={{ textAlign: "right" }}>
                                <Grid container item xs={12} justify="flex-end" alignItems="center">
                                    <Tooltip 
                                        placement="left"
                                        title={
                                            <>
                                                <FormattedDate value={new Date(Number(m.id.split("-")[0]))} />
                                                    &nbsp;
                                                <FormattedTime value={new Date(Number(m.id.split("-")[0]))} />
                                            </>
                                        }
                                    >
                                        <TimestampIcon fontSize="small" style={{ color: "#e0e1e1" }}/>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            ))]
        }
    </>;
}

export { Messages as default };
