import React from "react";
import Layout from "./components/Layout";
import { themeProvider } from "./themeProvider";
import clsx from "clsx";
import { selectLayout } from "./features/layoutSlice";
import { useSelector } from "react-redux";
import { makeStyles, useTheme, Box, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: themeProvider) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		fontSize: "0.6em",
		borderRadius: 12,
		cursor: "pointer",
		padding: 15,
		transition: "all 100ms ease-in-out",
		"&:hover": {
			backgroundColor: "#e2e7ec",
		},
	},
	active: {
		backgroundColor: "#B4CDED",
	},
	disabled: {
		opacity: 0.4,
		pointerEvents: "none",
		cursor: "default",
	},
	label: {
		marginTop: 10,
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
			{label && <Box className={classes.label}>{label}</Box>}
		</Box>
	);
}

export default ToolbarItem;
