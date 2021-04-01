import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";
import CreateIcon from "@material-ui/icons/Create";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";

import ToolbarItem from "./toolbarItem";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
	},
	iconGroup: {
		display: "flex",
	},
}));

function Toolbar() {
	const classes = useStyles();

	return (
		<Grid container justify="space-between" className={classes.root}>
			<Grid item className={classes.iconGroup}>
				<ToolbarItem icon={<HelpIcon />} label="Class Name" />
				<ToolbarItem icon={<CreateIcon />} label="Canvas" />
			</Grid>
			<Grid item className={classes.iconGroup}>
				<ToolbarItem icon={<HelpIcon />} label="Class Name" />
				<ToolbarItem
					variant="caller"
					icon={<PhoneInTalkIcon />}
					label="Canvas"
				/>
				<ToolbarItem icon={<CreateIcon />} label="Canvas" />
			</Grid>
			<Grid item className={classes.iconGroup}>
				<ToolbarItem icon={<HelpIcon />} label="Class Name" />
				<ToolbarItem icon={<CreateIcon />} label="Canvas" />
			</Grid>
		</Grid>
	);
}

export default Toolbar;
