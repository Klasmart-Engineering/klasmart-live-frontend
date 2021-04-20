import {
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Theme,
} from "@material-ui/core";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import React, { useState } from "react";

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

function SendMessage () {
    const classes = useStyles();

    const [ message, setMessage ] = useState(``);

    const submitMessage = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        // DO THE GRAPHQL STUFF HERE
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
