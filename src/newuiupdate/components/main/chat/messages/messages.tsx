import { RoomContext } from "../../../../providers/roomContext";
import { NoItemList } from "../../../utils/utils";
import Message from "./message";
import SendMessage from "./sendMessage";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import React, {
    useContext, useEffect, useRef,
} from "react";
import { useIntl } from "react-intl";

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
        minHeight: 300,
        minWidth: 280,
    },
}));

function Messages () {
    const classes = useStyles();
    const intl = useIntl();

    const { messages:messagesData } = useContext(RoomContext);

    const messages:any = Array.from(messagesData);
    const messagesBox = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // TODO, useref + scrollintoview (if possible),

        const objDiv = document.querySelectorAll(`.chat-container`);
        if(objDiv.length) {
            for (let i of objDiv) {
                i.scrollTop = i.scrollHeight
            }
        }
    }, [ messages ]);

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs
                // ref={messagesBox}
                id="chat-container"
                classes={{root: 'chat-container'}}
                className={classes.messagesContainer}>
                {messages.length === 0 ?
                    <NoItemList
                        icon={<ChatIcon />}
                        text={intl.formatMessage({
                            id: `chat_messages_noresults`,
                        })} /> :
                    (<Box
                        className={classes.container}>
                        {messages.map((message:any) => (
                            <Message
                                key={message[1].id}
                                id={message[1].id}
                                session={message[1].session}
                                message={message[1].message} />
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
