import React from "react";

import {
	makeStyles,
	Grid,
	Theme,
    Typography,
    Box
} from "@material-ui/core";

import teal from "@material-ui/core/colors/teal";

import { UserAvatar } from "kidsloop-px"
import clsx from "clsx";

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
            backgroundColor: teal[400],
            color: '#fff'
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
        borderRadius: 12
    },
    author:{
        color: theme.palette.grey[600],
        textAlign: 'right'
    },
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
                <Typography className={classes.author}>{session.name}</Typography>
                <Box className={classes.message}>
                    <Typography>{message}</Typography>
                </Box>
            </Grid>
		</Grid>
	);
}

export default Message;