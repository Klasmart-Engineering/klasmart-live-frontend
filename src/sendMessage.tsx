import { gql, useMutation } from "@apollo/client";
// import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { Send as SendIcon } from "@styled-icons/material-twotone/Send";
import React, { useContext, useState } from "react";
import { DRAWER_WIDTH } from "./components/layout";
import { LocalSessionContext } from "./entry";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: DRAWER_WIDTH - theme.spacing(7),
            [theme.breakpoints.down("sm")]: {
                width: "100%",
            },
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
            // color: "#000", // focused
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }));


const SEND_MESSAGE = gql`
    mutation sendMessage($roomId: ID!, $message: String) {
        sendMessage(roomId: $roomId, message: $message) {
            id,
            message
        }
    }
`;
export function SendMessage(): JSX.Element {
    const classes = useStyles();

    const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
    const [message, setMessage] = useState("");
    const { roomId } = useContext(LocalSessionContext);

    function send() {
        sendMessage({ variables: { roomId, message } });
        setMessage("");
    }

    return (
        <Paper
            component="form"
            className={classes.root}
            onSubmit={(e) => { e.preventDefault(); send(); }}
        >
            <InputBase
                className={classes.input}
                placeholder="Share something here"
                // placeholder={<FormattedMessage id="share_something_here" />} // TODO: localization
                inputProps={{
                    "aria-label": "input a message here"
                }}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
                aria-label="send"
                className={classes.iconButton}
                onClick={() => send()}
                type="submit"
            >
                {!loading ? <SendIcon color="#0E78D5" size="1.25rem" /> : <CircularProgress size={12} />}
            </IconButton>
        </Paper>
    );
}