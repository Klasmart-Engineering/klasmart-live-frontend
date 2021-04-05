import React from "react";

import { makeStyles, Grid, Box, Theme, Typography } from "@material-ui/core";

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
		padding: '12px 20px',
	},
	itemIcon:{
		padding: 10,
		background: '#fff',
		border: '1px solid',
		borderRadius: 50,
		marginBottom: 10,
		"& svg":{
			height: 20,
			width: 20,
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
			icon: <OnStageIcon />,
			isActive: viewMode === 'onstage',
			onClick: () => setViewMode('onstage'),
		},{
			id: "2",
			title: "Observe",
			icon: <ObserveIcon />,
			isActive: viewMode === 'observer',
			onClick: () => setViewMode('observer'),
		},{
			id: "3",
			title: "Present",
			icon: <PresentIcon />,
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
						<Grid item>
							<Typography>{item.title}</Typography>
						</Grid>
					</Grid>
				</div>
				))}
			</Grid>
		</StyledPopper>
	);
}

export default ViewModesMenu;
