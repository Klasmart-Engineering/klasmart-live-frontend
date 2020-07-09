import { Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import CalmIslandLogo from "../../../assets/img/calmisland_logo.png";

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
        },
        smallAvatar: {
            height: theme.spacing(2),
            marginRight: theme.spacing(1),
            width: theme.spacing(2),
        },
    }));

interface Props {
    message: string;
    timestamp: number;
}

const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

export default function LiveChatInput(props: Props) {
    const classes = useStyles();
    const { message, timestamp } = props;
    const today = datesAreOnSameDay(new Date(), new Date(timestamp * 1000));

    return (
        <Grid item xs={12}>
            <Paper elevation={0} className={classes.paperContainer}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    className={classes.liveChatInput}
                    spacing={2}
                >
                    <Hidden smDown>
                        <Grid item md={1}>
                            <Avatar
                                alt="Shawn Lee"
                                src={CalmIslandLogo}
                            />
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} md={9}>
                        <Typography variant="body2" style={{ wordBreak: "break-word" }}>
                            { message }
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={2} style={{ textAlign: "right" }}>
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
                            <Typography variant="caption" color="primary">
                                { today ?
                                    <FormattedMessage id="chatMessage_today" /> :
                                    <FormattedDate value={new Date(timestamp * 1000)} />
                                } &nbsp;
                                <FormattedTime value={new Date(timestamp * 1000)} />
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}
