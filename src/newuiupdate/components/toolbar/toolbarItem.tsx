import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme, Box, Grid, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderRadius: 12,
		cursor: "pointer",
		padding: 15,
		margin: "0 4px",
		transition: "all 100ms ease-in-out",
		color: theme.palette.text.primary,
		"&:hover": {
			backgroundColor: "#e2e7ec",
		},
		"& svg":{
			height: 25,
		}
	},
	active: {
		backgroundColor: "#B4CDED",
		"&:hover": {
			backgroundColor: "#B4CDED",
		},
	},
	disabled: {
		opacity: 0.4,
		pointerEvents: "none",
		cursor: "default",
	},
	label: {
		marginTop: 10,
		fontSize: "0.75em",
	},
}));

interface ToolbarItemProps {
	icon?: any;
	label?: string;
	variant?: "caller" | "device";
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
}

function ToolbarItem(props: ToolbarItemProps) {
	const { icon, label, onClick, disabled, active, variant } = props;
	const classes = useStyles();

	return (
		<Box
			className={clsx(
				classes.root,
				disabled && classes.disabled,
				active && classes.active
			)}
			onClick={onClick}
		>
			{icon}
			{label && <Typography className={classes.label}>{label}</Typography>}
		</Box>
	);
}

export default ToolbarItem;
