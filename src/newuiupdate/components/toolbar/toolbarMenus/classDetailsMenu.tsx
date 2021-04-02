import React from "react";

import { makeStyles, Grid, Theme, Paper, Fade } from "@material-ui/core";
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
import { isClassDetailsOpenState } from "../../../states/layoutAtoms";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 10,
		justifyContent: "space-between",
	},
	iconGroup: {
		display: "flex",
		alignItems: "center",
	},
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function ClassDetailsMenu(props: GlobaActionsMenuProps) {
	const { anchor } = props;
	const classes = useStyles();

	const [isClassDetailsOpen, setIsClassDetailsOpen] = useRecoilState(
		isClassDetailsOpenState
	);

	return (
		<Popper
			open={isClassDetailsOpen}
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
			<Fade in={isClassDetailsOpen}>
				<Paper>ClassDetails</Paper>
			</Fade>
		</Popper>
	);
}

export default ClassDetailsMenu;
