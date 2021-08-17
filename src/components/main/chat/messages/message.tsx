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
import { UserAvatar } from "kidsloop-px";
import React from "react";
import {
    FormattedDate,
    FormattedTime,
} from "react-intl";

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

export interface MessageProps {
    id: string;
    message: string;
    session: any;
}

function Message (props: MessageProps) {
    const classes = useStyles();
    const {
        id,
        message,
        session,
    } = props;

    return (
        <Grid
            container
            alignItems="center"
            className={clsx(classes.root, {
                [classes.rootTeacher]: session.isTeacher,
            })}>
            <Grid item>
                <UserAvatar
                    name={session.name}
                    size="medium"
                />
            </Grid>
            <Grid
                item
                xs
                className={classes.messageGrid}>
                <Typography className={classes.author}>
                    {session.name}
                    {session.isTeacher && <TeacherIcon
                        size="1rem"
                        className={classes.teacherIcon} />}

                    <Tooltip
                        placement="top"
                        title={
                            <>
                                <FormattedDate value={new Date(Number(id.split(`-`)[0]))} /> - <FormattedTime value={new Date(Number(id.split(`-`)[0]))} />
                            </>
                        }
                    >
                        <TimestampIcon
                            size="0.85rem"
                            className={classes.timeIcon} />
                    </Tooltip>
                </Typography>
                <div className={classes.message}>
                    <Typography>{message}</Typography>
                </div>
            </Grid>
        </Grid>
    );
}

export default Message;
