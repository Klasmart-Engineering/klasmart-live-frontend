import React from "react";

import { makeStyles, Grid, Theme, Box } from "@material-ui/core";
import red from "@material-ui/core/colors/red";

import clsx from "clsx";

interface GlobaActionsMenuProps {
	type?: any;
	icon?: any;
	title?: any;
	color?: any;
	active?: any;
	onClick?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {},
	item: {
		padding: "6px 12px",
		margin: "0 4px",
		cursor: "pointer",
		borderRadius: 10,
		display: "flex",
		filter: "drop-shadow( 1px 3px 2px rgba(255, 193,20, .2))",
		transition: "100ms all ease-in-out",
		"&:hover": {
			backgroundColor: theme.palette.grey[200],
			filter: "none",
		},
	},
	active: {
		backgroundColor: theme.palette.text.primary,
		filter: "none",
		color: '#fff',
		"&:hover": {
			backgroundColor: theme.palette.text.primary,
		},
	},
	divider: {
		width: 1,
		backgroundColor: theme.palette.grey[200],
	},
	icon: {
		display: "flex",
		alignItems: "center",
	},
}));

function GlobalActionsMenuItem(props: GlobaActionsMenuProps) {
	const { type, icon, title, color, active, onClick } = props;

	const classes = useStyles();

	if (type === "divider") return <Grid item className={classes.divider}></Grid>;

	return (
		<Grid
			item
			className={clsx(classes.item, active && classes.active)}
			onClick={onClick}
			style={{ color: !active && color }}
		>
			<div className={classes.icon}>{icon}</div>
		</Grid>
	);
}

export default GlobalActionsMenuItem;
