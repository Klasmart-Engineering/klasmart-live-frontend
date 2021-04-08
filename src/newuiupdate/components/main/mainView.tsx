import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";

import OnStage from "./viewModes/onStage";
import Observer from "./viewModes/Observer";
import Present from "./viewModes/Present";

import { useRecoilState } from "recoil";
import { viewModeState, isActiveGlobalScreenshareState } from "../../states/layoutAtoms";
import Screenshare from "./viewModes/Screenshare";



const useStyles = makeStyles((theme: Theme) => ({
	root: {
		background: theme.palette.grey[200],
		borderRadius: 12,
		height: "100%",
	},
}));

function MainView() {
	const classes = useStyles();
	const [viewMode, setViewMode] = useRecoilState(
		viewModeState
	);

	const [isActiveGlobalScreenshare, setIsActiveGlobalScreenshare] = useRecoilState(
		isActiveGlobalScreenshareState
	);


	if(isActiveGlobalScreenshare){
		return(
			<Grid container className={classes.root}>
				<Grid item xs>
					<Screenshare />
				</Grid>
			</Grid>
		)
	}

	return (
		<Grid container className={classes.root}>
			<Grid item xs>
				{viewMode === 'onstage' && <OnStage />}
				{viewMode === 'observer' && <Observer />}
				{viewMode === 'present' && <Present />}
			</Grid>
		</Grid>
	);
}

export default MainView;
