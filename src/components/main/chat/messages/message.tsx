import { dialogsState } from "@/app/model/appModel";
import { ChatMessage } from "@/data/live/state/useMessages";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Grid,
    makeStyles,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { TimeFive as TimestampIcon } from "@styled-icons/boxicons-regular/TimeFive";
import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
import clsx from "clsx";
import Linkify from 'linkify-react';
import React,
{ FC } from "react";
import {
    FormattedDate,
    FormattedTime,
} from "react-intl";
import { useRecoilState } from "recoil";

const LINK_LENGTH_LIMIT = 80;

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        flexDirection: `row-reverse`,
        padding: `12px 0`,
    },
    rootTeacher:{
        flexDirection: `row`,
        "& $messageGrid":{
            paddingLeft: 10,
            paddingRight: 0,
            textAlign: `left`,
        },
        "& $message":{
            backgroundColor: amber[500],
            "&:after":{
                color: amber[500],
                left: -6,
                transform: `scale(-1)`,
            },
        },
        "& $author":{
            textAlign: `left`,
        },
    },
    messageGrid:{
        paddingRight: 10,
        textAlign: `right`,
    },
    message:{
        backgroundColor: theme.palette.background.default,
        padding: 10,
        borderRadius: 12,
        position: `relative`,
        textAlign: `left`,
        display: `inline-block`,
        maxWidth: 200,
        wordBreak: `break-word`,
        "&:after":{
            content: `''`,
            position: `absolute`,
            top: 10,
            left: `100%`,
            borderLeft: `6px solid black`,
            borderLeftColor: `inherit`,
            borderTop: `0 solid transparent`,
            borderBottom: `6px solid transparent`,
            color: theme.palette.background.default,
        },
    },
    author:{
        color: theme.palette.grey[600],
        textAlign: `right`,
    },
    teacherIcon:{
        margin : `2px 6px`,
    },
    timeIcon:{
        marginLeft: 5,
        color: theme.palette.grey[500],
    },
}));

interface MessageProps {
    message: ChatMessage;
    setUrlToOpen: (url: string) => void;
}

const Message: FC<MessageProps> = ({
    message: {
        text, timestamp, user,
    },
    setUrlToOpen,
}) => {
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const classes = useStyles();
    const name = user?.name ?? `Unknown User`;
    const isTeacher = !!user?.isTeacher;
    const date = new Date(timestamp);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    const handleLinkClick = (url: string) => {
        if (process.env.IS_CORDOVA_BUILD) {
            setUrlToOpen(url);
            setParentalLock(true);

        } else {
            window.open(url, `_blank`);
        }
    };

    const linkOptions = {
        attributes: {
            onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.preventDefault();
                const ref = e?.currentTarget?.getAttribute?.(`href`);
                if (ref) {
                    handleLinkClick(ref);
                }
            },
        },
        target: `_blank`,
        rel: `noopener noreferrer`,
        format: (value: string, type: string) => {
            if (type === `url` && value.length > LINK_LENGTH_LIMIT) {
                value = value.slice(0, LINK_LENGTH_LIMIT) + `…`;
            }
            return value;
        },
        validate: {
            email: false,
        },
    };

    return (
        <Grid
            container
            alignItems="center"
            className={clsx(classes.root, {
                [classes.rootTeacher]: isTeacher,
            })}
        >
            <Grid item>
                <UserAvatar
                    name={name}
                    size="medium"
                />
            </Grid>
            <Grid
                item
                xs
                className={classes.messageGrid}
            >
                <Typography className={classes.author}>
                    {name}
                    {isTeacher && (
                        <TeacherIcon
                            size="1rem"
                            className={classes.teacherIcon}
                        />
                    )}
                    <Tooltip
                        placement="top"
                        title={
                            <>
                                <FormattedDate value={date} /> - <FormattedTime value={date} />
                            </>
                        }
                    >
                        <TimestampIcon
                            size="0.85rem"
                            className={classes.timeIcon}
                        />
                    </Tooltip>
                </Typography>
                <div className={classes.message}>
                    <Linkify

                        options={linkOptions}
                    >
                        <Typography>{text}</Typography>
                    </Linkify>

                </div>
            </Grid>
        </Grid>
    );
};

export default Message;
