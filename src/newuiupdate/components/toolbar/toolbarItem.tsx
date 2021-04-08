import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme, Box, Grid, Theme, Typography, Badge, Tooltip } from "@material-ui/core";

import amber from "@material-ui/core/colors/amber";

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
		position: 'relative',
		color: theme.palette.text.primary,
		"&:hover": {
			backgroundColor: "#e2e7ec",
		},
		"& > svg":{
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
	},
	badgeRoot: {
		position: "absolute",
		top: 6,
		right: 6,
	},
	badge: {
		width: 26,
		height: 26,
		borderRadius: 20,
		color: theme.palette.text.primary,
		backgroundColor: amber[500],
		boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
		padding: 0,
		zIndex: 1200,
		fontSize: '0.8em',
		"& svg":{
			height: 16,
			width: 16,
		}
	},
	badgeContent: {
		fontSize: "1em",
	},
}));

interface ToolbarItemProps {
	icon?: any;
	label?: string;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	badge?: any;
	tooltip?: string | boolean;
}

function ToolbarItem(props: ToolbarItemProps) {
	const { icon, label, onClick, disabled, active, badge, tooltip = false} = props;
	const classes = useStyles();
	const hasTooltip = tooltip ? true : false;

	return (
		<>
			<Tooltip title={tooltip} disableFocusListener={!hasTooltip} disableHoverListener={!hasTooltip} disableTouchListener={!hasTooltip}>
				<div>
					<Box
						className={clsx(
							classes.root,
							disabled && classes.disabled,
							active && classes.active
						)}
						onClick={onClick}
					>
					{badge && (
						<Badge
							classes={{ badge: classes.badge, root: classes.badgeRoot }}
							badgeContent={<Box className={classes.badgeContent}>{badge}</Box>}
						></Badge>
					)}
					{icon}
					{label && <Typography className={classes.label}>{label}</Typography>}
				</Box>
				</div>
			</Tooltip>
		</>
	);
}

export default ToolbarItem;
