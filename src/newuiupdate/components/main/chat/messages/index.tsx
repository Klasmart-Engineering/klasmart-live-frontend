import React from "react";

import {
	makeStyles,
	Box,
	Grid,
	Theme,
	Typography
} from "@material-ui/core";

import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";

import Message from "./item";
import SendMessage from "./sendMessage";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight:{
		height: '100%'
	},
	container:{
		padding : `1rem 10px`,
		paddingBottom: 0,
	},
	messagesContainer:{
		overflowY: 'scroll'
	},
	noResultContainer:{
		
	},
	noResultIcon:{
		color: theme.palette.grey[300],
		marginBottom: 10
	},
	noResultText:{
		color: theme.palette.grey[700]
	}
}));


const messages = [
	{
		id: '1',
		session: {
			id: 1,
			name: 'Tim Jones',
			role: 'student',
		},
		message: "Hello everyone, my name is Timmy but you can call me Tim.",
	},{
		id: '2',
		session: {
			id: 1,
			name: 'Joy Phillips',
			role: 'student',
		},
		message: "Hi Tim. My name is Joy. Nice to meet you",
	},{
		id: '3',
		session: {
			id: 1,
			name: 'Tim Jones',
			role: 'teacher',
		},
		message: "Hi Ziko, my name is Time. Let us all be friends",
	},
];



function Messages() {
	const classes = useStyles();

	return (
		<Grid container direction="column" className={classes.fullHeight}>
			<Grid item xs className={classes.messagesContainer}>
				{messages.length === 0 ? 
					<NoMessages /> : 
					(<Box className={classes.container}>
						{messages.map(message => (
							<Message id={message.id} session={message.session} message={message.message} />
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

function NoMessages(){
	const classes = useStyles();
	
	return (
		<Box display="flex" justifyContent="center" alignItems="center" className={classes.fullHeight}>
			<Box display="flex" flexDirection="column" alignItems="center">
				<ChatIcon size="4rem" className={classes.noResultIcon} />
				<Typography className={classes.noResultText}>No messages</Typography>
			</Box>
		</Box>
	);
}