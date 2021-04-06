import React from "react";
import clsx from "clsx";
import {
	makeStyles,
	useTheme,
	Box,
	Grid,
	Badge,
	Theme,
	Tooltip,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import LockIcon from "@material-ui/icons/Lock";

import MicRoundedIcon from "@material-ui/icons/MicRounded";
import MicOffRoundedIcon from "@material-ui/icons/MicOffRounded";

const useStyles = makeStyles((theme: Theme) => ({
	itemRoot: {
		position: "relative",
	},
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		fontSize: "0.75em",
		borderRadius: 12,
		cursor: "pointer",
		padding: 15,
		transition: "all 100ms ease-in-out",
		color: red[500],
		margin: "0 5px",
		"&:hover": {
			backgroundColor: "#e2e7ec",
		},
		"& svg" : {
			width: '1.25em',
    		height: '1.25em',
		}
	},
	active: {
		color: "inherit",
		"&:hover": {
			color: "inherit",
		},
	},
	locked: {
		opacity: 0.4,
		pointerEvents: "none",
		backgroundColor: "#e2e7ec",
		cursor: "default",
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
		top: 0,
		right: 10,
	},
	badge: {
		background: "#fff",
		boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
	},
	badgeContent: {
		fontSize: "1em",
	},
}));

interface ToolbarItemMicrophoneProps {
	icon?: any;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	locked?: boolean;
	tooltip?: string;
}

function ToolbarItemMicrophone(props: ToolbarItemMicrophoneProps) {
	const { icon, onClick, disabled, active, locked, tooltip = false } = props;
	const classes = useStyles();
	const hasTooltip = tooltip ? true : false;

	return (
		<>
			<Tooltip title={tooltip} disableFocusListener={!hasTooltip} disableHoverListener={!hasTooltip} disableTouchListener={!hasTooltip}>
				<Box className={classes.itemRoot}>
					{locked && (
						<Badge
							classes={{ badge: classes.badge, root: classes.badgeRoot }}
							badgeContent={<LockIcon className={classes.badgeContent} />}
						></Badge>
					)}

					<Box
						className={clsx(
							classes.root,
							disabled && classes.disabled,
							active && classes.active,
							locked && classes.locked
						)}
						onClick={onClick}
					>
						{active ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
					</Box>
				</Box>
			</Tooltip>
		</>
	);
}

export default ToolbarItemMicrophone;
