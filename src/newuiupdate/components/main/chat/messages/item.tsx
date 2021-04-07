import React from "react";

import {
	makeStyles,
	Grid,
	Theme,
    Typography,
    Box
} from "@material-ui/core";

import { UserAvatar } from "kidsloop-px"
import clsx from "clsx";

import { HatGraduation as TeacherIcon } from "@styled-icons/fluentui-system-filled/HatGraduation";
import amber from "@material-ui/core/colors/amber";


const useStyles = makeStyles((theme: Theme) => ({
    root:{
        flexDirection: 'row-reverse',
        padding: '12px 0'
    },
    rootTeacher:{
        flexDirection: 'row',
        "& $messageGrid":{
            paddingLeft: 10,
            paddingRight: 0,
        },
        "& $message":{
            backgroundColor: amber[500],
            "&:after":{
                color: amber[500],
                left: -6,
                transform: 'scale(-1)'
            }
        },
        "& $author":{
            textAlign: 'left'
        }
    },
    messageGrid:{
        paddingRight: 10
    },
    message:{
        backgroundColor: theme.palette.background.default,
        padding: 10,
        borderRadius: 12,
        position: 'relative',
        "&:after":{
            content: "''",
            position: 'absolute',
            top: 10,
            left: '100%',
            borderLeft: '6px solid black',
            borderLeftColor: 'inherit',
            borderTop: '0 solid transparent',
            borderBottom: '6px solid transparent',
            color: theme.palette.background.default,
        }
    },
    author:{
        color: theme.palette.grey[600],
        textAlign: 'right'
    },
    teacherIcon:{
        margin : '2px 6px'
    }
}));

export interface MessageProps {
    id: string,
    message: string,
    session: any,
}

function Message(props: MessageProps) {
	const classes = useStyles();
    const {id, message, session} = props;

	return (
		<Grid container alignItems="center" className={clsx(classes.root, {
            [classes.rootTeacher]: session.role === 'teacher'
        })}>
            <Grid item>
                <UserAvatar
                    name={session.name}
                    size="medium"
                />
            </Grid>
            <Grid item xs className={classes.messageGrid}>
                <Typography className={classes.author}>
                    {session.name} 
                    {session.role === 'teacher' && <TeacherIcon size="1rem" className={classes.teacherIcon} />}
                </Typography>
                <Box className={classes.message}>
                    <Typography>{message}</Typography>
                </Box>
            </Grid>
		</Grid>
	);
}

export default Message;