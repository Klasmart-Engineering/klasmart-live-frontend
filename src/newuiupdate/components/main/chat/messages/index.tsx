import Message from "./item";
import SendMessage from "./sendMessage";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import React from "react";
import { NoItemList } from "../../../utils";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
    messagesContainer:{
        overflowY: `scroll`,
    },
}));

const messages = [
    {
        id: `1`,
        session: {
            id: 1,
            name: `Tim Jones`,
            role: `student`,
        },
        message: `Hello everyone, my name is Timmy but you can call me Tim.`,
    },
    {
        id: `2`,
        session: {
            id: 1,
            name: `Joy Phillips`,
            role: `student`,
        },
        message: `Hi Tim. My name is Joy. Nice to meet you`,
    },
    {
        id: `3`,
        session: {
            id: 1,
            name: `Tim Jones`,
            role: `teacher`,
        },
        message: `Hi Ziko, my name is Time. Let us all be friends`,
    },
];

function Messages () {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs
                className={classes.messagesContainer}>
                {messages.length === 0 ?
                    <NoItemList icon={<ChatIcon />} text='No messages' /> :
                    (<Box className={classes.container}>
                        {messages.map(message => (
                            <Message
                                key={message.id}
                                id={message.id}
                                session={message.session}
                                message={message.message} />
                        ))}
                    </Box>)
                }
            </Grid>
            <Grid item>
                <SendMessage />
            </Grid>
        </Grid>
    );
}

export default Messages;