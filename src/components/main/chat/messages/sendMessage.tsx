import { useSendMessageMutation } from "@/data/live/mutations/useSendMessageMutation";
import { useSessionContext } from "@/providers/session-context";
import {
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Theme,
} from "@material-ui/core";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        padding: `4px`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: 10,
        background: theme.palette.grey[200],
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
    const intl = useIntl();

    const [ message, setMessage ] = useState(``);
    const { roomId } = useSessionContext();

    const [ sendMessage ] = useSendMessageMutation();

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
                placeholder={intl.formatMessage({
                    id: `chat_messages_write_placeholder`,
                })}
                value={message}
                classes={{
                    root: classes.rootInput,
                    input: classes.input,
                }}
                inputProps={{
                    maxLength: 500,
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
