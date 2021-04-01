import React from "react";

import { makeStyles, Grid, Theme } from "@material-ui/core";
import MainView from "./mainView";
import MainDrawer from "./mainDrawer";
import Toolbar from "../toolbar";

const useStyles = makeStyles((theme: Theme) => ({
	fullHeight : {},
	mainViewContaineer: {
		height: "100%",
		padding: 10,
	},
}));

function Main() {
	const classes = useStyles();

	return (
		<Grid container direction="column" style={{ height: "100vh" }}>
			<Grid item xs>
				<Grid container className={classes.mainViewContaineer}>
					<Grid item xs>
						<MainView />
					</Grid>
					<Grid item>
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
