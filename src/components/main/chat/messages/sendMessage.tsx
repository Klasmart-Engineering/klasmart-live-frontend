import { THEME_COLOR_BACKGROUND_DEFAULT } from "@/config";
import { useSendMessageMutation } from "@/data/live/mutations/useSendMessageMutation";
import { IconButton, InputBase, Paper, Theme, Tooltip } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import clsx from "clsx";
import React,
{
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0.5),
        display: `flex`,
        alignItems: `center`,
        borderRadius: theme.spacing(1.25),
        background: theme.palette.grey[200],
        border: `2px solid transparent`,
    },
    rootFocused: {
        borderColor: THEME_COLOR_BACKGROUND_DEFAULT,
    },
    rootInput: {
        flex: 1,
    },
    input: {
        padding: theme.spacing(0, 0.75),
    },
    iconButton: {
        padding: theme.spacing(1.25),
        borderRadius: theme.spacing(1.5),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.text.primary,
        "&:hover": {
            backgroundColor: theme.palette.text.primary,
            opacity: 0.8,
        },
    },
}));

function SendMessage () {
    const classes = useStyles();
    const intl = useIntl();

    const [ message, setMessage ] = useState(``);
    const [ formFocus, setFormFocus ] = useState(false);
    const sendMessage = useSendMessageMutation();

    const submitMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(message);
        setMessage(``);
    };

    const inputRef = React.useRef<HTMLInputElement>();

    const eventHandlers = useMemo(() => ({
        onFocus: () => setFormFocus(true),
        onBlur: () => setFormFocus(false),
        onClick: () => inputRef.current?.focus(),
    }), []);

    return (
        <form
            {...eventHandlers}
            onSubmit={submitMessage}
        >
            <Paper
                className={clsx(classes.root, {
                    [classes.rootFocused]: formFocus,
                })}
                elevation={0}
            >
                <InputBase
                    inputRef={inputRef}
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
                <Tooltip
                    title={intl.formatMessage({
                        id: `live.class.chat.sendMessage`,
                        defaultMessage: `Send message`,
                    })}
                    placement="top"
                >
                    <IconButton
                        aria-label="send"
                        className={classes.iconButton}
                        type="submit"
                        size="large">
                        <SendIcon size="1.2rem"/>
                    </IconButton>
                </Tooltip>
            </Paper>
        </form>
    );
}

export default SendMessage;
