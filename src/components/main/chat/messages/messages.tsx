import Message from "./message";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { isKeyboardVisibleState } from "@/app/model/appModel";
import { useMessages } from "@/data/live/state/useMessages";
import { NoItemList } from "@/utils/utils";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import React,
{
    useEffect,
    useRef,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    fullHeight:{
        height: `100%`,
    },
    container:{
        padding : `1rem 10px`,
        paddingBottom: 0,
    },
    messagesContainer:{
        minWidth: 280,
    },
}));

function Messages () {
    const classes = useStyles();
    const intl = useIntl();

    const messages = useMessages();

    const messagesContainerEl = useRef<null | HTMLDivElement>(null);

    const { isIOS } = useCordovaSystemContext();
    const isKeyboardVisible = useRecoilValue(isKeyboardVisibleState);

    useEffect(() => {
        messagesContainerEl?.current?.children[messages.length - 1].scrollIntoView();
    }, [ messages ]);

    useEffect(() => {
        if (isKeyboardVisible && isIOS) {
            setTimeout(() => {
                messagesContainerEl?.current?.children[messages.length - 1].scrollIntoView();
            }, 500);
        }
    });

    return (
        <Grid
            container
            direction="column"
            className={classes.fullHeight}>
            <Grid
                item
                xs
                id="chat-container"
                classes={{
                    root: `chat-container`,
                }}
                className={classes.messagesContainer}>
                {messages.length === 0 ?
                    <NoItemList
                        icon={<ChatIcon />}
                        text={intl.formatMessage({
                            id: `chat_messages_noresults`,
                        })} /> :
                    (<div
                        ref={messagesContainerEl}
                        className={classes.container}>
                        {
                            messages.map((m, i) => <Message
                                key={i}
                                message={m}
                            />)
                        }
                    </div>)
                }
            </Grid>
        </Grid>
    );
}

export default Messages;
