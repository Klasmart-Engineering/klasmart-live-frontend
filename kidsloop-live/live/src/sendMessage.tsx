import React, { useState, useContext } from "react";
import { CircularProgress, Paper, makeStyles, Theme, createStyles, InputBase, Divider, IconButton } from "@material-ui/core";
import SendTwoToneIcon from "@material-ui/icons/SendTwoTone";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { UserContext } from "./app";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 340,
            [theme.breakpoints.down("sm")]: {
                width: "100%",
            },
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
            color: "#000", // focused
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
export function SendMessage (): JSX.Element {
    const classes = useStyles();

    const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
    const [message, setMessage] = useState("");
    const {roomId} = useContext(UserContext);

    function send() {
        sendMessage({ variables: { roomId, message } });
        setMessage("");
    }

    return (
        <Paper 
            component="form"
            className={classes.root}
            onSubmit={(e) => { e.preventDefault(); send();}}
        >
            <InputBase
                className={classes.input}
                placeholder="Share something here"
                inputProps={{ "aria-label": "input a message here" }}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton 
                aria-label="send"
                className={classes.iconButton} 
                color="primary"
                onClick={() => send()}
                type="submit"
            >
                {!loading ? <SendTwoToneIcon />: <CircularProgress size={12}/>}
            </IconButton>
        </Paper>
    );
}