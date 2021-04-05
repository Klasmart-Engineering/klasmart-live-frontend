import React from "react";

import { makeStyles, Grid, Box, Theme } from "@material-ui/core";

import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";


import { StyledPopper } from "../../../utils";

import { useRecoilState } from "recoil";

import {
	viewModeState,
	isViewModesOpenState,
} from "../../../../states/layoutAtoms";



import clsx from "clsx";


const useStyles = makeStyles((theme: Theme) => ({
	item:{
		cursor: 'pointer',
		padding: '10px 12px',
	},
	itemIcon:{
		padding: '10',
		"& svg":{
			height: 20
		}
	},
	active:{
		backgroundColor: theme.palette.background.default
	}
}));


function ViewModesMenu(props) {
	const { anchor } = props;
	const classes = useStyles();


	const [viewMode, setViewMode] = useRecoilState(
		viewModeState
	);

	const [isViewModesOpen, setIsViewModesOpen] = useRecoilState(
		isViewModesOpenState
	);


	const items = [
		{
			id: "1",
			title: "On Stage",
			icon: <OnStageIcon size="1.7rem" />,
			isActive: viewMode === 'onstage',
			onClick: () => setViewMode('onstage'),
		},{
			id: "2",
			title: "Observe",
			icon: <ObserveIcon size="1.7rem" />,
			isActive: viewMode === 'observer',
			onClick: () => setViewMode('observer'),
		},{
			id: "3",
			title: "Present",
			icon: <PresentIcon size="1.7rem" />,
			isActive: viewMode === 'present',
			onClick: () => setViewMode('present'),
		},
	];

	return (
		<StyledPopper open={isViewModesOpen} anchorEl={anchor}>
			<Grid container alignItems="stretch">
				{items.map(item => (
				<div>
					<Grid container direction="column" alignItems="center" className={clsx(classes.item, item.isActive && classes.active)} onClick={item.onClick}>
						<Grid item>
							<Box className={classes.itemIcon}>{item.icon}</Box>
							</Grid>
						<Grid item>{item.title}</Grid>
					</Grid>
				</div>
				))}
			</Grid>
		</StyledPopper>
	);
}

export default ViewModesMenu;
