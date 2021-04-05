import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";
import MainView from "./mainView";
import MainDrawer from "./mainDrawer";
import Toolbar from "../toolbar";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight: {},
	mainViewContainer: {
		height: "100%",
		padding: 10,
		overflow: "hidden",
	},
	mainViewDrawer: {
		position: "relative",
	},
}));

function Main() {
	const classes = useStyles();

	return (
		<Grid container direction="column" style={{ height: "100vh" }}>
			<Grid item xs>
				<Grid container className={classes.mainViewContainer}>
					<Grid item xs>
						<MainView />
					</Grid>
					<Grid item className={classes.mainViewDrawer}>
						<MainDrawer />
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Toolbar />
			</Grid>
		</Grid>
	);
}

export default Main;
