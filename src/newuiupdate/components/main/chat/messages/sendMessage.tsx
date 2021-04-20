import { LocalSessionContext } from "../../../../providers/providers";
import { useMutation } from "@apollo/react-hooks";
import {
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Theme,
} from "@material-ui/core";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import { gql } from "apollo-boost";
import React, { useContext, useState } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        padding: `4px`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: 10,
    },
    rootInput:{
        flex: 1,
    },
    input:{
        padding: `0 6px`,
    },
    iconButton:{
        padding: 10,
        borderRadius: 12,
        color: `#fff`,
        backgroundColor: theme.palette.text.primary,
        "&:hover":{
            backgroundColor: theme.palette.text.primary,
            opacity: 0.8,
        },
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

function SendMessage () {
    const classes = useStyles();

    const [ message, setMessage ] = useState(``);

    const { roomId } = useContext(LocalSessionContext);

    const [ sendMessage, { loading } ] = useMutation(SEND_MESSAGE);

    const submitMessage = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        sendMessage({
            variables: {
                roomId,
                message,
            },
        });
        setMessage(``);
    };

    return (
        <Paper
            component="form"
            className={classes.root}
            elevation={0}
            onSubmit={submitMessage}
        >
            <InputBase
                placeholder="Write your message"
                value={message}
                classes={{
                    root: classes.rootInput,
                    input: classes.input,
                }}
                onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
                aria-label="send"
                className={classes.iconButton}
                type="submit"
            >
                <SendIcon size="1.2rem"/>
            </IconButton>
        </Paper>
    );
}

export default SendMessage;
