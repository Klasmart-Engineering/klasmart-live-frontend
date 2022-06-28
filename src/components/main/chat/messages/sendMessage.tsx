import { THEME_COLOR_BACKGROUND_DEFAULT } from "@/config";
import { useSendMessageMutation } from "@/data/live/mutations/useSendMessageMutation";
import {
    IconButton,
    makeStyles,
    Paper,
    TextareaAutosize,
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

const isApp = process.env.IS_CORDOVA_BUILD;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: `4px`,
        display: `flex`,
        alignItems: `center`,
        background: theme.palette.grey[200],
        border: `2px solid transparent`,
        borderRadius: 10,
    },
    textArea: {
        display: `flex`,
        alignItems: `center`,
        background: `none`,
        border: `none`,
        flex: 1,
        resize: `none`,
        fontFamily: theme.typography.fontFamily,
        '&:focus': {
            outline: `none`,
        },
    },
    rootFocused: {
        borderColor: THEME_COLOR_BACKGROUND_DEFAULT,
    },
    rootInput: {
        flex: 1,
    },
    input: {
        padding: `0 6px`,
    },
    iconButton: {
        alignSelf: `end`,
        padding: 10,
        borderRadius: 12,
        color: `#fff`,
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

    const submitMessage = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        sendMessage(message);
        setMessage(``);
    };

    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const eventHandlers = useMemo(() => ({
        onFocus: () => setFormFocus(true),
        onBlur: () => setFormFocus(false),
        onClick: () => inputRef.current?.focus(),
    }), []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isApp && e.key === `Enter` && !e.shiftKey) {
            e.preventDefault();
            sendMessage(message);
            setMessage(``);
        }
    };

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
            <TextareaAutosize
                ref={inputRef}
                placeholder={intl.formatMessage({
                    id: `chat_messages_write_placeholder`,
                })}
                value={message}
                className={classes.textArea}
                maxRows={4}
                onKeyDown={handleKeyDown}
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
                    <SendIcon size="1.2rem" />
                </IconButton>
            </Tooltip>
        </Paper>
    );
}

export default SendMessage;
