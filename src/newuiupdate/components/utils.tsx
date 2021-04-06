import React, { useState } from "react";
import {
	makeStyles,
	Theme,
	Drawer,
	Box,
	Popper,
	Fade,
	Paper,
} from "@material-ui/core";

interface StyledDrawerProps {
	children?: any;
	active?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
	styledDrawerRoot: {
		flexShrink: 0,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shortest,
		}),

		paddingLeft: theme.spacing(2),
	},
	styledDrawerPaper: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shortest,
		}),
		border: 0,
		backgroundColor: theme.palette.grey[200],
		borderRadius: 12,
	},
	styledDrawerInner: {
		padding: 10,
	},
	popperPapper: {
		borderRadius: 12,
		overflow: 'hidden'
	},
}));

function StyledDrawer(props: StyledDrawerProps) {
	const classes = useStyles();

	const [drawerWidth, setDrawerWidth] = useState<any>(340);
	const { children, active } = props;

	return (
		<Drawer
			anchor="right"
			open={active}
			classes={{
				root: classes.styledDrawerRoot,
				paper: classes.styledDrawerPaper,
			}}
			PaperProps={{
				style: { position: "absolute", width: drawerWidth },
			}}
			BackdropProps={{ style: { position: "absolute" } }}
			ModalProps={{
				container: document.getElementById("main-content"),
				style: { position: "absolute" },
			}}
			variant="persistent"
			style={{ width: active ? drawerWidth : 0 }}
		>
			<Box className={classes.styledDrawerInner}>{children}</Box>
		</Drawer>
	);
}

export { StyledDrawer };

interface StyledPopperProps {
	children: any;
	open?: boolean;
	anchorEl?: any;
}

function StyledPopper(props: StyledPopperProps) {
	const classes = useStyles();
	const { children, open, anchorEl } = props;

	return (
		<Popper
			open={open ? true : false}
			anchorEl={anchorEl}
			disablePortal={false}
			placement="top"
			transition
			modifiers={{
				preventOverflow: {
					boundariesElement: document.getElementById("main-content"),
				},
			}}
		>
			<Fade in={open}>
				<Paper elevation={3} className={classes.popperPapper}>{children}</Paper>
			</Fade>
		</Popper>
	);
}

export { StyledPopper };
