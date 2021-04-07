import React from "react";

import { makeStyles, Grid, Theme, Box } from "@material-ui/core";
import MainView from "./mainView";
import MainDrawer from "./mainDrawer";
import Toolbar from "../toolbar";
import CanvasDrawer from "./canvasDrawer";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight: {},
	mainViewContainer: {
		display: "flex",
	},
	mainView: {
		padding: 10,
		overflow: "hidden",
		display: "flex",
		flex: 1,
	},
	mainViewDrawer: {
		position: "relative",
	},
}));

function Main() {
	const classes = useStyles();

	return (
		<Grid container direction="column" style={{ height: "100vh" }}>
			<Grid item xs className={classes.mainViewContainer}>
				<Box className={classes.mainView}>
					<Grid container id="main-content">
						<Grid item xs>
							<MainView />
							<CanvasDrawer />
						</Grid>
						<Grid item className={classes.mainViewDrawer}>
							<MainDrawer />
						</Grid>
					</Grid>
				</Box>
			</Grid>
			<Grid item>
				<Toolbar />
			</Grid>
		</Grid>
	);
}

export default Main;
