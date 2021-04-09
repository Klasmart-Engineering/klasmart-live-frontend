import React from "react";

import { makeStyles, Grid, Theme, Box } from "@material-ui/core";

import OnStage from "./viewModes/onStage";
import Observe from "./viewModes/Observe";
import Present from "./viewModes/Present";

import { useRecoilState } from "recoil";
import { viewModeState, isActiveGlobalScreenshareState, pinnedUserState, usersState } from "../../states/layoutAtoms";
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
	const [viewMode, setViewMode] = useRecoilState(viewModeState);
	const [isActiveGlobalScreenshare, setIsActiveGlobalScreenshare] = useRecoilState(isActiveGlobalScreenshareState);
	const [pinnedUser, setPinnedUser] = useRecoilState(pinnedUserState);
	const [users, setUsers] = useRecoilState(usersState);

	if(isActiveGlobalScreenshare){
		return(
			<Grid container className={classes.root}>
				<Grid item xs>
					<Screenshare />
				</Grid>
			</Grid>
		)
	}

	if(pinnedUser){
		return(
			<Grid container className={classes.root}>
				<Grid item xs>
					<Box style={{display: 'flex', height: '100%', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}>
						SHOW CAMERA OF {pinnedUser}
						<br/>
						{users.filter(user => user.id === pinnedUser).map(user => user.name)}
					</Box>
				</Grid>
			</Grid>
		)
	}

	return (
		<Grid container className={classes.root}>
			<Grid item xs>
				{viewMode === 'onstage' && <OnStage />}
				{viewMode === 'observe' && <Observe />}
				{viewMode === 'present' && <Present />}
			</Grid>
		</Grid>
	);
}

export default MainView;
