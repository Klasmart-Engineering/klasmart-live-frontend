import React, { useState } from "react";

import {
	makeStyles,
	Theme,
    Paper,
    InputBase,
    IconButton
} from "@material-ui/core";

import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 10
    },
    rootInput:{
        flex: 1
    },
    input:{ 
        padding: '0 6px',
    },
    iconButton:{
        padding: 10,
        borderRadius: 12,
        color: '#fff',
        backgroundColor: theme.palette.text.primary,
        "&:hover":{
            backgroundColor: theme.palette.text.primary,
            opacity: 0.8
        }
    }
}));



function SendMessage() {
	const classes = useStyles();

    const [message, setMessage] = useState("");

    const submitMessage = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault(); 
        // DO THE GRAPHQL STUFF HERE
        setMessage('');
    }

	return (
		<Paper
            component="form"
            className={classes.root}
            onSubmit={submitMessage}
            elevation={0}
        >
            <InputBase
                placeholder="Write your message"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                classes={{root: classes.rootInput, input: classes.input}}
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