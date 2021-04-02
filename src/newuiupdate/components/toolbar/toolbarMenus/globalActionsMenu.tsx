import React from "react";

import { makeStyles, Grid, Theme, Paper, Fade, Grow } from "@material-ui/core";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";

import { ScreenShare as ScreenShareIcon } from "@styled-icons/material-twotone/ScreenShare";
import { Pencil as PencilIcon } from "@styled-icons/boxicons-solid/Pencil";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { TrophyFill as TrophyFillIcon } from "@styled-icons/bootstrap/TrophyFill";
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";

import { useRecoilState } from "recoil";
import { isGlobalActionsOpenState } from "../../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
		display: "flex",
	},
	item: {
		display: "flex",
	},
	divider:{
		width: 1,
		background: theme.palette.grey[500]
	}
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function GlobalActionsMenu(props: GlobaActionsMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isGlobalActionsOpen, setIsGlobalActionsOpen] = useRecoilState(
		isGlobalActionsOpenState
	);

	return (
		<Popper
			open={isGlobalActionsOpen}
			anchorEl={anchor}
			disablePortal={false}
			placement="top"
			transition
			modifiers={{
				preventOverflow: {
					boundariesElement: document.getElementById("main-content"),
				},
			}}
		>
			<Grow in={isGlobalActionsOpen}>
				<Paper className={classes.root}>
					<Grid container>
						<Grid item className={classes.item}><ScreenShareIcon size="2.25rem" /></Grid>
						<Grid item className={classes.divider}></Grid>
						<Grid item className={classes.item}><PencilIcon size="2rem" /></Grid>
						<Grid item className={classes.item}><MicFillIcon size="2rem" /></Grid>
						<Grid item className={classes.divider}></Grid>
						<Grid item className={classes.item}><CameraVideoFillIcon size="2rem" /></Grid>
						<Grid item className={classes.item}><TrophyFillIcon size="2rem" /></Grid>
						<Grid item className={classes.item}><HandThumbsUpFillIcon size="2rem" /></Grid>
						<Grid item className={classes.item}><StarFillIcon size="2rem" /></Grid>
						<Grid item className={classes.item}><HeartFillIcon size="2rem" /></Grid>
					</Grid>
				</Paper>
			</Grow>
		</Popper>
	);
}

export default GlobalActionsMenu;
