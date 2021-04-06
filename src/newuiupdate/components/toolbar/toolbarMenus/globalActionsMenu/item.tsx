import React from "react";

import { makeStyles, Grid, Theme, Box } from "@material-ui/core";

import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";

import clsx from "clsx";

interface GlobaActionsMenuProps {
	type?: any;
	icon?: any;
	title?: any;
	variant?: any;
	active?: any;
	onClick?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: "8px 16px",
		margin: "0 4px",
		cursor: "pointer",
		borderRadius: 10,
		display: "flex",
		color: amber[500],
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
	variantBlue:{
		color: theme.palette.text.primary,
		filter: "drop-shadow( 1px 3px 2px rgba(82, 128, 191, .2))",
	},
	variantRed:{
		color: red[500],
		filter: "drop-shadow( 1px 3px 2px rgba(255, 116, 106, .2))",
	},
	divider: {
		width: 1,
		backgroundColor: theme.palette.grey[200],
		margin: "0 4px",
	},
	icon: {
		display: "flex",
		alignItems: "center",
	},
}));

function GlobalActionsMenuItem(props: GlobaActionsMenuProps) {
	const { type, icon, title, variant, active, onClick } = props;

	const classes = useStyles();

	if (type === "divider") return <Grid item className={classes.divider}></Grid>;

	return (
		<Grid
			item
			className={clsx(
				classes.root, {
				[classes.active]:  active,
				[classes.variantBlue]:  variant === 'blue' && !active,
				[classes.variantRed]:  variant === 'red' && !active
				}
			)}
			onClick={onClick}
		>
			<div className={classes.icon}>{icon}</div>
		</Grid>
	);
}

export default GlobalActionsMenuItem;
