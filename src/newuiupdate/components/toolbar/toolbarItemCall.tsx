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

const useStyles = makeStyles((theme: Theme) => ({
	itemRoot: {
		position: "relative",
	},
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		color: "#fff",
		backgroundColor: red[500],
		boxShadow: "0 3px 6px #fe434361",
		borderRadius: 50,
		cursor: "pointer",
		padding: 15,
		transition: "all 100ms ease-in-out",
		"&:hover": {
			transform: "scale(1.1)",
		},
		"& svg" : {
			width: '1.25em',
    		height: '1.25em',
		}
	},
	disabled: {
		opacity: 0.4,
		pointerEvents: "none",
		cursor: "default",
	},
	locked: {},
	active: {},
	badgeRoot: {
		position: "absolute",
		top: 0,
		right: 10,
	},
	badge: {
		background: "#fff",
		color: '#000',
		boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
	},
	badgeContent: {
		fontSize: "1em",
	},
}));

interface ToolbarItemCallProps {
	icon?: any;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	locked?: boolean;
	tooltip?: string;
}

function ToolbarItemCall(props: ToolbarItemCallProps) {
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
						{icon}
					</Box>
				</Box>
			</Tooltip>
		</>
	);
}

export default ToolbarItemCall;
