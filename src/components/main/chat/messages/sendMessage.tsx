import { THEME_COLOR_BACKGROUND_DEFAULT } from "@/config";
import { useSendMessageMutation } from "@/data/live/mutations/useSendMessageMutation";
import {
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Theme,
    Tooltip,
} from "@material-ui/core";
import { SendPlane as SendIcon } from "@styled-icons/remix-fill/SendPlane";
import clsx from "clsx";
import React,
{
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        padding: `4px`,
        display: `flex`,
        alignItems: `center`,
        borderRadius: 10,
        background: theme.palette.grey[200],
        border: `2px solid transparent`,
    },
    rootFocused:{
        borderColor: THEME_COLOR_BACKGROUND_DEFAULT,
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
    const [ formFocus, setFormFocus ] = useState(false);
    const sendMessage = useSendMessageMutation();

    const submitMessage = (e: React.FormEvent<HTMLDivElement>) => {
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
        <Paper
            component="form"
            className={clsx(classes.root, {
                [classes.rootFocused]: formFocus,
            })}
            elevation={0}
            {...eventHandlers}
            onSubmit={submitMessage}
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
                >
                    <SendIcon size="1.2rem"/>
                </IconButton>
            </Tooltip>
        </Paper>
    );
}

export default SendMessage;
