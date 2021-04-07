import React, { useState } from "react";

import {
	makeStyles,
	useTheme,
	Box,
	Grid,
	Theme,
	Drawer,
	Tabs, 
	Tab
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight:{
		height: '100%'
	}
}));


const attachments = [
	{
		id: 1,
		title: "Image.jpg",
		timestamp: ""
	},{
		id: 2,
		title: "Image.jpg",
		timestamp: ""
	},{
		id: 3,
		title: "Image.jpg",
		timestamp: ""
	},
];


function Attachments() {
	const classes = useStyles();
	return (
		<Grid container direction="column" className={classes.fullHeight}>
			<Grid item xs>
				{attachments.map(attachment => (
					<div>{attachment.title}</div>
				))}
			</Grid>
		</Grid>
	);
}

export default Attachments;